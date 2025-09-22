// Mock Service für Projektorganisation Demo
import type { 
  ProjectData, 
  ProjectSummary, 
  WorkAreaData, 
  SetupTodoData, 
  WikiConfigData,
  ProjectCreateData 
} from '@/types/project'

export class MockProjectService {
  private projects: Map<string, ProjectData> = new Map()
  private nextId = 1

  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    // Projekt 1: Gemeindefest 2024 (Aktiv)
    const gemeindefest: ProjectData = {
      type: "project_meta",
      categoryId: 1,
      name: "Gemeindefest 2024",
      description: "Großes Sommerfest der Gemeinde mit Programm für alle Altersgruppen",
      externalDescription: "Herzliche Einladung zum Gemeindefest am 15. Juni 2024",
      status: "active",
      leaderId: 42,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-03-20T14:30:00Z",
      workAreas: [
        {
          type: "work_area",
          id: "wa_catering_001",
          name: "Catering-Team",
          description: "Verpflegung, Getränke und Küchenorganisation",
          groupId: 456,
          calendarId: 789,
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
          budget: 1500
        },
        {
          type: "work_area",
          id: "wa_programm_001",
          name: "Programm-Team",
          description: "Bühnenprogramm und Aktivitäten für alle Altersgruppen",
          groupId: 457,
          calendarId: 790,
          leaderId: 47,
          members: [
            { personId: 47, role: "leader", joinedAt: "2024-01-15T10:00:00Z" },
            { personId: 48, role: "member", joinedAt: "2024-01-18T10:00:00Z" },
            { personId: 49, role: "member", joinedAt: "2024-01-19T14:00:00Z" }
          ],
          responsibilities: [
            "Bühnenprogramm planen",
            "Technik koordinieren",
            "Moderation organisieren",
            "Kinderprogramm"
          ],
          budget: 800
        },
        {
          type: "work_area",
          id: "wa_logistik_001",
          name: "Logistik-Team",
          description: "Aufbau, Abbau und technische Infrastruktur",
          groupId: 458,
          calendarId: 791,
          leaderId: 50,
          members: [
            { personId: 50, role: "leader", joinedAt: "2024-01-20T09:00:00Z" },
            { personId: 51, role: "member", joinedAt: "2024-01-21T10:00:00Z" }
          ],
          responsibilities: [
            "Zelte und Bühne aufbauen",
            "Strom und Wasser organisieren",
            "Sicherheit gewährleisten",
            "Abbau koordinieren"
          ],
          budget: 1200
        }
      ],
      setupTodos: [
        {
          type: "setup_todo",
          id: "todo_main_group_001",
          title: "Projektgruppe anlegen",
          description: "Hauptgruppe für alle Projektmitglieder erstellen",
          todoType: "group",
          priority: "high",
          completed: true,
          completedAt: "2024-01-16T09:30:00Z",
          completedBy: 42,
          action: "createProjectGroup",
          dependencies: [],
          estimatedDuration: 15
        },
        {
          type: "setup_todo",
          id: "todo_calendar_001",
          title: "Projekt-Kalender erstellen",
          description: "Gemeinsamen Kalender für alle Projekttermine anlegen",
          todoType: "calendar",
          priority: "medium",
          completed: true,
          completedAt: "2024-01-17T11:00:00Z",
          completedBy: 42,
          action: "createProjectCalendar",
          dependencies: ["todo_main_group_001"],
          estimatedDuration: 10
        },
        {
          type: "setup_todo",
          id: "todo_wiki_001",
          title: "Wiki-Struktur anlegen",
          description: "Projekt-Wiki mit Hauptseite und Team-Bereichen erstellen",
          todoType: "wiki",
          priority: "medium",
          completed: false,
          action: "createProjectWiki",
          dependencies: ["todo_main_group_001"],
          estimatedDuration: 20
        },
        {
          type: "setup_todo",
          id: "todo_permissions_001",
          title: "Berechtigungen konfigurieren",
          description: "Detaillierte Zugriffsrechte für alle Teams einrichten",
          todoType: "permissions",
          priority: "low",
          completed: false,
          action: "configurePermissions",
          dependencies: ["todo_main_group_001", "todo_wiki_001"],
          estimatedDuration: 30
        }
      ],
      wikiConfig: {
        type: "wiki_config",
        mainPageId: 101,
        structure: {
          "Allgemein": {
            pageId: 101,
            description: "Projektübersicht und allgemeine Informationen"
          },
          "Catering": {
            pageId: 105,
            teamId: "wa_catering_001",
            description: "Verpflegung und Getränke"
          },
          "Programm": {
            pageId: 109,
            teamId: "wa_programm_001",
            description: "Bühnenprogramm und Aktivitäten"
          }
        }
      }
    }

