<template>
  <div class="project-detail-view">
    <!-- Projekt-Header -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-2">
                <li class="breadcrumb-item">
                  <router-link to="/" class="text-decoration-none">
                    <i class="fa fa-home"></i> Dashboard
                  </router-link>
                </li>
                <li class="breadcrumb-item active">{{ project?.name || 'Projekt' }}</li>
              </ol>
            </nav>
            
            <div class="d-flex align-items-center gap-3 mb-2">
              <h2 class="mb-0">{{ project?.name }}</h2>
              <span 
                class="badge fs-6"
                :class="getStatusBadgeClass(project?.status)"
              >
                {{ getStatusText(project?.status) }}
              </span>
            </div>
            
            <p class="text-muted mb-2">{{ project?.description }}</p>
            
            <div class="row text-muted small">
              <div class="col-auto">
                <i class="fa fa-user"></i>
                Projektleiter: {{ getPersonName(project?.leaderId) }}
              </div>
              <div class="col-auto">
                <i class="fa fa-calendar"></i>
                Erstellt: {{ formatDate(project?.createdAt) }}
              </div>
              <div class="col-auto">
                <i class="fa fa-clock"></i>
                Aktualisiert: {{ formatDate(project?.updatedAt) }}
              </div>
            </div>
          </div>
          
          <div class="col-auto">
            <div class="dropdown">
              <button
                class="btn btn-outline-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
              >
                <i class="fa fa-cog"></i>
                Aktionen
              </button>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="editProject">
                    <i class="fa fa-edit"></i> Projekt bearbeiten
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="duplicateProject">
                    <i class="fa fa-copy"></i> Projekt duplizieren
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item text-danger" href="#" @click.prevent="archiveProject">
                    <i class="fa fa-archive"></i> Projekt archivieren
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Laden...</span>
      </div>
      <p class="mt-2 text-muted">Projekt wird geladen...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="fa fa-exclamation-triangle"></i>
      {{ error }}
      <button type="button" class="btn btn-sm btn-outline-danger ms-2" @click="loadProject">
        Erneut versuchen
      </button>
    </div>

    <!-- Projekt-Inhalt -->
    <div v-else-if="project">
      <!-- Tab-Navigation -->
      <ul class="nav nav-tabs mb-4" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'overview' }"
            @click="activeTab = 'overview'"
            type="button"
          >
            <i class="fa fa-dashboard"></i>
            Übersicht
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'setup' }"
            @click="activeTab = 'setup'"
            type="button"
          >
            <i class="fa fa-tasks"></i>
            Setup
            <span v-if="pendingTodos > 0" class="badge bg-warning text-dark ms-1">
              {{ pendingTodos }}
            </span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'teams' }"
            @click="activeTab = 'teams'"
            type="button"
          >
            <i class="fa fa-users"></i>
            Teams
            <span class="badge bg-secondary ms-1">{{ project.workAreas.length }}</span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'calendar' }"
            @click="activeTab = 'calendar'"
            type="button"
          >
            <i class="fa fa-calendar"></i>
            Kalender
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'wiki' }"
            @click="activeTab = 'wiki'"
            type="button"
          >
            <i class="fa fa-book"></i>
            Wiki
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'communication' }"
            @click="activeTab = 'communication'"
            type="button"
          >
            <i class="fa fa-comments"></i>
            Kommunikation
          </button>
        </li>
      </ul>

      <!-- Tab-Inhalte -->
      <div class="tab-content">
        <!-- Übersicht Tab -->
        <div v-if="activeTab === 'overview'" class="tab-pane active">
          <ProjectOverviewTab :project="project" @refresh="loadProject" />
        </div>

        <!-- Setup Tab -->
        <div v-if="activeTab === 'setup'" class="tab-pane active">
          <ProjectSetupTab 
            :project="project" 
            @todo-updated="handleTodoUpdate"
            @refresh="loadProject" 
          />
        </div>

        <!-- Teams Tab -->
        <div v-if="activeTab === 'teams'" class="tab-pane active">
          <ProjectTeamsTab 
            :project="project" 
            @work-area-added="handleWorkAreaAdded"
            @refresh="loadProject" 
          />
        </div>

        <!-- Kalender Tab -->
        <div v-if="activeTab === 'calendar'" class="tab-pane active">
          <ProjectCalendarTab :project="project" />
        </div>

        <!-- Wiki Tab -->
        <div v-if="activeTab === 'wiki'" class="tab-pane active">
          <ProjectWikiTab :project="project" />
        </div>

        <!-- Kommunikation Tab -->
        <div v-if="activeTab === 'communication'" class="tab-pane active">
          <ProjectCommunicationTab :project="project" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockProjectService } from '@/services/mockProjectService'
import type { ProjectData, SetupTodoData, WorkAreaData } from '@/types/project'
import { useToast } from '@/composables/useToast'

