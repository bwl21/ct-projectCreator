# Datenstrukturen für ChurchTools CCM Key-Value Store

## Überblick

Basierend auf dem Lastenheft werden alle Projektdaten in ChurchTools CustomDataCategories (eine pro Projekt) als JSON-Strukturen gespeichert. Jede Category enthält verschiedene CustomDataValues für unterschiedliche Datentypen.

## Projekt-Category Struktur

```
CustomDataCategory: "project_gemeindefest_2024_1705312800000"
├── Security Level: Projekt-spezifische Berechtigungen
├── Schema: JSON Schema für Datenvalidierung
└── CustomDataValues:
    ├── project_meta (Projekt-Stammdaten)
    ├── work_area_* (Arbeitsbereiche/Teams)
    ├── setup_todo_* (Einrichtungsaufgaben)
    ├── wiki_config (Wiki-Struktur)
    ├── calendar_config (Kalender-Konfiguration)
    ├── communication_config (Kommunikations-Einstellungen)
    └── service_config (Dienste-Konfiguration)
```

## Detaillierte Datenstrukturen

### 1. Projekt-Metadaten (project_meta)

```typescript
interface ProjectMetaData {
  type: "project_meta"
  id: string
  name: string
  description: string
  externalDescription?: string
  status: "planning" | "active" | "completed" | "archived"
  leaderId: number
  categoryId: number
  createdAt: string
  updatedAt: string
  
  // Projekt-spezifische Einstellungen
  settings: {
    autoCreateGroups: boolean
    autoCreateCalendar: boolean
    autoCreateWiki: boolean
    enableCommunication: boolean
    enableServices: boolean
  }
  
  // Projekt-Statistiken
  stats: {
    totalMembers: number
    totalWorkAreas: number
    setupProgress: number
    lastActivity: string
  }
}
```

### 2. Arbeitsbereiche/Teams (work_area_*)

```typescript
interface WorkAreaData {
  type: "work_area"
  id: string
  name: string
  description?: string
  parentId?: string  // Für hierarchische Teams
  
  // ChurchTools-Verknüpfungen
  groupId?: number      // ChurchTools Group ID
  calendarId?: number   // ChurchTools Calendar ID
  wikiPageId?: number   // ChurchTools Wiki Page ID
  
  // Team-Management
  leaderId?: number
  members: ProjectMember[]
  
  // Aufgaben und Verantwortlichkeiten
  responsibilities: string[]
  budget?: number
  
  // Status und Metadaten
  status: "planning" | "active" | "completed"
  createdAt: string
  updatedAt: string
}

interface ProjectMember {
  personId: number
  role: "leader" | "member" | "guest"
  joinedAt: string
  permissions: string[]
}
```

### 3. Setup-Todos (setup_todo_*)

```typescript
interface SetupTodoData {
  type: "setup_todo"
  id: string
  title: string
  description: string
  
  // Todo-Klassifizierung
  todoType: "group" | "calendar" | "wiki" | "permissions" | "communication" | "services"
  priority: "high" | "medium" | "low"
  category: "initial" | "team_setup" | "integration" | "finalization"
  
  // Status und Ausführung
  completed: boolean
  completedAt?: string
  completedBy?: number
  
  // Automatisierung
  action: string
  actionParams?: Record<string, any>
  
  // Abhängigkeiten
  dependencies: string[]
  dependents: string[]
  
  // Schätzungen
  estimatedDuration: number  // Minuten
  actualDuration?: number
  
  // Anweisungen
  instructions?: string[]
  
  // Metadaten
  createdAt: string
  updatedAt: string
}
```

### 4. Wiki-Konfiguration (wiki_config)

```typescript
interface WikiConfigData {
  type: "wiki_config"
  mainPageId?: number
  
  // Wiki-Struktur
  structure: {
    [sectionName: string]: {
      pageId?: number
      teamId?: string
      description?: string
      permissions: string[]
      children?: Record<string, WikiSection>
    }
  }
  
  // Templates für automatische Seitenerstellung
  templates: {
    [templateName: string]: {
      title: string
      content: string
      variables: string[]
    }
  }
  
  // Wiki-Einstellungen
  settings: {
    autoCreatePages: boolean
    defaultPermissions: string[]
    linkToGroups: boolean
  }
  
  createdAt: string
  updatedAt: string
}
```

### 5. Kalender-Konfiguration (calendar_config)

```typescript
interface CalendarConfigData {
  type: "calendar_config"
  
  // Haupt-Projektkalender
  mainCalendarId?: number
  
  // Team-spezifische Kalender
  teamCalendars: {
    [teamId: string]: {
      calendarId: number
      name: string
      color: string
      permissions: string[]
    }
  }
  
  // Event-Kategorien
  eventCategories: {
    [categoryId: string]: {
      name: string
      color: string
      defaultDuration: number
      autoNotify: boolean
      requiredFields: string[]
    }
  }
  
  // Kalender-Einstellungen
  settings: {
    autoCreateEvents: boolean
    syncWithTeamCalendars: boolean
    defaultEventDuration: number
    reminderSettings: {
      enabled: boolean
      defaultReminder: number  // Minuten vor Event
    }
  }
  
  createdAt: string
  updatedAt: string
}
```

### 6. Kommunikations-Konfiguration (communication_config)