    // Projekt 2: Jugendfreizeit 2024 (Planung)
    const jugendfreizeit: ProjectData = {
      type: "project_meta",
      categoryId: 2,
      name: "Jugendfreizeit 2024",
      description: "Sommerfreizeit für Jugendliche von 14-18 Jahren",
      externalDescription: "Abenteuer und Gemeinschaft in den Bergen",
      status: "planning",
      leaderId: 52,
      createdAt: "2024-02-01T14:00:00Z",
      updatedAt: "2024-02-15T16:20:00Z",
      workAreas: [
        {
          type: "work_area",
          id: "wa_leitung_002",
          name: "Freizeitleitung",
          description: "Gesamtorganisation und pädagogische Leitung",
          groupId: 460,
          leaderId: 52,
          members: [
            { personId: 52, role: "leader", joinedAt: "2024-02-01T14:00:00Z" },
            { personId: 53, role: "member", joinedAt: "2024-02-02T10:00:00Z" }
          ],
          responsibilities: [
            "Programm entwickeln",
            "Team koordinieren",
            "Anmeldungen verwalten",
            "Elternkommunikation"
          ],
          budget: 2000
        },
        {
          type: "work_area",
          id: "wa_verpflegung_002",
          name: "Verpflegung",
          description: "Mahlzeiten und Getränke für die Freizeit",
          groupId: 461,
          leaderId: 54,
          members: [
            { personId: 54, role: "leader", joinedAt: "2024-02-03T09:00:00Z" }
          ],
          responsibilities: [
            "Menüplanung",
            "Einkauf organisieren",
            "Allergien berücksichtigen"
          ],
          budget: 1500
        }
      ],
      setupTodos: [
        {
          type: "setup_todo",
          id: "todo_main_group_002",
          title: "Freizeitgruppe anlegen",
          description: "Gruppe für alle Freizeitmitarbeiter erstellen",
          todoType: "group",
          priority: "high",
          completed: false,
          action: "createProjectGroup",
          dependencies: [],
          estimatedDuration: 15
        },
        {
          type: "setup_todo",
          id: "todo_anmeldung_002",
          title: "Anmeldesystem einrichten",
          description: "Online-Anmeldung für Teilnehmer konfigurieren",
          todoType: "form",
          priority: "high",
          completed: false,
          action: "createRegistrationForm",
          dependencies: ["todo_main_group_002"],
          estimatedDuration: 45
        }
      ]
    }

