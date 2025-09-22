# Projekt-Architektur: CCM Category-basierte Projektorganisation

## Architektur-Überblick

Die ChurchTools Projektorganisation-Extension nutzt einen innovativen Ansatz: **Jedes Projekt wird als eigene CustomDataCategory** in der ChurchTools CCM API gespeichert. Dies ermöglicht granulare Berechtigungen und saubere Datentrennung.

## Konzeptionelle Struktur

### 1. Extension-Ebene
```
ChurchTools Extension: "Project Creator"
├── Module ID: {extensionModuleId}
└── CustomDataCategories:
    ├── project_gemeindefest_2024_{timestamp}
    ├── project_jugendfreizeit_2024_{timestamp}
    ├── project_weihnachtsfeier_2024_{timestamp}
    └── ...
```

### 2. Projekt-Ebene (CustomDataCategory)
```
CustomDataCategory: "project_gemeindefest_2024_1705312800000"
├── Security Level: Projekt-spezifische Berechtigungen
├── Schema: JSON Schema für Datenvalidierung
└── CustomDataValues:
    ├── project_meta (Projekt-Stammdaten)
    ├── work_area_catering (Arbeitsbereich mit Group-Referenz)
    ├── work_area_programm (Arbeitsbereich mit Group-Referenz)
    ├── setup_todo_1 (Einrichtungsaufgabe)
    ├── setup_todo_2 (Einrichtungsaufgabe)
    ├── wiki_config (Wiki-Struktur)
    └── ...
```

### 3. Daten-Ebene (CustomDataValues)
```
CustomDataValue: "project_meta"
├── Type: "project_meta"
├── Data: Projekt-Stammdaten (JSON)
├── Domain Reference: Keine
└── Permissions: Über Category Security Level

CustomDataValue: "work_area_catering"
├── Type: "work_area"
├── Data: Arbeitsbereich-Konfiguration (JSON)
├── Domain Reference: ChurchTools Group ID
└── Permissions: Über Category Security Level
```

## Detaillierte Datenstrukturen

### CustomDataCategory (Projekt-Container)

```typescript
interface ProjectCategory {
  id: number                    // ChurchTools Category ID
  customModuleId: number        // Unsere Extension ID
  name: string                  // "project_gemeindefest_2024_1705312800000"
  description: string           // "Daten für Projekt: Gemeindefest 2024"
  shorty: string               // "gf24"
  securityLevelId: number      // Projekt-spezifische Berechtigungen
  schema: string               // JSON Schema für Validierung
}

// Beispiel
{
  id: 123,
  customModuleId: 456,
  name: "project_gemeindefest_2024_1705312800000",
  description: "Daten für Projekt: Gemeindefest 2024",
  shorty: "gf24",
  securityLevelId: 789,
  schema: JSON.stringify({
    type: "object",
    properties: {
      type: { type: "string" },
      name: { type: "string", minLength: 1 },
      status: { type: "string", enum: ["planning", "active", "completed", "archived"] }
    }
  })
}
```

### CustomDataValues (Projekt-Inhalte)

#### 1. Projekt-Metadaten
```typescript
{
  id: 1001,
  dataCategoryId: 123,
  domainId: null,
  domainType: null,
  value: JSON.stringify({
    type: "project_meta",
    name: "Gemeindefest 2024",
    description: "Großes Sommerfest der Gemeinde mit Programm für alle Altersgruppen",
    externalDescription: "Herzliche Einladung zum Gemeindefest am 15. Juni 2024",
    status: "planning",
    leaderId: 42,
    categoryId: 123,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    tags: ["fest", "sommer", "familie"],
    budget: 5000,
    expectedParticipants: 200
  })
}
```

