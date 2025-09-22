<template>
  <div class="project-teams-tab">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h5 class="mb-0">
        <i class="fa fa-users"></i>
        Teams verwalten
      </h5>
      <button
        type="button"
        class="btn btn-primary"
        @click="showAddTeamDialog = true"
      >
        <i class="fa fa-plus"></i>
        Team hinzufügen
      </button>
    </div>

    <!-- Teams-Liste -->
    <div v-if="project.workAreas.length === 0" class="text-center py-5">
      <i class="fa fa-users fa-3x text-muted mb-3"></i>
      <h5 class="text-muted">Noch keine Teams erstellt</h5>
      <p class="text-muted">
        Erstellen Sie Teams für verschiedene Arbeitsbereiche Ihres Projekts.
      </p>
      <button
        type="button"
        class="btn btn-primary"
        @click="showAddTeamDialog = true"
      >
        <i class="fa fa-plus"></i>
        Erstes Team erstellen
      </button>
    </div>

    <div v-else class="row">
      <div
        v-for="workArea in project.workAreas"
        :key="workArea.id"
        class="col-lg-6 col-xl-4 mb-4"
      >
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h6 class="mb-0">{{ workArea.name }}</h6>
            <div class="dropdown">
              <button
                class="btn btn-sm btn-outline-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
              >
                <i class="fa fa-cog"></i>
              </button>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="editTeam(workArea)">
                    <i class="fa fa-edit"></i> Bearbeiten
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="manageMembers(workArea)">
                    <i class="fa fa-users"></i> Mitglieder verwalten
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item text-danger" href="#" @click.prevent="deleteTeam(workArea)">
                    <i class="fa fa-trash"></i> Team löschen
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div class="card-body">
            <p class="text-muted mb-3">{{ workArea.description || 'Keine Beschreibung' }}</p>
            
            <!-- Team-Statistiken -->
            <div class="row text-center mb-3">
              <div class="col-6">
                <div class="small text-muted">Mitglieder</div>
                <div class="fw-bold">{{ workArea.members?.length || 0 }}</div>
              </div>
              <div class="col-6">
                <div class="small text-muted">Budget</div>
                <div class="fw-bold">{{ formatBudget(workArea.budget) }}</div>
              </div>
            </div>

            <!-- Teamleiter -->
            <div class="mb-3">
              <small class="text-muted d-block">Teamleiter:</small>
              <div class="d-flex align-items-center">
                <i class="fa fa-user-tie me-2"></i>
                <span>{{ getPersonName(workArea.leaderId) }}</span>
              </div>
            </div>

            <!-- ChurchTools-Verknüpfungen -->
            <div class="mb-3">
              <div v-if="workArea.groupId" class="d-flex align-items-center mb-1">
                <i class="fa fa-users me-2 text-primary"></i>
                <small class="text-muted">
                  Gruppe: {{ getGroupName(workArea.groupId) }}
                </small>
              </div>
              <div v-if="workArea.calendarId" class="d-flex align-items-center">
                <i class="fa fa-calendar me-2 text-success"></i>
                <small class="text-muted">
                  Kalender: Kalender {{ workArea.calendarId }}
                </small>
              </div>
            </div>

            <!-- Aufgabenbereiche -->
            <div v-if="workArea.responsibilities && workArea.responsibilities.length > 0">
              <small class="text-muted d-block mb-2">Aufgabenbereiche:</small>
              <div class="d-flex flex-wrap gap-1">
                <span
                  v-for="responsibility in workArea.responsibilities.slice(0, 3)"
                  :key="responsibility"
                  class="badge bg-light text-dark"
                >
                  {{ responsibility }}
                </span>
                <span
                  v-if="workArea.responsibilities.length > 3"
                  class="badge bg-secondary"
                >
                  +{{ workArea.responsibilities.length - 3 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Team hinzufügen Dialog -->
    <div
      v-if="showAddTeamDialog"
      class="modal d-block"
      style="background-color: rgba(0,0,0,0.5);"
      @click.self="showAddTeamDialog = false"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Neues Team erstellen</h5>
            <button
              type="button"
              class="btn-close"
              @click="showAddTeamDialog = false"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addTeam">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="teamName" class="form-label">Team-Name *</label>
                    <input
                      id="teamName"
                      v-model="newTeam.name"
                      type="text"
                      class="form-control"
                      required
                      placeholder="z.B. Catering-Team"
                    >
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="teamLeader" class="form-label">Teamleiter *</label>
                    <select
                      id="teamLeader"
                      v-model="newTeam.leaderId"
                      class="form-select"
                      required
                    >
                      <option value="">Teamleiter auswählen...</option>
                      <option value="42">Max Mustermann</option>
                      <option value="43">Anna Schmidt</option>
                      <option value="44">Peter Weber</option>
                      <option value="47">Sarah Klein</option>
                      <option value="52">Chris Miller</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="teamDescription" class="form-label">Beschreibung</label>
                <textarea
                  id="teamDescription"
                  v-model="newTeam.description"
                  class="form-control"
                  rows="3"
                  placeholder="Beschreibung der Aufgaben und Verantwortlichkeiten..."
                ></textarea>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="teamBudget" class="form-label">Budget (€)</label>
                    <input
                      id="teamBudget"
                      v-model.number="newTeam.budget"
                      type="number"
                      class="form-control"
                      min="0"
                      step="50"
                      placeholder="0"
                    >
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="parentTeam" class="form-label">Übergeordnetes Team</label>
                    <select
                      id="parentTeam"
                      v-model="newTeam.parentId"
                      class="form-select"
                    >
                      <option value="">Kein übergeordnetes Team</option>
                      <option
                        v-for="area in project.workAreas"
                        :key="area.id"
                        :value="area.id"
                      >
                        {{ area.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Aufgabenbereiche</label>
                <div class="input-group mb-2">
                  <input
                    v-model="newResponsibility"
                    type="text"
                    class="form-control"
                    placeholder="Aufgabenbereich hinzufügen..."
                    @keyup.enter="addResponsibility"
                  >
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="addResponsibility"
                  >
                    <i class="fa fa-plus"></i>
                  </button>
                </div>
                <div v-if="newTeam.responsibilities && newTeam.responsibilities.length > 0" class="d-flex flex-wrap gap-1">
                  <span
                    v-for="(responsibility, index) in newTeam.responsibilities"
                    :key="index"
                    class="badge bg-primary"
                  >
                    {{ responsibility }}
                    <button
                      type="button"
                      class="btn-close btn-close-white ms-1"
                      style="font-size: 0.6rem;"
                      @click="removeResponsibility(index)"
                    ></button>
                  </span>
                </div>
              </div>

              <div class="alert alert-info">
                <i class="fa fa-info-circle"></i>
                <strong>Hinweis:</strong> Nach der Erstellung können Sie ChurchTools-Gruppen und Kalender für dieses Team einrichten.
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showAddTeamDialog = false"
            >
              Abbrechen
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="addTeam"
              :disabled="!newTeam.name || !newTeam.leaderId || adding"
            >
              <span v-if="adding" class="spinner-border spinner-border-sm me-2"></span>
              Team erstellen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ProjectData, WorkAreaData } from '@/types/project'
import { mockProjectService } from '@/services/mockProjectService'
import { useToast } from '@/composables/useToast'

interface Props {
  project: ProjectData
}

interface Emits {
  (e: 'work-area-added', workAreaData: Omit<WorkAreaData, 'type' | 'id'>): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { showToast } = useToast()

// Reactive state
const showAddTeamDialog = ref(false)
const adding = ref(false)
const newResponsibility = ref('')

const newTeam = ref<Omit<WorkAreaData, 'type' | 'id'>>({
  name: '',
  description: '',
  parentId: undefined,
  groupId: undefined,
  calendarId: undefined,
  leaderId: undefined,
  members: [],
  responsibilities: [],
  budget: undefined
})

// Methods
const addTeam = async () => {
  if (!newTeam.value.name || !newTeam.value.leaderId) return

  adding.value = true
  try {
    emit('work-area-added', { ...newTeam.value })
    
    // Dialog schließen und Form zurücksetzen
    showAddTeamDialog.value = false
    resetForm()
  } catch (error) {
    showToast('Fehler', 'Das Team konnte nicht erstellt werden.', 'error')
  } finally {
    adding.value = false
  }
}

const addResponsibility = () => {
  if (newResponsibility.value.trim()) {
    if (!newTeam.value.responsibilities) {
      newTeam.value.responsibilities = []
    }
    newTeam.value.responsibilities.push(newResponsibility.value.trim())
    newResponsibility.value = ''
  }
}

const removeResponsibility = (index: number) => {
  if (newTeam.value.responsibilities) {
    newTeam.value.responsibilities.splice(index, 1)
  }
}

const resetForm = () => {
  newTeam.value = {
    name: '',
    description: '',
    parentId: undefined,
    groupId: undefined,
    calendarId: undefined,
    leaderId: undefined,
    members: [],
    responsibilities: [],
    budget: undefined
  }
  newResponsibility.value = ''
}

const editTeam = (workArea: WorkAreaData) => {
  showToast('Info', 'Team bearbeiten - Feature wird implementiert', 'info')
}

const manageMembers = (workArea: WorkAreaData) => {
  showToast('Info', 'Mitglieder verwalten - Feature wird implementiert', 'info')
}

const deleteTeam = (workArea: WorkAreaData) => {
  showToast('Info', 'Team löschen - Feature wird implementiert', 'info')
}

const getPersonName = (personId?: number) => {
  if (!personId) return 'Unbekannt'
  return mockProjectService.getPersonName(personId)
}

const getGroupName = (groupId: number) => {
  return mockProjectService.getGroupName(groupId)
}

const formatBudget = (budget?: number) => {
  if (!budget) return '-'
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(budget)
}
</script>

<style scoped>
.modal {
  z-index: 1050;
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.badge {
  font-size: 0.75rem;
}

.btn-close-white {
  filter: invert(1) grayscale(100%) brightness(200%);
}

.dropdown-toggle::after {
  margin-left: 0.5em;
}

.input-group .btn {
  border-left: none;
}

.alert {
  border: none;
  border-radius: 8px;
}
</style>