    // Projekt 3: Weihnachtsfeier 2023 (Abgeschlossen)
    const weihnachtsfeier: ProjectData = {
      type: "project_meta",
      categoryId: 3,
      name: "Weihnachtsfeier 2023",
      description: "Gemeinschaftliche Weihnachtsfeier mit Gottesdienst",
      status: "completed",
      leaderId: 55,
      createdAt: "2023-10-15T10:00:00Z",
      updatedAt: "2023-12-20T18:00:00Z",
      workAreas: [
        {
          type: "work_area",
          id: "wa_gottesdienst_003",
          name: "Gottesdienst-Team",
          description: "Weihnachtsgottesdienst vorbereiten",
          groupId: 462,
          leaderId: 55,
          members: [
            { personId: 55, role: "leader", joinedAt: "2023-10-15T10:00:00Z" },
            { personId: 56, role: "member", joinedAt: "2023-10-16T09:00:00Z" }
          ],
          responsibilities: [
            "Liturgie planen",
            "Musik organisieren",
            "Dekoration"
          ],
          budget: 500
        }
      ],
      setupTodos: [
        {
          type: "setup_todo",
          id: "todo_main_group_003",
          title: "Projektgruppe anlegen",
          description: "Gruppe für Weihnachtsfeier-Team",
          todoType: "group",
          priority: "high",
          completed: true,
          completedAt: "2023-10-16T10:00:00Z",
          completedBy: 55,
          action: "createProjectGroup",
          dependencies: [],
          estimatedDuration: 15
        }
      ]
    }