#### 2. Arbeitsbereich mit ChurchTools-Referenz
```typescript
{
  id: 1002,
  dataCategoryId: 123,
  domainId: 456,              // ChurchTools Group ID
  domainType: "group",
  value: JSON.stringify({
    type: "work_area",
    id: "wa_catering_1705312900000",
    name: "Catering-Team",
    description: "Verpflegung, Getränke und Küchenorganisation",
    parentId: null,           // Kein Übergeordneter Bereich
    groupId: 456,             // Referenz zur ChurchTools-Gruppe
    calendarId: 789,          // Referenz zum ChurchTools-Kalender
    leaderId: 43,
    members: [
      { personId: 43, role: "leader", joinedAt: "2024-01-15T10:00:00Z" },
      { personId: 44, role: "member", joinedAt: "2024-01-16T09:00:00Z" },
      { personId: 45, role: "member", joinedAt: "2024-01-17T11:00:00Z" }
    ],
    responsibilities: [
      "Menüplanung",
      "Einkauf koordinieren", 
      "Küchenteam organisieren",
      "Getränkestand betreuen"
    ],
    budget: 1500,
    createdAt: "2024-01-15T10:30:00Z"
  })
}
```

#### 3. Unterteam (Hierarchische Struktur)
```typescript
{
  id: 1003,
  dataCategoryId: 123,
  domainId: 457,              // Eigene ChurchTools Group ID
  domainType: "group",
  value: JSON.stringify({
    type: "work_area",
    id: "wa_kitchen_1705313000000",
    name: "Küchen-Team",
    description: "Speisenzubereitung und Küchenlogistik",
    parentId: "wa_catering_1705312900000",  // Untergeordnet zu Catering
    groupId: 457,
    calendarId: null,         // Nutzt Kalender des Parent-Teams
    leaderId: 44,
    members: [
      { personId: 44, role: "leader", joinedAt: "2024-01-16T09:00:00Z" },
      { personId: 46, role: "member", joinedAt: "2024-01-18T10:00:00Z" }
    ],
    responsibilities: [
      "Speisen vorbereiten",
      "Küche organisieren",
      "Hygiene überwachen"
    ],
    budget: 800,
    createdAt: "2024-01-16T09:30:00Z"
  })
}
```

#### 4. Setup-Todo
```typescript
{
  id: 1004,
  dataCategoryId: 123,
  domainId: null,
  domainType: null,
  value: JSON.stringify({
    type: "setup_todo",
    id: "todo_create_main_group_1705313100000",
    title: "Projektgruppe anlegen",
    description: "Hauptgruppe für alle Projektmitglieder erstellen und konfigurieren",
    todoType: "group",
    priority: "high",
    completed: false,
    completedAt: null,
    completedBy: null,
    action: "createProjectGroup",
    actionParams: {
      groupName: "Gemeindefest 2024 - Projektteam",
      groupType: "project",
      autoAddMembers: true,
      permissions: ["view_project", "edit_basic_data"]
    },
    dependencies: [],          // Keine Abhängigkeiten
    estimatedDuration: 15,     // Minuten
    instructions: [
      "ChurchTools Admin-Bereich öffnen",
      "Neue Gruppe erstellen",
      "Projektleiter als Admin hinzufügen",
      "Grundberechtigungen setzen"
    ],
    createdAt: "2024-01-15T10:00:00Z"
  })
}
```

#### 5. Abhängiges Setup-Todo
```typescript
{
  id: 1005,
  dataCategoryId: 123,
  domainId: null,
  domainType: null,
  value: JSON.stringify({
    type: "setup_todo",
    id: "todo_create_calendar_1705313200000",
    title: "Projekt-Kalender erstellen",
    description: "Gemeinsamen Kalender für alle Projekttermine anlegen",
    todoType: "calendar",
    priority: "medium",
    completed: false,
    completedAt: null,
    completedBy: null,
    action: "createProjectCalendar",
    actionParams: {
      calendarName: "Gemeindefest 2024",
      visibility: "group",
      groupId: null,           // Wird nach Gruppenerstellung gesetzt
      color: "#4CAF50"
    },
    dependencies: ["todo_create_main_group_1705313100000"],  // Abhängig von Gruppe
    estimatedDuration: 10,
    instructions: [
      "Kalender-Modul öffnen",
      "Neuen Kalender erstellen",
      "Projektgruppe berechtigen",
      "Farbe und Einstellungen konfigurieren"
    ],
    createdAt: "2024-01-15T10:00:00Z"
  })
}
```

