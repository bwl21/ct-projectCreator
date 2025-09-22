# ChurchTools CCM API Integration für Projektorganisation

## Überblick

Diese Dokumentation beschreibt die Integration der ChurchTools Custom Module (CCM) API für die Projektorganisation-Extension. Der Ansatz nutzt **projekt-spezifische CustomDataCategories** für optimale Berechtigungsverwaltung und Datentrennung.

## Architektur-Konzept

### Grundprinzip: Ein Projekt = Eine CustomDataCategory

Jedes mit dem Project Creator angelegte Projekt erhält eine eigene `CustomDataCategory` in ChurchTools. Dies ermöglicht:

- **Granulare Berechtigungen** pro Projekt über ChurchTools Security Levels
- **Saubere Datentrennung** zwischen Projekten
- **Skalierbare Architektur** ohne Performance-Einbußen
- **Einfache Wartung** und Debugging

### CCM API Endpunkte

Basierend auf der README.md stehen folgende Endpunkte zur Verfügung:

```
GET    /custommodules                                    # Alle Extensions
GET    /custommodules/{extensionkey}                     # Extension by Key
GET    /custommodules/{moduleId}                         # Extension by ID

GET    /custommodules/{moduleId}/customdatacategories    # Datenkategorien
POST   /custommodules/{moduleId}/customdatacategories    # Kategorie erstellen
PUT    /custommodules/{moduleId}/customdatacategories/{dataCategoryId}
DELETE /custommodules/{moduleId}/customdatacategories/{dataCategoryId}

GET    /custommodules/{moduleId}/customdatacategories/{dataCategoryId}/customdatavalues
POST   /custommodules/{moduleId}/customdatacategories/{dataCategoryId}/customdatavalues
PUT    /custommodules/{moduleId}/customdatacategories/{dataCategoryId}/customdatavalues/{valueId}
DELETE /custommodules/{moduleId}/customdatacategories/{dataCategoryId}/customdatavalues/{valueId}
```

## Datenmodell

### TypeScript Interfaces

```typescript
// Basis-Typen aus ct-types.d.ts
export type CustomModuleDataCategory = CustomModuleDataCategoryCreate & {
  id: number
}

export type CustomModuleDataCategoryCreate = {
  customModuleId: number
  description: string
  name: string
  schema?: string
  securityLevelId?: number  // Projekt-spezifische Berechtigungen
  shorty: string
}

export type CustomModuleDataValue = CustomModuleDataValueCreate & {
  id: number
}

export type CustomModuleDataValueCreate = {
  dataCategoryId: number
  domainId?: number        // ChurchTools Referenz (Group, Person, etc.)
  domainType?: string      // Typ der Referenz ("group", "person", "wiki")
  value?: string          // JSON-String mit Projektdaten
}

// Projekt-spezifische Interfaces
interface ProjectData {
  type: "project_meta"
  name: string
  description: string
  externalDescription?: string
  status: "planning" | "active" | "completed" | "archived"
  leaderId: number
  categoryId: number
  createdAt: string
  updatedAt: string
  workAreas: WorkAreaData[]
  setupTodos: SetupTodoData[]
  wikiConfig?: WikiConfigData
}

interface WorkAreaData {
  type: "work_area"
  id: string
  name: string
  description?: string
  parentId?: string        // Für Unterteams
  groupId?: number         // ChurchTools Group ID
  calendarId?: number      // ChurchTools Calendar ID
  members: ProjectMember[]
}

interface SetupTodoData {
  type: "setup_todo"
  id: string
  title: string
  description: string
  todoType: "group" | "calendar" | "wiki" | "permissions"
  completed: boolean
  completedAt?: string
  action: string           // Aktion die ausgeführt werden soll
}

interface WikiConfigData {
  type: "wiki_config"
  mainPageId?: number
  structure: Record<string, {
    pageId?: number
    teamId?: string
  }>
}
```

### Projekt-Category Struktur

Jede Projekt-Category enthält verschiedene `CustomDataValues` mit unterschiedlichen Datentypen:

```typescript
// Beispiel: Projekt "Gemeindefest 2024"
// Category: "project_gemeindefest_2024"

// Value 1: Projekt-Metadaten
{
  dataCategoryId: projectCategoryId,
  value: JSON.stringify({
    type: "project_meta",
    name: "Gemeindefest 2024",
    description: "Großes Sommerfest der Gemeinde",
    status: "planning",
    leaderId: 123,
    categoryId: projectCategoryId,
    createdAt: "2024-01-15T10:00:00Z"
  })
}

// Value 2: Arbeitsbereich mit ChurchTools-Referenz
{
  dataCategoryId: projectCategoryId,
  domainId: 456,           // ChurchTools Group ID
  domainType: "group",
  value: JSON.stringify({
    type: "work_area",
    id: "wa_catering",
    name: "Catering-Team",
    description: "Verpflegung und Getränke",
    groupId: 456,
    calendarId: 789,
    members: [...]
  })
}

// Value 3: Setup-Todo
{
  dataCategoryId: projectCategoryId,
  value: JSON.stringify({
    type: "setup_todo",
    id: "todo_1",
    title: "Projektgruppe anlegen",
    description: "Hauptgruppe für alle Projektmitglieder",
    todoType: "group",
    completed: false,
    action: "createProjectGroup"
  })
}
```