```typescript
interface CommunicationConfigData {
  type: "communication_config"
  
  // Kommunikationskanäle
  channels: {
    announcements: {
      type: "posts" | "chat"
      groupId?: number
      permissions: string[]
      autoNotify: boolean
      emailNotification: boolean
    }
    
    general_discussion: {
      type: "chat"
      groupId?: number
      permissions: string[]
      autoNotify: boolean
    }
    
    team_channels: {
      [teamId: string]: {
        type: "chat" | "posts"
        groupId?: number
        channelName: string
        permissions: string[]
      }
    }
  }
  
  // Benachrichtigungs-Einstellungen
  notifications: {
    newMember: boolean
    todoCompleted: boolean
    deadlineReminder: boolean
    eventCreated: boolean
    wikiUpdated: boolean
    
    // Benachrichtigungs-Methoden
    methods: {
      inApp: boolean
      email: boolean
      push: boolean
    }
  }
  
  // Kommunikations-Templates
  templates: {
    welcomeMessage: string
    projectUpdate: string
    deadlineReminder: string
  }
  
  createdAt: string
  updatedAt: string
}
```

### 7. Dienste-Konfiguration (service_config)

```typescript
interface ServiceConfigData {
  type: "service_config"
  
  // Dienst-Kategorien
  serviceCategories: {
    [categoryId: string]: {
      name: string
      description: string
      teamId?: string
      color: string
      requiredSkills: string[]
      defaultDuration: number
    }
  }
  
  // Dienst-Templates
  serviceTemplates: {
    [templateId: string]: {
      name: string
      description: string
      categoryId: string
      duration: number
      requiredPersons: number
      skills: string[]
      equipment: string[]
    }
  }
  
  // Dienst-Planung
  planning: {
    [eventId: string]: {
      eventName: string
      eventDate: string
      calendarEventId?: number
      services: {
        [serviceId: string]: {
          templateId: string
          assignedPersons: number[]
          status: "planned" | "confirmed" | "completed"
          notes?: string
        }
      }
    }
  }
  
  // Dienst-Einstellungen
  settings: {
    autoAssignServices: boolean
    requireConfirmation: boolean
    sendReminders: boolean
    reminderDays: number[]
  }
  
  createdAt: string
  updatedAt: string
}
```

## Key-Value Store Optimierungen

### 1. Daten-Partitionierung

```typescript
// Große Datenstrukturen aufteilen für bessere Performance
interface DataPartitioning {
  // Basis-Projektdaten (immer geladen)
  project_meta: ProjectMetaData
  
  // Lazy-Loading Bereiche (bei Bedarf geladen)
  work_areas_summary: WorkAreaSummary[]  // Nur Übersicht
  work_area_details_[id]: WorkAreaData   // Einzelne Details
  
  setup_todos_active: SetupTodoData[]    // Nur aktive Todos
  setup_todos_completed: SetupTodoData[] // Abgeschlossene Todos
  
  // Konfigurationsdaten (selten geändert)
  wiki_config: WikiConfigData
  calendar_config: CalendarConfigData
  communication_config: CommunicationConfigData
  service_config: ServiceConfigData
}
```

### 2. Indizierung und Suche

```typescript
// Zusätzliche Index-Strukturen für schnelle Suche
interface ProjectIndex {
  type: "project_index"
  
  // Projekt-Übersicht für Dashboard
  projects_by_status: {
    [status: string]: string[]  // Project Category IDs
  }
  
  projects_by_leader: {
    [leaderId: number]: string[]
  }
  
  projects_by_member: {
    [memberId: number]: string[]
  }
  
  // Volltext-Suche Indizes
  search_index: {
    [keyword: string]: string[]  // Project Category IDs
  }
  
  // Statistiken
  global_stats: {
    totalProjects: number
    activeProjects: number
    totalMembers: number
    lastUpdated: string
  }
}
```

### 3. Versionierung und Backup

```typescript
// Versionierung für wichtige Änderungen
interface DataVersion {
  type: "data_version"
  projectId: string
  version: number
  timestamp: string
  changedBy: number
  changeType: "created" | "updated" | "deleted"
  dataType: string
  backup: any  // Backup der vorherigen Version
}
```

## Daten-Konsistenz Strategien

### 1. Referenz-Integrität

```typescript
// Referenzen zwischen Datenstrukturen verwalten
interface ReferenceManager {
  // ChurchTools-Referenzen
  churchtools_refs: {
    groups: { [groupId: number]: string[] }      // Welche Projekte nutzen diese Gruppe
    calendars: { [calendarId: number]: string[] }
    wiki_pages: { [pageId: number]: string[] }
    persons: { [personId: number]: string[] }
  }
  
  // Interne Referenzen
  internal_refs: {
    work_area_hierarchy: { [parentId: string]: string[] }  // Child Work Areas
    todo_dependencies: { [todoId: string]: string[] }      // Abhängige Todos
  }
}
```

### 2. Transaktionale Updates

```typescript
// Batch-Updates für konsistente Datenänderungen
interface BatchUpdate {
  type: "batch_update"
  projectId: string
  operations: {
    operation: "create" | "update" | "delete"
    dataType: string
    dataId: string
    data: any
  }[]
  timestamp: string
  userId: number
}
```

Diese Datenstrukturen ermöglichen eine flexible, skalierbare Lösung im ChurchTools Key-Value Store, die alle Anforderungen des Lastenhefts erfüllt.