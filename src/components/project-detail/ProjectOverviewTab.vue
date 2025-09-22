<template>
  <div class="project-overview-tab">
    <div class="row">
      <!-- Projekt-Statistiken -->
      <div class="col-lg-8">
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card text-center">
              <div class="card-body">
                <i class="fa fa-users fa-2x text-primary mb-2"></i>
                <h4 class="mb-0">{{ totalMembers }}</h4>
                <small class="text-muted">Mitglieder</small>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-center">
              <div class="card-body">
                <i class="fa fa-sitemap fa-2x text-success mb-2"></i>
                <h4 class="mb-0">{{ project.workAreas.length }}</h4>
                <small class="text-muted">Teams</small>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-center">
              <div class="card-body">
                <i class="fa fa-tasks fa-2x text-warning mb-2"></i>
                <h4 class="mb-0">{{ completedTodos }}/{{ project.setupTodos.length }}</h4>
                <small class="text-muted">Setup</small>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-center">
              <div class="card-body">
                <i class="fa fa-calendar fa-2x text-info mb-2"></i>
                <h4 class="mb-0">{{ activeCalendars }}</h4>
                <small class="text-muted">Kalender</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Setup-Fortschritt -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fa fa-cogs"></i>
              Setup-Fortschritt
            </h5>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span>Einrichtung abgeschlossen</span>
              <span class="fw-bold">{{ setupProgress }}%</span>
            </div>
            <div class="progress mb-3" style="height: 8px;">
              <div
                class="progress-bar"
                :class="getProgressBarClass(setupProgress)"
                :style="{ width: setupProgress + '%' }"
              ></div>
            </div>
            
            <div v-if="pendingTodos.length > 0" class="alert alert-warning">
              <strong>Noch zu erledigen:</strong>
              <ul class="mb-0 mt-2">
                <li v-for="todo in pendingTodos.slice(0, 3)" :key="todo.id">
                  {{ todo.title }}
                </li>
                <li v-if="pendingTodos.length > 3">
                  ... und {{ pendingTodos.length - 3 }} weitere
                </li>
              </ul>
              <router-link 
                :to="{ query: { tab: 'setup' } }" 
                class="btn btn-sm btn-warning mt-2"
              >
                Setup fortsetzen
              </router-link>
            </div>
            
            <div v-else class="alert alert-success">
              <i class="fa fa-check-circle"></i>
              <strong>Setup abgeschlossen!</strong>
              Alle Einrichtungsschritte wurden erfolgreich durchgeführt.
            </div>
          </div>
        </div>

        <!-- Team-Übersicht -->
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="fa fa-users"></i>
              Teams
            </h5>
            <router-link 
              :to="{ query: { tab: 'teams' } }" 
              class="btn btn-sm btn-outline-primary"
            >
              Alle Teams verwalten
            </router-link>
          </div>
          <div class="card-body">
            <div v-if="project.workAreas.length === 0" class="text-center py-4">
              <i class="fa fa-users fa-3x text-muted mb-3"></i>
              <h6 class="text-muted">Noch keine Teams erstellt</h6>
              <p class="text-muted">Erstellen Sie Teams für verschiedene Arbeitsbereiche.</p>
              <router-link 
                :to="{ query: { tab: 'teams' } }" 
                class="btn btn-primary"
              >
                Erstes Team erstellen
              </router-link>
            </div>
            
            <div v-else class="row">
              <div 
                v-for="workArea in project.workAreas.slice(0, 3)" 
                :key="workArea.id"
                class="col-md-4 mb-3"
              >
                <div class="card h-100">
                  <div class="card-body">
                    <h6 class="card-title">{{ workArea.name }}</h6>
                    <p class="card-text text-muted small">{{ workArea.description }}</p>
                    <div class="d-flex justify-content-between align-items-center">
                      <small class="text-muted">
                        <i class="fa fa-user"></i>
                        {{ getPersonName(workArea.leaderId) }}
                      </small>
                      <span class="badge bg-secondary">
                        {{ workArea.members?.length || 0 }} Mitglieder
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-if="project.workAreas.length > 3" class="col-md-4 mb-3">
                <div class="card h-100 border-dashed">
                  <div class="card-body d-flex align-items-center justify-content-center">
                    <div class="text-center">
                      <i class="fa fa-plus fa-2x text-muted mb-2"></i>
                      <p class="text-muted mb-0">
                        {{ project.workAreas.length - 3 }} weitere Teams
                      </p>
                      <router-link 
                        :to="{ query: { tab: 'teams' } }" 
                        class="btn btn-sm btn-outline-primary mt-2"
                      >
                        Alle anzeigen
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seitenleiste -->
      <div class="col-lg-4">
        <!-- Projekt-Details -->
        <div class="card mb-4">
          <div class="card-header">
            <h6 class="mb-0">
              <i class="fa fa-info-circle"></i>
              Projekt-Details
            </h6>
          </div>
          <div class="card-body">
            <dl class="row mb-0">
              <dt class="col-sm-5">Status:</dt>
              <dd class="col-sm-7">
                <span 
                  class="badge"
                  :class="getStatusBadgeClass(project.status)"
                >
                  {{ getStatusText(project.status) }}
                </span>
              </dd>
              
              <dt class="col-sm-5">Projektleiter:</dt>
              <dd class="col-sm-7">{{ getPersonName(project.leaderId) }}</dd>
              
              <dt class="col-sm-5">Erstellt:</dt>
              <dd class="col-sm-7">{{ formatDate(project.createdAt) }}</dd>
              
              <dt class="col-sm-5">Aktualisiert:</dt>
              <dd class="col-sm-7">{{ formatDate(project.updatedAt) }}</dd>
            </dl>
          </div>
        </div>

        <!-- Externe Beschreibung -->
        <div v-if="project.externalDescription" class="card mb-4">
          <div class="card-header">
            <h6 class="mb-0">
              <i class="fa fa-eye"></i>
              Öffentliche Beschreibung
            </h6>
          </div>
          <div class="card-body">
            <p class="mb-0">{{ project.externalDescription }}</p>
          </div>
        </div>

        <!-- Schnellaktionen -->
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0">
              <i class="fa fa-bolt"></i>
              Schnellaktionen
            </h6>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <router-link 
                :to="{ query: { tab: 'teams' } }" 
                class="btn btn-outline-primary btn-sm"
              >
                <i class="fa fa-plus"></i>
                Team hinzufügen
              </router-link>
              
              <router-link 
                :to="{ query: { tab: 'calendar' } }" 
                class="btn btn-outline-success btn-sm"
              >
                <i class="fa fa-calendar-plus"></i>
                Termin erstellen
              </router-link>
              
              <router-link 
                :to="{ query: { tab: 'wiki' } }" 
                class="btn btn-outline-info btn-sm"
              >
                <i class="fa fa-edit"></i>
                Wiki bearbeiten
              </router-link>
              
              <router-link 
                :to="{ query: { tab: 'communication' } }" 
                class="btn btn-outline-warning btn-sm"
              >
                <i class="fa fa-bullhorn"></i>
                Ankündigung erstellen
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProjectData } from '@/types/project'
import { mockProjectService } from '@/services/mockProjectService'