#### 6. Wiki-Konfiguration
```typescript
{
  id: 1006,
  dataCategoryId: 123,
  domainId: 101,              // Haupt-Wiki-Seiten ID
  domainType: "wiki",
  value: JSON.stringify({
    type: "wiki_config",
    mainPageId: 101,
    structure: {
      "Allgemein": {
        pageId: 101,
        description: "Projektübersicht und allgemeine Informationen",
        permissions: ["all_members"],
        children: {
          "Zeitplan": { pageId: 102 },
          "Kontakte": { pageId: 103 },
          "Budget": { pageId: 104, permissions: ["leaders_only"] }
        }
      },
      "Catering": {
        pageId: 105,
        teamId: "wa_catering_1705312900000",
        description: "Verpflegung und Getränke",
        permissions: ["team_catering"],
        children: {
          "Menüplanung": { pageId: 106 },
          "Einkaufsliste": { pageId: 107 },
          "Rezepte": { pageId: 108 }
        }
      },
      "Programm": {
        pageId: 109,
        teamId: "wa_programm_1705313300000",
        description: "Bühnenprogramm und Aktivitäten",
        permissions: ["team_programm"],
        children: {
          "Ablaufplan": { pageId: 110 },
          "Technik": { pageId: 111 },
          "Moderation": { pageId: 112 }
        }
      }
    },
    templates: {
      "team_page": {
        title: "{{team_name}} - Arbeitsbereich",
        content: "# {{team_name}}\n\n## Aufgaben\n\n## Termine\n\n## Kontakte"
      }
    },
    createdAt: "2024-01-20T15:00:00Z",
    updatedAt: "2024-01-22T10:30:00Z"
  })
}
```

#### 7. Kommunikations-Konfiguration
```typescript
{
  id: 1007,
  dataCategoryId: 123,
  domainId: null,
  domainType: null,
  value: JSON.stringify({
    type: "communication_config",
    channels: {
      announcements: {
        type: "posts",
        groupId: 456,           // Hauptprojektgruppe
        permissions: ["leaders_only"],
        autoNotify: true,
        emailNotification: true
      },
      general_chat: {
        type: "chat",
        groupId: 456,
        permissions: ["all_members"],
        autoNotify: false
      },
      team_chats: [
        {
          teamId: "wa_catering_1705312900000",
          groupId: 456,
          channelName: "catering-team"
        },
        {
          teamId: "wa_programm_1705313300000", 
          groupId: 457,
          channelName: "programm-team"
        }
      ]
    },
    notifications: {
      newMember: true,
      todoCompleted: true,
      deadlineReminder: true,
      eventCreated: true
    },
    createdAt: "2024-01-20T16:00:00Z"
  })
}
```

## Berechtigungsmodell

### Security Level Struktur
```typescript
interface ProjectSecurityLevel {
  id: number
  name: string              // "Projekt: Gemeindefest 2024"
  permissions: {
    'view custom data': number[]      // Alle Projektmitglieder
    'edit custom data': number[]      // Teamleiter + Projektleiter
    'create custom data': number[]    // Teamleiter + Projektleiter
    'delete custom data': number[]    // Nur Projektleiter
  }
}

// Beispiel
{
  id: 789,
  name: "Projekt: Gemeindefest 2024",
  permissions: {
    'view custom data': [42, 43, 44, 45, 46, 47, 48],  // Alle Mitglieder
    'edit custom data': [42, 43],                       // Projektleiter + Catering-Leiter
    'create custom data': [42, 43],                     // Projektleiter + Catering-Leiter
    'delete custom data': [42]                          // Nur Projektleiter
  }
}
```