## Service Layer Implementation

### ProjectCCMService

```typescript
// src/services/projectCCMService.ts
import { churchtoolsClient } from './churchtools'

export class ProjectCCMService {
  private moduleId: number

  constructor(moduleId: number) {
    this.moduleId = moduleId
  }

  /**
   * Neues Projekt anlegen = neue CustomDataCategory erstellen
   */
  async createProject(projectData: ProjectCreateData): Promise<string> {
    // 1. Category für das Projekt erstellen
    const categoryName = this.generateProjectCategoryName(projectData.name)
    const category = await churchtoolsClient.post(
      `/custommodules/${this.moduleId}/customdatacategories`,
      {
        name: categoryName,
        description: `Daten für Projekt: ${projectData.name}`,
        shorty: this.generateShorty(projectData.name),
        securityLevelId: projectData.securityLevelId,
        schema: JSON.stringify(this.getProjectSchema())
      }
    )

    // 2. Projekt-Metadaten als ersten Value speichern
    await churchtoolsClient.post(
      `/custommodules/${this.moduleId}/customdatacategories/${category.id}/customdatavalues`,
      {
        value: JSON.stringify({
          type: "project_meta",
          ...projectData,
          categoryId: category.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
    )

    return category.id.toString()
  }

  /**
   * Projekt-Daten laden
   */
  async getProject(projectCategoryId: string): Promise<ProjectData> {
    const values = await churchtoolsClient.get(
      `/custommodules/${this.moduleId}/customdatacategories/${projectCategoryId}/customdatavalues`
    )
    
    const projectMeta = values.find(v => {
      try {
        const data = JSON.parse(v.value)
        return data.type === "project_meta"
      } catch {
        return false
      }
    })
    
    if (!projectMeta) {
      throw new Error("Project metadata not found")
    }
    
    const baseData = JSON.parse(projectMeta.value)
    
    return {
      ...baseData,
      workAreas: this.extractWorkAreas(values),
      setupTodos: this.extractSetupTodos(values),
      wikiConfig: this.extractWikiConfig(values)
    }
  }

  /**
   * Alle Projekte laden (nur die mit Berechtigung)
   */
  async getAllProjects(): Promise<ProjectSummary[]> {
    const categories = await churchtoolsClient.get(
      `/custommodules/${this.moduleId}/customdatacategories`
    )
    
    const projects: ProjectSummary[] = []
    
    for (const category of categories) {
      try {
        const projectData = await this.getProject(category.id.toString())
        projects.push({
          categoryId: category.id,
          name: projectData.name,
          status: projectData.status,
          leaderId: projectData.leaderId,
          description: projectData.description,
          updatedAt: projectData.updatedAt,
          hasPermission: true
        })
      } catch (error) {
        // User hat keine Berechtigung für diese Category
        console.debug(`No permission for project category ${category.id}`)
      }
    }
    
    return projects
  }

  /**
   * Arbeitsbereich hinzufügen
   */
  async addWorkArea(projectCategoryId: string, workAreaData: WorkAreaData): Promise<void> {
    await churchtoolsClient.post(
      `/custommodules/${this.moduleId}/customdatacategories/${projectCategoryId}/customdatavalues`,
      {
        value: JSON.stringify({
          type: "work_area",
          id: this.generateWorkAreaId(),
          ...workAreaData,
          createdAt: new Date().toISOString()
        }),
        domainId: workAreaData.groupId,
        domainType: "group"
      }
    )
  }

  /**
   * Setup-Todo aktualisieren
   */
  async updateSetupTodo(
    projectCategoryId: string, 
    todoId: string, 
    updates: Partial<SetupTodoData>
  ): Promise<void> {
    const values = await this.getProjectValues(projectCategoryId)
    const todoValue = values.find(v => {
      try {
        const data = JSON.parse(v.value)
        return data.type === "setup_todo" && data.id === todoId
      } catch {
        return false
      }
    })

    if (todoValue) {
      const todoData = JSON.parse(todoValue.value)
      const updatedTodo = {
        ...todoData,
        ...updates,
        updatedAt: new Date().toISOString()
      }

      if (updates.completed && !todoData.completed) {
        updatedTodo.completedAt = new Date().toISOString()
      }

      await churchtoolsClient.put(
        `/custommodules/${this.moduleId}/customdatacategories/${projectCategoryId}/customdatavalues/${todoValue.id}`,
        {
          value: JSON.stringify(updatedTodo)
        }
      )
    }
  }

  /**
   * Projekt löschen (Category löschen)
   */
  async deleteProject(projectCategoryId: string): Promise<void> {
    await churchtoolsClient.deleteApi(
      `/custommodules/${this.moduleId}/customdatacategories/${projectCategoryId}`
    )
  }

  // Private Helper Methods
  private generateProjectCategoryName(projectName: string): string {
    const slug = projectName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
    
    const timestamp = Date.now()
    return `project_${slug}_${timestamp}`
  }

  private generateShorty(projectName: string): string {
    return projectName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toLowerCase()
      .substring(0, 4)
  }

  private generateWorkAreaId(): string {
    return `wa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private async getProjectValues(projectCategoryId: string): Promise<CustomModuleDataValue[]> {
    return await churchtoolsClient.get(
      `/custommodules/${this.moduleId}/customdatacategories/${projectCategoryId}/customdatavalues`
    )
  }

  private extractWorkAreas(values: CustomModuleDataValue[]): WorkAreaData[] {
    return values
      .filter(v => {
        try {
          return JSON.parse(v.value).type === "work_area"
        } catch {
          return false
        }
      })
      .map(v => JSON.parse(v.value))
  }

  private extractSetupTodos(values: CustomModuleDataValue[]): SetupTodoData[] {
    return values
      .filter(v => {
        try {
          return JSON.parse(v.value).type === "setup_todo"
        } catch {
          return false
        }
      })
      .map(v => JSON.parse(v.value))
  }

  private extractWikiConfig(values: CustomModuleDataValue[]): WikiConfigData | undefined {
    const wikiValue = values.find(v => {
      try {
        return JSON.parse(v.value).type === "wiki_config"
      } catch {
        return false
      }
    })
    
    return wikiValue ? JSON.parse(wikiValue.value) : undefined
  }

  private getProjectSchema() {
    return {
      type: "object",
      properties: {
        type: { type: "string" },
        name: { type: "string", minLength: 1 },
        description: { type: "string" },
        status: { 
          type: "string", 
          enum: ["planning", "active", "completed", "archived"] 
        },
        leaderId: { type: "number" },
        categoryId: { type: "number" }
      },
      required: ["type", "name", "status", "leaderId"]
    }
  }
}
```

## Berechtigungsmanagement

### Security Level Integration

```typescript
// Projekt-Setup mit Berechtigungen
interface ProjectPermissionSetup {
  leaderId: number
  teamLeaderIds: number[]
  memberIds: number[]
  viewerIds: number[]
}

