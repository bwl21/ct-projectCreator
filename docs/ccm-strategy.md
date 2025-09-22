# CCM API Datenorganisation Strategie

## Überblick

Die ChurchTools CCM API wird als Key-Value Store für die Projektorganisation genutzt. Jedes Projekt erhält eine eigene CustomDataCategory für optimale Berechtigungsverwaltung und Datentrennung.

## 1. Category-Struktur

### Projekt-Category Naming Convention
```
project_{slug}_{timestamp}

Beispiele:
- project_gemeindefest_2024_1705312800000
- project_jugendfreizeit_2024_1705399200000
- project_weihnachtsfeier_2023_1697846400000
```

### Category-Metadaten
```typescript
{
  id: number,                    // ChurchTools Category ID
  customModuleId: number,        // Unsere Extension ID
  name: string,                  // "project_gemeindefest_2024_1705312800000"
  description: string,           // "Daten für Projekt: Gemeindefest 2024"
  shorty: string,               // "gf24"
  securityLevelId: number,      // Projekt-spezifische Berechtigungen
  schema: string                // JSON Schema für Validierung
}
```

## 2. Value-Organisation

### Value-Typen und Naming
```
project_meta                    // Projekt-Stammdaten (1x pro Projekt)
work_area_{id}                 // Arbeitsbereich-Details (nx pro Projekt)
setup_todo_{id}                // Setup-Aufgaben (nx pro Projekt)
wiki_config                    // Wiki-Konfiguration (1x pro Projekt)
calendar_config                // Kalender-Konfiguration (1x pro Projekt)
communication_config           // Kommunikations-Setup (1x pro Projekt)
service_config                 // Dienste-Konfiguration (1x pro Projekt)
```

### ChurchTools-Referenzen über domainId/domainType
```typescript
// Arbeitsbereich mit Gruppen-Referenz
{
  dataCategoryId: 123,
  domainId: 456,              // ChurchTools Group ID
  domainType: "group",
  value: JSON.stringify(workAreaData)
}

// Wiki-Konfiguration mit Wiki-Referenz
{
  dataCategoryId: 123,
  domainId: 101,              // ChurchTools Wiki Page ID
  domainType: "wiki_page",
  value: JSON.stringify(wikiConfigData)
}

// Kalender-Konfiguration mit Kalender-Referenz
{
  dataCategoryId: 123,
  domainId: 789,              // ChurchTools Calendar ID
  domainType: "calendar",
  value: JSON.stringify(calendarConfigData)
}
```

## 3. Berechtigungsmodell

### Security Level pro Projekt
```typescript
interface ProjectSecurityLevel {
  id: number,
  name: string,               // "Projekt: Gemeindefest 2024"
  permissions: {
    'view custom data': number[],      // Alle Projektmitglieder
    'edit custom data': number[],      // Teamleiter + Projektleiter
    'create custom data': number[],    // Teamleiter + Projektleiter
    'delete custom data': number[]     // Nur Projektleiter
  }
}
```

### Hierarchische Berechtigungen
```
Projektleiter (leaderId)
├── Vollzugriff auf alle Projektdaten
├── Kann Arbeitsbereiche erstellen/löschen
├── Kann Berechtigungen verwalten
└── Kann Projekt archivieren/löschen

Teamleiter (workArea.leaderId)
├── Vollzugriff auf eigenen Arbeitsbereich
├── Kann Team-Mitglieder verwalten
├── Kann Setup-Todos abschließen
└── Lesezugriff auf andere Bereiche

Team-Mitglieder (workArea.members)
├── Lesezugriff auf Projektdaten
├── Kann eigene Aufgaben bearbeiten
├── Kann an Team-Diskussionen teilnehmen
└── Kann Setup-Todos einsehen
```

## 4. Performance-Optimierung

### Lazy Loading Strategie
```typescript
// Immer laden (Dashboard)
project_meta                   // Projekt-Übersicht

// Bei Bedarf laden (Detail-Ansicht)
work_area_summary             // Team-Übersicht
work_area_{id}               // Einzelne Team-Details
setup_todos_active           // Aktive Setup-Aufgaben
setup_todos_completed        // Abgeschlossene Aufgaben

// Selten laden (Konfiguration)
wiki_config
calendar_config
communication_config
service_config
```