// Tab-Komponenten (werden später erstellt)
import ProjectOverviewTab from './ProjectOverviewTab.vue'
import ProjectSetupTab from './ProjectSetupTab.vue'
import ProjectTeamsTab from './ProjectTeamsTab.vue'
import ProjectCalendarTab from './ProjectCalendarTab.vue'
import ProjectWikiTab from './ProjectWikiTab.vue'
import ProjectCommunicationTab from './ProjectCommunicationTab.vue'

const route = useRoute()
const router = useRouter()
const { showToast } = useToast()

// Reactive state
const project = ref<ProjectData | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const activeTab = ref('overview')

// Computed
const pendingTodos = computed(() => {
  if (!project.value) return 0
  return project.value.setupTodos.filter(todo => !todo.completed).length
})

// Methods
const loadProject = async () => {
  const categoryId = route.params.id as string
  if (!categoryId) {
    error.value = 'Projekt-ID fehlt'
    return
  }

  loading.value = true
  error.value = null
  
  try {
    project.value = await mockProjectService.getProject(categoryId)
  } catch (err) {
    error.value = 'Projekt konnte nicht geladen werden'
    console.error('Failed to load project:', err)
  } finally {
    loading.value = false
  }
}

const handleTodoUpdate = async (todoId: string, updates: Partial<SetupTodoData>) => {
  if (!project.value) return

  try {
    await mockProjectService.updateSetupTodo(
      project.value.categoryId.toString(),
      todoId,
      updates
    )
    
    // Projekt neu laden um Änderungen zu reflektieren
    await loadProject()
    
    if (updates.completed) {
      showToast('Setup-Aufgabe abgeschlossen', 'Die Aufgabe wurde erfolgreich abgeschlossen.', 'success')
    }
  } catch (err) {
    showToast('Fehler', 'Die Aufgabe konnte nicht aktualisiert werden.', 'error')
    console.error('Failed to update todo:', err)
  }
}

const handleWorkAreaAdded = async (workAreaData: Omit<WorkAreaData, 'type' | 'id'>) => {
  if (!project.value) return

  try {
    await mockProjectService.addWorkArea(
      project.value.categoryId.toString(),
      workAreaData
    )
    
    // Projekt neu laden
    await loadProject()
    
    showToast('Team hinzugefügt', `Das Team "${workAreaData.name}" wurde erfolgreich erstellt.`, 'success')
  } catch (err) {
    showToast('Fehler', 'Das Team konnte nicht erstellt werden.', 'error')
    console.error('Failed to add work area:', err)
  }
}

const editProject = () => {
  showToast('Info', 'Projekt bearbeiten - Feature wird implementiert', 'info')
}

const duplicateProject = () => {
  showToast('Info', 'Projekt duplizieren - Feature wird implementiert', 'info')
}

const archiveProject = () => {
  showToast('Info', 'Projekt archivieren - Feature wird implementiert', 'info')
}

const getStatusBadgeClass = (status?: string) => {
  switch (status) {
    case 'active': return 'bg-success'
    case 'planning': return 'bg-warning text-dark'
    case 'completed': return 'bg-info'
    case 'archived': return 'bg-secondary'
    default: return 'bg-light text-dark'
  }
}

const getStatusText = (status?: string) => {
  switch (status) {
    case 'active': return 'Aktiv'
    case 'planning': return 'Planung'
    case 'completed': return 'Abgeschlossen'
    case 'archived': return 'Archiviert'
    default: return status || ''
  }
}

const getPersonName = (personId?: number) => {
  if (!personId) return 'Unbekannt'
  return mockProjectService.getPersonName(personId)
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Unbekannt'
  const date = new Date(dateString)
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Watchers
watch(() => route.params.id, () => {
  if (route.params.id) {
    loadProject()
  }
}, { immediate: true })

// URL-Parameter für aktiven Tab
watch(() => route.query.tab, (newTab) => {
  if (newTab && typeof newTab === 'string') {
    activeTab.value = newTab
  }
}, { immediate: true })

watch(activeTab, (newTab) => {
  // Tab in URL reflektieren
  router.replace({ 
    ...route, 
    query: { ...route.query, tab: newTab } 
  })
})

// Lifecycle
onMounted(() => {
  loadProject()
})
</script>

<style scoped>
.project-detail-view {
  max-width: 1200px;
  margin: 0 auto;
}

.nav-tabs .nav-link {
  color: #6c757d;
  border: none;
  border-bottom: 2px solid transparent;
  background: none;
}

.nav-tabs .nav-link:hover {
  border-bottom-color: #dee2e6;
  background: none;
}

.nav-tabs .nav-link.active {
  color: #0d6efd;
  border-bottom-color: #0d6efd;
  background: none;
}

.breadcrumb {
  margin-bottom: 0;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: "›";
}

.badge {
  font-size: 0.75rem;
}

.dropdown-toggle::after {
  margin-left: 0.5em;
}
</style>