interface Props {
  project: ProjectData
}

const props = defineProps<Props>()

// Computed
const totalMembers = computed(() => {
  const allMembers = new Set<number>()
  props.project.workAreas.forEach(area => {
    area.members?.forEach(member => allMembers.add(member.personId))
  })
  return allMembers.size
})

const completedTodos = computed(() => {
  return props.project.setupTodos.filter(todo => todo.completed).length
})

const pendingTodos = computed(() => {
  return props.project.setupTodos.filter(todo => !todo.completed)
})

const setupProgress = computed(() => {
  if (props.project.setupTodos.length === 0) return 100
  return Math.round((completedTodos.value / props.project.setupTodos.length) * 100)
})

const activeCalendars = computed(() => {
  return props.project.workAreas.filter(area => area.calendarId).length
})

// Methods
const getProgressBarClass = (progress: number) => {
  if (progress >= 80) return 'bg-success'
  if (progress >= 50) return 'bg-warning'
  return 'bg-danger'
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

const getPersonName = (personId?: number) => {
  if (!personId) return 'Unbekannt'
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
</script>

<style scoped>
.border-dashed {
  border: 2px dashed #dee2e6 !important;
}

.border-dashed .card-body {
  background-color: #f8f9fa;
}

.progress {
  border-radius: 4px;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
}

.alert {
  border: none;
  border-radius: 8px;
}

dl.row dt {
  font-weight: 600;
  color: #6c757d;
  font-size: 0.875rem;
}

dl.row dd {
  font-size: 0.875rem;
}
</style>