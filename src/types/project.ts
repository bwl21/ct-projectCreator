// TypeScript Interfaces für Projektorganisation

export interface ProjectData {
  type: "project_meta"
  categoryId: number
  name: string
  description: string
  externalDescription?: string
  status: "planning" | "active" | "completed" | "archived"
  leaderId: number
  createdAt: string
  updatedAt: string
  workAreas: WorkAreaData[]
  setupTodos: SetupTodoData[]
  wikiConfig?: WikiConfigData
}

export interface ProjectSummary {
  categoryId: number
  name: string
  status: "planning" | "active" | "completed" | "archived"
  leaderId: number
  description: string
  updatedAt: string
  hasPermission: boolean
  completionRate: number
  memberCount: number
  workAreaCount: number
}

export interface ProjectCreateData {
  name: string
  description?: string
  externalDescription?: string
  leaderId: number
  securityLevelId?: number
}

export interface WorkAreaData {
  type: "work_area"
  id: string
  name: string
  description?: string
  parentId?: string
  groupId?: number
  calendarId?: number
  leaderId?: number
  members?: ProjectMember[]
  responsibilities?: string[]
  budget?: number
}

export interface ProjectMember {
  personId: number
  role: "leader" | "member" | "guest"
  joinedAt: string
}

export interface SetupTodoData {
  type: "setup_todo"
  id: string
  title: string
  description: string
  todoType: "group" | "calendar" | "wiki" | "permissions" | "form"
  priority?: "high" | "medium" | "low"
  completed: boolean
  completedAt?: string
  completedBy?: number
  action: string
  actionParams?: Record<string, any>
  dependencies: string[]
  estimatedDuration: number
  instructions?: string[]
}

export interface WikiConfigData {
  type: "wiki_config"
  mainPageId?: number
  structure: Record<string, {
    pageId?: number
    teamId?: string
    description?: string
  }>
}

export interface ProjectPermissionSetup {
  leaderId: number
  teamLeaderIds: number[]
  memberIds: number[]
  viewerIds: number[]
}