### Hierarchische Berechtigungen
```
Projektleiter (ID: 42)
├── Vollzugriff auf alle Projektdaten
├── Kann Arbeitsbereiche erstellen/löschen
├── Kann Berechtigungen verwalten
└── Kann Projekt archivieren/löschen

Teamleiter (ID: 43, 47)
├── Vollzugriff auf eigenen Arbeitsbereich
├── Kann Team-Mitglieder verwalten
├── Kann Setup-Todos abschließen
└── Lesezugriff auf andere Bereiche

Team-Mitglieder (ID: 44, 45, 46, 48)
├── Lesezugriff auf Projektdaten
├── Kann eigene Aufgaben bearbeiten
├── Kann an Team-Diskussionen teilnehmen
└── Kann Setup-Todos einsehen
```

## Datenfluss und Operationen

### 1. Projekt erstellen
```
1. ProjectCCMService.createProject()
   ├── CustomDataCategory erstellen
   ├── Security Level konfigurieren
   ├── Projekt-Metadaten speichern
   └── Initiale Setup-Todos generieren

2. Setup-Wizard anzeigen
   ├── Todo-Liste laden
   ├── Abhängigkeiten prüfen
   └── Ausführbare Todos markieren
```

### 2. Arbeitsbereich hinzufügen
```
1. ProjectCCMService.addWorkArea()
   ├── ChurchTools-Gruppe erstellen
   ├── Kalender erstellen (optional)
   ├── WorkArea-Daten speichern
   └── Domain-Referenzen setzen

2. Berechtigungen aktualisieren
   ├── Security Level erweitern
   ├── Team-Mitglieder hinzufügen
   └── Wiki-Berechtigung setzen
```

### 3. Setup-Todo abschließen
```
1. Todo-Aktion ausführen
   ├── ChurchTools API aufrufen
   ├── Ressourcen erstellen
   └── Referenzen speichern

2. Todo-Status aktualisieren
   ├── completed = true setzen
   ├── completedAt timestamp
   ├── Abhängige Todos freischalten
   └── Fortschritt berechnen
```

## Performance-Optimierungen

### 1. Lazy Loading
```typescript
// Nur Projekt-Übersicht laden
const projects = await projectCCMService.getAllProjects()  // Nur Metadaten

// Details bei Bedarf laden
const fullProject = await projectCCMService.getProject(categoryId)  // Alle Daten
```

### 2. Caching-Strategie
```typescript
// Cache-Ebenen
1. Browser-Cache: Projekt-Listen (5 Minuten)
2. Session-Cache: Aktuelle Projekt-Details
3. Local Storage: User-Präferenzen
```

### 3. Batch-Operationen
```typescript
// Mehrere Setup-Todos gleichzeitig abschließen
await Promise.all([
  projectCCMService.updateSetupTodo(categoryId, "todo_1", { completed: true }),
  projectCCMService.updateSetupTodo(categoryId, "todo_2", { completed: true }),
  projectCCMService.updateSetupTodo(categoryId, "todo_3", { completed: true })
])
```

## Skalierbarkeit und Grenzen

### Technische Limits
- **CustomDataCategories**: Praktisch unbegrenzt pro Extension
- **CustomDataValues**: Praktisch unbegrenzt pro Category
- **JSON-Größe**: Empfohlen < 64KB pro Value
- **API-Rate-Limits**: ChurchTools-spezifisch

### Empfohlene Limits
- **Projekte**: < 1000 aktive Projekte pro Extension
- **Arbeitsbereiche**: < 50 pro Projekt
- **Setup-Todos**: < 100 pro Projekt
- **Team-Mitglieder**: < 500 pro Projekt

### Monitoring
```typescript
// Projekt-Statistiken
interface ProjectStats {
  totalProjects: number
  activeProjects: number
  totalWorkAreas: number
  totalMembers: number
  avgSetupCompletion: number
  storageUsage: number        // KB
}
```

Diese Architektur bietet eine robuste, skalierbare und wartbare Grundlage für komplexe Projektorganisation in ChurchTools mit optimaler Nutzung der CCM API-Funktionen.