    this.projects.set("1", gemeindefest)
    this.projects.set("2", jugendfreizeit)
    this.projects.set("3", weihnachtsfeier)
    this.nextId = 4
  }

  // API-ähnliche Methoden
  async getAllProjects(): Promise<ProjectSummary[]> {
    // Simuliere API-Delay
    await this.delay(300)
    
    return Array.from(this.projects.values()).map(project => ({
      categoryId: project.categoryId,
      name: project.name,
      status: project.status,
      leaderId: project.leaderId,
      description: project.description,
      updatedAt: project.updatedAt,
      hasPermission: true,
      completionRate: this.calculateCompletionRate(project.setupTodos),
      memberCount: this.calculateMemberCount(project.workAreas),
      workAreaCount: project.workAreas.length
    }))
  }

  async getProject(categoryId: string): Promise<ProjectData> {
    await this.delay(200)
    
    const project = this.projects.get(categoryId)
    if (!project) {
      throw new Error(`Project with ID ${categoryId} not found`)
    }
    
    return { ...project }
  }

  async createProject(projectData: ProjectCreateData): Promise<string> {
    await this.delay(500)
    
    const categoryId = this.nextId.toString()
    this.nextId++
    
    const newProject: ProjectData = {
      type: "project_meta",
      categoryId: parseInt(categoryId),
      name: projectData.name,
      description: projectData.description || "",
      externalDescription: projectData.externalDescription,
      status: "planning",
      leaderId: projectData.leaderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      workAreas: [],
      setupTodos: this.generateInitialSetupTodos()
    }
    
    this.projects.set(categoryId, newProject)
    return categoryId
  }

  async updateProject(categoryId: string, updates: Partial<ProjectData>): Promise<void> {
    await this.delay(300)
    
    const project = this.projects.get(categoryId)
    if (!project) {
      throw new Error(`Project with ID ${categoryId} not found`)
    }
    
    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    this.projects.set(categoryId, updatedProject)
  }

  async addWorkArea(categoryId: string, workAreaData: Omit<WorkAreaData, 'type' | 'id'>): Promise<void> {
    await this.delay(400)
    
    const project = this.projects.get(categoryId)
    if (!project) {
      throw new Error(`Project with ID ${categoryId} not found`)
    }
    
    const newWorkArea: WorkAreaData = {
      type: "work_area",
      id: `wa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...workAreaData
    }
    
    project.workAreas.push(newWorkArea)
    project.updatedAt = new Date().toISOString()
    
    this.projects.set(categoryId, project)
  }

  async updateSetupTodo(
    categoryId: string, 
    todoId: string, 
    updates: Partial<SetupTodoData>
  ): Promise<void> {
    await this.delay(200)
    
    const project = this.projects.get(categoryId)
    if (!project) {
      throw new Error(`Project with ID ${categoryId} not found`)
    }
    
    const todoIndex = project.setupTodos.findIndex(todo => todo.id === todoId)
    if (todoIndex === -1) {
      throw new Error(`Todo with ID ${todoId} not found`)
    }
    
    const updatedTodo = {
      ...project.setupTodos[todoIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    if (updates.completed && !project.setupTodos[todoIndex].completed) {
      updatedTodo.completedAt = new Date().toISOString()
      updatedTodo.completedBy = 42 // Mock current user
    }
    
    project.setupTodos[todoIndex] = updatedTodo
    project.updatedAt = new Date().toISOString()
    
    this.projects.set(categoryId, project)
  }

  async deleteProject(categoryId: string): Promise<void> {
    await this.delay(300)
    
    if (!this.projects.has(categoryId)) {
      throw new Error(`Project with ID ${categoryId} not found`)
    }
    
    this.projects.delete(categoryId)
  }

  // Helper Methods
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private calculateCompletionRate(todos: SetupTodoData[]): number {
    if (todos.length === 0) return 100
    const completed = todos.filter(todo => todo.completed).length
    return Math.round((completed / todos.length) * 100)
  }

  private calculateMemberCount(workAreas: WorkAreaData[]): number {
    const allMembers = new Set<number>()
    workAreas.forEach(area => {
      area.members?.forEach(member => allMembers.add(member.personId))
    })
    return allMembers.size
  }

  private generateInitialSetupTodos(): SetupTodoData[] {
    return [
      {
        type: "setup_todo",
        id: `todo_main_group_${Date.now()}`,
        title: "Projektgruppe anlegen",
        description: "Hauptgruppe für alle Projektmitglieder erstellen",
        todoType: "group",
        priority: "high",
        completed: false,
        action: "createProjectGroup",
        dependencies: [],
        estimatedDuration: 15
      },
      {
        type: "setup_todo",
        id: `todo_calendar_${Date.now() + 1}`,
        title: "Projekt-Kalender erstellen",
        description: "Gemeinsamen Kalender für alle Projekttermine anlegen",
        todoType: "calendar",
        priority: "medium",
        completed: false,
        action: "createProjectCalendar",
        dependencies: [`todo_main_group_${Date.now()}`],
        estimatedDuration: 10
      },
      {
        type: "setup_todo",
        id: `todo_wiki_${Date.now() + 2}`,
        title: "Wiki-Struktur anlegen",
        description: "Projekt-Wiki mit Hauptseite und Team-Bereichen erstellen",
        todoType: "wiki",
        priority: "medium",
        completed: false,
        action: "createProjectWiki",
        dependencies: [`todo_main_group_${Date.now()}`],
        estimatedDuration: 20
      }
    ]
  }

  // Mock-Daten für Personen (für Anzeige)
  getPersonName(personId: number): string {
    const persons: Record<number, string> = {
      42: "Max Mustermann",
      43: "Anna Schmidt", 
      44: "Peter Weber",
      45: "Lisa Müller",
      46: "Tom Fischer",
      47: "Sarah Klein",
      48: "Mike Johnson",
      49: "Emma Brown",
      50: "David Wilson",
      51: "Julia Davis",
      52: "Chris Miller",
      53: "Nina Garcia",
      54: "Alex Rodriguez",
      55: "Maria Lopez",
      56: "John Anderson"
    }
    return persons[personId] || `Person ${personId}`
  }

  // Mock-Daten für Gruppen
  getGroupName(groupId: number): string {
    const groups: Record<number, string> = {
      456: "Gemeindefest 2024 - Projektteam",
      457: "Gemeindefest 2024 - Programm",
      458: "Gemeindefest 2024 - Logistik",
      460: "Jugendfreizeit 2024 - Team",
      461: "Jugendfreizeit 2024 - Verpflegung",
      462: "Weihnachtsfeier 2023 - Team"
    }
    return groups[groupId] || `Gruppe ${groupId}`
  }
}

// Singleton-Instanz für die Demo
export const mockProjectService = new MockProjectService()