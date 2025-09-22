<template>
  <BaseCard title="Projektübersicht" :loading="loading" :error="error">
    <template #actions>
      <button
        type="button"
        @click="showCreateDialog = true"
        class="btn btn-primary btn-sm"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Neues Projekt
      </button>
    </template>

    <!-- Filter und Suche -->
    <div class="row mb-3">
      <div class="col-md-6">
        <input
          v-model="searchTerm"
          type="text"
          class="form-control"
          placeholder="Projekte suchen..."
        >
      </div>
      <div class="col-md-6">
        <select v-model="statusFilter" class="form-select">
          <option value="">Alle Status</option>
          <option value="planning">Planung</option>
          <option value="active">Aktiv</option>
          <option value="completed">Abgeschlossen</option>
          <option value="archived">Archiviert</option>
        </select>
      </div>
    </div>

    <!-- Projekt-Liste -->
    <div class="row">
      <div
        v-for="project in filteredProjects"
        :key="project.categoryId"
        class="col-lg-6 col-xl-4 mb-3"
      >
        <div 
          class="card project-card h-100"
          :class="getProjectCardClass(project.status)"
          @click="openProject(project.categoryId)"
          style="cursor: pointer;"
        >
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h6 class="card-title mb-0">{{ project.name }}</h6>
              <span 
                class="badge"
                :class="getStatusBadgeClass(project.status)"
              >
                {{ getStatusText(project.status) }}
              </span>
            </div>
            
            <p class="card-text text-muted small mb-3">
              {{ project.description }}
            </p>

            <!-- Projekt-Statistiken -->
            <div class="row text-center mb-3">
              <div class="col-4">
                <div class="small text-muted">Teams</div>
                <div class="fw-bold">{{ project.workAreaCount }}</div>
              </div>
              <div class="col-4">
                <div class="small text-muted">Mitglieder</div>
                <div class="fw-bold">{{ project.memberCount }}</div>
              </div>
              <div class="col-4">
                <div class="small text-muted">Setup</div>
                <div class="fw-bold">{{ project.completionRate }}%</div>
              </div>
            </div>

            <!-- Fortschrittsbalken -->
            <div class="progress mb-2" style="height: 4px;">
              <div
                class="progress-bar"
                :class="getProgressBarClass(project.completionRate)"
                :style="{ width: project.completionRate + '%' }"
              ></div>
            </div>

            <!-- Projektleiter und letzte Aktualisierung -->
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">
                <i class="fa fa-user"></i>
                {{ getPersonName(project.leaderId) }}
              </small>
              <small class="text-muted">
                {{ formatDate(project.updatedAt) }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Leere Ansicht -->
    <div v-if="filteredProjects.length === 0 && !loading" class="text-center py-5">
      <i class="fa fa-folder-open fa-3x text-muted mb-3"></i>
      <h5 class="text-muted">Keine Projekte gefunden</h5>
      <p class="text-muted">
        {{ searchTerm || statusFilter ? 'Keine Projekte entsprechen den Filterkriterien.' : 'Erstellen Sie Ihr erstes Projekt.' }}
      </p>
      <button
        v-if="!searchTerm && !statusFilter"
        type="button"
        @click="showCreateDialog = true"
        class="btn btn-primary"
      >
        <i class="fa fa-plus"></i>
        Erstes Projekt erstellen
      </button>
    </div>

    <!-- Projekt erstellen Dialog -->
    <div
      v-if="showCreateDialog"
      class="modal d-block"
      style="background-color: rgba(0,0,0,0.5);"
      @click.self="showCreateDialog = false"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Neues Projekt erstellen</h5>
            <button
              type="button"
              class="btn-close"
              @click="showCreateDialog = false"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="createProject">
              <div class="mb-3">
                <label for="projectName" class="form-label">Projektname *</label>
                <input
                  id="projectName"
                  v-model="newProject.name"
                  type="text"
                  class="form-control"
                  required
                  placeholder="z.B. Gemeindefest 2024"
                >
              </div>
              <div class="mb-3">
                <label for="projectDescription" class="form-label">Beschreibung</label>
                <textarea
                  id="projectDescription"
                  v-model="newProject.description"
                  class="form-control"
                  rows="3"
                  placeholder="Kurze Beschreibung des Projekts..."
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="projectExternalDescription" class="form-label">Öffentliche Beschreibung</label>
                <textarea
                  id="projectExternalDescription"
                  v-model="newProject.externalDescription"
                  class="form-control"
                  rows="2"
                  placeholder="Beschreibung für Teilnehmer und Öffentlichkeit..."
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="projectLeader" class="form-label">Projektleiter *</label>
                <select
                  id="projectLeader"
                  v-model="newProject.leaderId"
                  class="form-select"
                  required
                >
                  <option value="">Projektleiter auswählen...</option>
                  <option value="42">Max Mustermann</option>
                  <option value="43">Anna Schmidt</option>
                  <option value="47">Sarah Klein</option>
                  <option value="52">Chris Miller</option>
                  <option value="55">Maria Lopez</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showCreateDialog = false"
            >
              Abbrechen
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="createProject"
              :disabled="!newProject.name || !newProject.leaderId || creating"
            >
              <span v-if="creating" class="spinner-border spinner-border-sm me-2"></span>
              Projekt erstellen
            </button>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseCard from '../common/BaseCard.vue'
import { mockProjectService } from '@/services/mockProjectService'
import type { ProjectSummary, ProjectCreateData } from '@/types/project'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { showToast } = useToast()

// Reactive state
const projects = ref<ProjectSummary[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchTerm = ref('')
const statusFilter = ref('')
const showCreateDialog = ref(false)
const creating = ref(false)

const newProject = ref<ProjectCreateData>({
  name: '',
  description: '',
  externalDescription: '',
  leaderId: 0
})

// Computed
const filteredProjects = computed(() => {
  let filtered = projects.value

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(project =>
      project.name.toLowerCase().includes(term) ||
      project.description.toLowerCase().includes(term)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(project => project.status === statusFilter.value)
  }

  return filtered.sort((a, b) => {
    // Aktive Projekte zuerst, dann nach Update-Datum
    if (a.status === 'active' && b.status !== 'active') return -1
    if (b.status === 'active' && a.status !== 'active') return 1
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })
})

// Methods
const loadProjects = async () => {
  loading.value = true
  error.value = null
  try {
    projects.value = await mockProjectService.getAllProjects()
  } catch (err) {
    error.value = 'Fehler beim Laden der Projekte'
    console.error('Failed to load projects:', err)
  } finally {
    loading.value = false
  }
}

const createProject = async () => {
  if (!newProject.value.name || !newProject.value.leaderId) return

  creating.value = true
  try {
    const categoryId = await mockProjectService.createProject(newProject.value)
    showToast('Projekt erstellt', `Das Projekt "${newProject.value.name}" wurde erfolgreich erstellt.`, 'success')
    
    // Dialog schließen und Form zurücksetzen
    showCreateDialog.value = false
    newProject.value = {
      name: '',
      description: '',
      externalDescription: '',
      leaderId: 0
    }
    
    // Projekte neu laden
    await loadProjects()
    
    // Zum neuen Projekt navigieren
    router.push(`/project/${categoryId}`)
  } catch (err) {
    showToast('Fehler', 'Das Projekt konnte nicht erstellt werden.', 'error')
    console.error('Failed to create project:', err)
  } finally {
    creating.value = false
  }
}

const openProject = (categoryId: number) => {
  router.push(`/project/${categoryId}`)
}

const getProjectCardClass = (status: string) => {
  switch (status) {
    case 'active': return 'border-success'
    case 'planning': return 'border-warning'
    case 'completed': return 'border-info'
    case 'archived': return 'border-secondary'
    default: return ''
  }
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'active': return 'bg-success'
    case 'planning': return 'bg-warning text-dark'
    case 'completed': return 'bg-info'
    case 'archived': return 'bg-secondary'
    default: return 'bg-light text-dark'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'Aktiv'
    case 'planning': return 'Planung'
    case 'completed': return 'Abgeschlossen'
    case 'archived': return 'Archiviert'
    default: return status
  }
}

const getProgressBarClass = (completionRate: number) => {
  if (completionRate >= 80) return 'bg-success'
  if (completionRate >= 50) return 'bg-warning'
  return 'bg-danger'
}

const getPersonName = (personId: number) => {
  return mockProjectService.getPersonName(personId)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  loadProjects()
})
</script>

<style scoped>
.project-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.progress {
  border-radius: 2px;
}

.modal {
  z-index: 1050;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
}

.badge {
  font-size: 0.75rem;
}
</style>