### Caching-Strategie
```typescript
// Browser-Cache (5 Minuten)
- Projekt-Listen
- Team-Übersichten
- Setup-Status

// Session-Cache (bis Reload)
- Aktuelle Projekt-Details
- User-Berechtigungen
- ChurchTools-Referenzen

// Local Storage (persistent)
- User-Präferenzen
- Dashboard-Filter
- Zuletzt besuchte Projekte
```

## 5. Daten-Konsistenz

### Referenz-Integrität
```typescript
// ChurchTools-Referenzen verwalten
interface ReferenceTracker {
  groups: {
    [groupId: number]: {
      projectId: string,
      workAreaId: string,
      usage: "main" | "team" | "communication"
    }
  },
  
  calendars: {
    [calendarId: number]: {
      projectId: string,
      workAreaId?: string,
      usage: "main" | "team"
    }
  },
  
  wiki_pages: {
    [pageId: number]: {
      projectId: string,
      section: string,
      teamId?: string
    }
  }
}
```

### Transaktionale Updates
```typescript
// Batch-Operations für konsistente Änderungen
interface BatchOperation {
  projectId: string,
  operations: [
    {
      type: "create" | "update" | "delete",
      valueType: string,
      valueId: string,
      data: any,
      domainId?: number,
      domainType?: string
    }
  ],
  rollback: any[]  // Rollback-Daten bei Fehlern
}
```

## 6. API-Wrapper Service

### Projekt-Service Interface
```typescript
class ProjectCCMService {
  // Projekt-Management
  async createProject(data: ProjectCreateData): Promise<string>
  async getProject(categoryId: string): Promise<ProjectData>
  async updateProject(categoryId: string, updates: Partial<ProjectData>): Promise<void>
  async deleteProject(categoryId: string): Promise<void>
  async getAllProjects(): Promise<ProjectSummary[]>
  
  // Arbeitsbereich-Management
  async addWorkArea(projectId: string, data: WorkAreaData): Promise<string>
  async updateWorkArea(projectId: string, workAreaId: string, updates: Partial<WorkAreaData>): Promise<void>
  async deleteWorkArea(projectId: string, workAreaId: string): Promise<void>
  
  // Setup-Management
  async getSetupTodos(projectId: string): Promise<SetupTodoData[]>
  async updateSetupTodo(projectId: string, todoId: string, updates: Partial<SetupTodoData>): Promise<void>
  async executeSetupAction(projectId: string, todoId: string): Promise<void>
  
  // Konfiguration
  async getWikiConfig(projectId: string): Promise<WikiConfigData>
  async updateWikiConfig(projectId: string, config: WikiConfigData): Promise<void>
  async getCalendarConfig(projectId: string): Promise<CalendarConfigData>
  async updateCalendarConfig(projectId: string, config: CalendarConfigData): Promise<void>
  
  // ChurchTools-Integration
  async createChurchToolsGroup(projectId: string, groupData: any): Promise<number>
  async createChurchToolsCalendar(projectId: string, calendarData: any): Promise<number>
  async createChurchToolsWikiPage(projectId: string, pageData: any): Promise<number>
}
```

## 7. Fehlerbehandlung

### Retry-Mechanismus
```typescript
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
    }
  }
  throw new Error('Max retries exceeded')
}
```

### Offline-Unterstützung
```typescript
// Offline-Queue für Änderungen
interface OfflineOperation {
  id: string,
  timestamp: string,
  operation: string,
  data: any,
  retry: number
}

class OfflineManager {
  private queue: OfflineOperation[] = []
  
  async queueOperation(operation: OfflineOperation): Promise<void>
  async syncWhenOnline(): Promise<void>
  async clearQueue(): Promise<void>
}
```

## 8. Migration und Versionierung

### Schema-Evolution
```typescript
interface DataMigration {
  version: string,
  description: string,
  migrate: (oldData: any) => any,
  rollback: (newData: any) => any
}

const migrations: DataMigration[] = [
  {
    version: "1.1.0",
    description: "Add service configuration",
    migrate: (data) => ({
      ...data,
      service_config: defaultServiceConfig
    }),
    rollback: (data) => {
      const { service_config, ...rest } = data
      return rest
    }
  }
]
```

Diese Strategie gewährleistet eine skalierbare, wartbare und performante Lösung für die Projektorganisation mit der ChurchTools CCM API.