async function setupProjectWithPermissions(
  projectData: ProjectCreateData,
  permissions: ProjectPermissionSetup
): Promise<string> {
  // 1. Security Level für das Projekt definieren
  const securityLevel = await createProjectSecurityLevel({
    name: `Projekt: ${projectData.name}`,
    permissions: {
      'view custom data': [
        permissions.leaderId,
        ...permissions.teamLeaderIds,
        ...permissions.memberIds,
        ...permissions.viewerIds
      ],
      'edit custom data': [
        permissions.leaderId,
        ...permissions.teamLeaderIds
      ],
      'create custom data': [
        permissions.leaderId,
        ...permissions.teamLeaderIds
      ],
      'delete custom data': [permissions.leaderId]
    }
  })

  // 2. Projekt mit Security Level erstellen
  const projectCategoryId = await projectCCMService.createProject({
    ...projectData,
    securityLevelId: securityLevel.id
  })

  return projectCategoryId
}
```

## Vue Composables Integration

### useProjectData Composable

```typescript
// src/composables/useProjectData.ts
import { ref, readonly } from 'vue'
import { ProjectCCMService } from '@/services/projectCCMService'

export function useProjectData() {
  const projects = ref<ProjectSummary[]>([])
  const currentProject = ref<ProjectData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const projectCCMService = new ProjectCCMService(MODULE_ID)

  const loadProjects = async () => {
    loading.value = true
    error.value = null
    try {
      projects.value = await projectCCMService.getAllProjects()
    } catch (err) {
      error.value = 'Failed to load projects'
      console.error('Failed to load projects:', err)
    } finally {
      loading.value = false
    }
  }

  const loadProject = async (categoryId: string) => {
    loading.value = true
    error.value = null
    try {
      currentProject.value = await projectCCMService.getProject(categoryId)
    } catch (err) {
      error.value = 'Failed to load project'
      console.error('Failed to load project:', err)
    } finally {
      loading.value = false
    }
  }

  const createProject = async (projectData: ProjectCreateData) => {
    loading.value = true
    error.value = null
    try {
      const categoryId = await projectCCMService.createProject(projectData)
      await loadProjects() // Refresh list
      return categoryId
    } catch (err) {
      error.value = 'Failed to create project'
      console.error('Failed to create project:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateSetupTodo = async (
    projectCategoryId: string,
    todoId: string,
    updates: Partial<SetupTodoData>
  ) => {
    try {
      await projectCCMService.updateSetupTodo(projectCategoryId, todoId, updates)
      if (currentProject.value?.categoryId.toString() === projectCategoryId) {
        await loadProject(projectCategoryId) // Refresh current project
      }
    } catch (err) {
      error.value = 'Failed to update setup todo'
      console.error('Failed to update setup todo:', err)
      throw err
    }
  }

  return {
    projects: readonly(projects),
    currentProject: readonly(currentProject),
    loading: readonly(loading),
    error: readonly(error),
    loadProjects,
    loadProject,
    createProject,
    updateSetupTodo,
    addWorkArea: projectCCMService.addWorkArea.bind(projectCCMService),
    deleteProject: projectCCMService.deleteProject.bind(projectCCMService)
  }
}
```

## Vorteile dieser Architektur

### ✅ Granulare Berechtigungen
- Jedes Projekt hat eigene Zugriffsrechte über ChurchTools Security Levels
- Automatische Rechteverwaltung durch ChurchTools
- Benutzer sehen nur Projekte mit entsprechender Berechtigung

### ✅ Saubere Datentrennung
- Projekte sind vollständig isoliert voneinander
- Keine Datenvermischung zwischen Projekten
- Einfache Projekt-Archivierung durch Category-Deaktivierung

### ✅ Skalierbarkeit
- Beliebig viele Projekte möglich
- Performance: Nur relevante Daten werden geladen
- Berechtigungsfilterung auf API-Ebene

### ✅ Flexibilität
- Verschiedene Datentypen pro Projekt über JSON
- Erweiterbare Struktur ohne Schema-Änderungen
- ChurchTools-Referenzen über domainId/domainType

### ✅ Wartbarkeit
- Klare Datenstruktur mit Type-Safety
- Einfache Backup/Restore pro Projekt
- Debugging vereinfacht durch Projekt-Isolation

## Best Practices

### 1. Fehlerbehandlung
```typescript
// Immer try-catch für CCM API Calls
try {
  const result = await projectCCMService.getProject(categoryId)
  return result
} catch (error) {
  if (error.status === 403) {
    // Keine Berechtigung
    throw new Error('Keine Berechtigung für dieses Projekt')
  } else if (error.status === 404) {
    // Projekt nicht gefunden
    throw new Error('Projekt nicht gefunden')
  } else {
    // Allgemeiner Fehler
    throw new Error('Fehler beim Laden des Projekts')
  }
}
```

### 2. Performance Optimierung
```typescript
// Lazy Loading für Projekt-Details
const projectSummaries = await projectCCMService.getAllProjects() // Nur Metadaten
const fullProject = await projectCCMService.getProject(categoryId) // Vollständige Daten bei Bedarf
```

### 3. Datenvalidierung
```typescript
// JSON Schema für Validierung nutzen
const schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1, maxLength: 100 },
    status: { type: "string", enum: ["planning", "active", "completed", "archived"] }
  },
  required: ["name", "status"]
}
```

### 4. Caching
```typescript
// Projekt-Daten cachen für bessere Performance
const projectCache = new Map<string, { data: ProjectData, timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 Minuten

async function getCachedProject(categoryId: string): Promise<ProjectData> {
  const cached = projectCache.get(categoryId)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  
  const data = await projectCCMService.getProject(categoryId)
  projectCache.set(categoryId, { data, timestamp: Date.now() })
  return data
}
```

## Migration und Deployment

### Initiale Setup
1. Extension in ChurchTools installieren
2. Module ID ermitteln
3. Basis-Berechtigungen konfigurieren
4. Erste Projekte anlegen

### Datenbackup
```typescript
// Backup aller Projekte
async function backupAllProjects(): Promise<ProjectBackup[]> {
  const projects = await projectCCMService.getAllProjects()
  const backups = []
  
  for (const project of projects) {
    const fullData = await projectCCMService.getProject(project.categoryId.toString())
    backups.push({
      categoryId: project.categoryId,
      data: fullData,
      backupDate: new Date().toISOString()
    })
  }
  
  return backups
}
```

Diese Architektur bietet eine robuste, skalierbare und wartbare Lösung für die Projektorganisation in ChurchTools mit optimaler Nutzung der CCM API.