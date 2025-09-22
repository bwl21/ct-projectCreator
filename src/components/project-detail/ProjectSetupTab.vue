<template>
  <div class="project-setup-tab">
    <!-- Setup-Fortschritt Header -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col">
            <h5 class="mb-2">
              <i class="fa fa-cogs"></i>
              Projekt-Einrichtung
            </h5>
            <p class="text-muted mb-0">
              Führen Sie die folgenden Schritte aus, um Ihr Projekt vollständig einzurichten.
            </p>
          </div>
          <div class="col-auto">
            <div class="text-center">
              <div class="progress-circle mb-2" :style="getProgressCircleStyle()">
                <span class="progress-text">{{ setupProgress }}%</span>
              </div>
              <small class="text-muted">
                {{ completedTodos }} von {{ project.setupTodos.length }} abgeschlossen
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Setup-Todos -->
    <div class="row">
      <div class="col-lg-8">
        <div class="setup-todos">
          <div
            v-for="(todo, index) in sortedTodos"
            :key="todo.id"
            class="card mb-3"
            :class="getTodoCardClass(todo)"
          >
            <div class="card-body">
              <div class="row align-items-center">
                <!-- Todo-Status Icon -->
                <div class="col-auto">
                  <div class="todo-status-icon" :class="getTodoStatusClass(todo)">
                    <i :class="getTodoIcon(todo)"></i>
                  </div>
                </div>

                <!-- Todo-Inhalt -->
                <div class="col">
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <h6 class="mb-0" :class="{ 'text-decoration-line-through text-muted': todo.completed }">
                      {{ todo.title }}
                    </h6>
                    <span 
                      class="badge"
                      :class="getPriorityBadgeClass(todo.priority)"
                    >
                      {{ getPriorityText(todo.priority) }}
                    </span>
                  </div>
                  
                  <p class="text-muted mb-2" :class="{ 'text-decoration-line-through': todo.completed }">
                    {{ todo.description }}
                  </p>

                  <!-- Abhängigkeiten -->
                  <div v-if="todo.dependencies.length > 0" class="mb-2">
                    <small class="text-muted">
                      <i class="fa fa-link"></i>
                      Abhängigkeiten:
                      <span 
                        v-for="(depId, depIndex) in todo.dependencies" 
                        :key="depId"
                        class="ms-1"
                      >
                        <span 
                          class="badge bg-light text-dark"
                          :class="{ 'bg-success text-white': isDependencyCompleted(depId) }"
                        >
                          {{ getDependencyTitle(depId) }}
                        </span>
                        <span v-if="depIndex < todo.dependencies.length - 1">, </span>
                      </span>
                    </small>
                  </div>

                  <!-- Zeitschätzung und Typ -->
                  <div class="d-flex gap-3">
                    <small class="text-muted">
                      <i class="fa fa-clock"></i>
                      {{ todo.estimatedDuration }} Min.
                    </small>
                    <small class="text-muted">
                      <i :class="getTodoTypeIcon(todo.todoType)"></i>
                      {{ getTodoTypeText(todo.todoType) }}
                    </small>
                    <small v-if="todo.completed && todo.completedAt" class="text-success">
                      <i class="fa fa-check"></i>
                      Abgeschlossen {{ formatDate(todo.completedAt) }}
                    </small>
                  </div>
                </div>

                <!-- Aktionen -->
                <div class="col-auto">
                  <div class="btn-group" role="group">
                    <!-- Todo als erledigt markieren -->
                    <button
                      v-if="!todo.completed && canCompleteTodo(todo)"
                      type="button"
                      class="btn btn-success btn-sm"
                      @click="completeTodo(todo)"
                      :disabled="completing === todo.id"
                    >
                      <span v-if="completing === todo.id" class="spinner-border spinner-border-sm me-1"></span>
                      <i v-else class="fa fa-check"></i>
                      Erledigt
                    </button>

                    <!-- Todo rückgängig machen -->
                    <button
                      v-if="todo.completed"
                      type="button"
                      class="btn btn-outline-secondary btn-sm"
                      @click="uncompleteTodo(todo)"
                      :disabled="completing === todo.id"
                    >
                      <i class="fa fa-undo"></i>
                      Rückgängig
                    </button>

                    <!-- Automatische Ausführung -->
                    <button
                      v-if="!todo.completed && canCompleteTodo(todo) && hasAutoAction(todo)"
                      type="button"
                      class="btn btn-primary btn-sm"
                      @click="executeAutoAction(todo)"
                      :disabled="executing === todo.id"
                    >
                      <span v-if="executing === todo.id" class="spinner-border spinner-border-sm me-1"></span>
                      <i v-else class="fa fa-magic"></i>
                      Automatisch
                    </button>

                    <!-- Details anzeigen -->
                    <button
                      type="button"
                      class="btn btn-outline-info btn-sm"
                      @click="showTodoDetails(todo)"
                    >
                      <i class="fa fa-info"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Erweiterte Informationen (ausklappbar) -->
              <div v-if="expandedTodo === todo.id" class="mt-3 pt-3 border-top">
                <div v-if="todo.instructions && todo.instructions.length > 0">
                  <h6>Anweisungen:</h6>
                  <ol class="mb-3">
                    <li v-for="instruction in todo.instructions" :key="instruction">
                      {{ instruction }}
                    </li>
                  </ol>
                </div>

                <div v-if="todo.actionParams">
                  <h6>Parameter:</h6>
                  <pre class="bg-light p-2 rounded small">{{ JSON.stringify(todo.actionParams, null, 2) }}</pre>
                </div>
              </div>
            </div>
          </div>

          <!-- Alle Todos abgeschlossen -->
          <div v-if="allTodosCompleted" class="card border-success">
            <div class="card-body text-center">
              <i class="fa fa-check-circle fa-3x text-success mb-3"></i>
              <h5 class="text-success">Setup abgeschlossen!</h5>
              <p class="text-muted">
                Alle Einrichtungsschritte wurden erfolgreich durchgeführt. 
                Ihr Projekt ist jetzt vollständig konfiguriert.
              </p>
              <button type="button" class="btn btn-success" @click="$emit('refresh')">
                <i class="fa fa-refresh"></i>
                Projekt aktualisieren
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Seitenleiste mit Hilfe -->
      <div class="col-lg-4">
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0">
              <i class="fa fa-question-circle"></i>
              Setup-Hilfe
            </h6>
          </div>
          <div class="card-body">
            <div v-if="nextTodo" class="alert alert-info">
              <h6 class="alert-heading">Nächster Schritt:</h6>
              <p class="mb-0">{{ nextTodo.title }}</p>
              <small class="text-muted">{{ nextTodo.description }}</small>
            </div>

            <div v-else-if="!allTodosCompleted" class="alert alert-warning">
              <h6 class="alert-heading">Abhängigkeiten</h6>
              <p class="mb-0">
                Einige Aufgaben warten auf die Fertigstellung anderer Schritte.
              </p>
            </div>

            <h6 class="mt-3">Setup-Typen:</h6>
            <ul class="list-unstyled">
              <li class="mb-2">
                <i class="fa fa-users text-primary"></i>
                <strong>Gruppe:</strong> ChurchTools-Gruppen erstellen
              </li>
              <li class="mb-2">
                <i class="fa fa-calendar text-success"></i>
                <strong>Kalender:</strong> Projekt-Kalender einrichten
              </li>
              <li class="mb-2">
                <i class="fa fa-book text-info"></i>
                <strong>Wiki:</strong> Dokumentations-Struktur anlegen
              </li>
              <li class="mb-2">
                <i class="fa fa-shield text-warning"></i>
                <strong>Berechtigungen:</strong> Zugriffsrechte konfigurieren
              </li>
            </ul>

            <div class="mt-3">
              <h6>Tipps:</h6>
              <ul class="small text-muted">
                <li>Führen Sie die Schritte in der vorgegebenen Reihenfolge aus</li>
                <li>Nutzen Sie die automatische Ausführung wo möglich</li>
                <li>Bei Problemen können Sie Schritte rückgängig machen</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ProjectData, SetupTodoData } from '@/types/project'
import { useToast } from '@/composables/useToast'

interface Props {
  project: ProjectData
}

interface Emits {
  (e: 'todo-updated', todoId: string, updates: Partial<SetupTodoData>): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { showToast } = useToast()

// Reactive state
const completing = ref<string | null>(null)
const executing = ref<string | null>(null)
const expandedTodo = ref<string | null>(null)

// Computed
const completedTodos = computed(() => {
  return props.project.setupTodos.filter(todo => todo.completed).length
})

const setupProgress = computed(() => {
  if (props.project.setupTodos.length === 0) return 100
  return Math.round((completedTodos.value / props.project.setupTodos.length) * 100)
})

const sortedTodos = computed(() => {
  return [...props.project.setupTodos].sort((a, b) => {
    // Abgeschlossene nach unten
    if (a.completed && !b.completed) return 1
    if (!a.completed && b.completed) return -1
    
    // Nach Priorität
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    const aPriority = priorityOrder[a.priority || 'medium']
    const bPriority = priorityOrder[b.priority || 'medium']
    
    return aPriority - bPriority
  })
})

const allTodosCompleted = computed(() => {
  return props.project.setupTodos.length > 0 && 
         props.project.setupTodos.every(todo => todo.completed)
})

const nextTodo = computed(() => {
  return sortedTodos.value.find(todo => !todo.completed && canCompleteTodo(todo))
})

// Methods
const canCompleteTodo = (todo: SetupTodoData): boolean => {
  return todo.dependencies.every(depId => isDependencyCompleted(depId))
}

const isDependencyCompleted = (dependencyId: string): boolean => {
  const dependency = props.project.setupTodos.find(todo => todo.id === dependencyId)
  return dependency?.completed || false
}

const getDependencyTitle = (dependencyId: string): string => {
  const dependency = props.project.setupTodos.find(todo => todo.id === dependencyId)
  return dependency?.title || 'Unbekannt'
}

const hasAutoAction = (todo: SetupTodoData): boolean => {
  return ['createProjectGroup', 'createProjectCalendar', 'createProjectWiki'].includes(todo.action)
}

const completeTodo = async (todo: SetupTodoData) => {
  completing.value = todo.id
  try {
    emit('todo-updated', todo.id, { completed: true })
  } finally {
    completing.value = null
  }
}

const uncompleteTodo = async (todo: SetupTodoData) => {
  completing.value = todo.id
  try {
    emit('todo-updated', todo.id, { 
      completed: false, 
      completedAt: undefined,
      completedBy: undefined 
    })
  } finally {
    completing.value = null
  }
}

const executeAutoAction = async (todo: SetupTodoData) => {
  executing.value = todo.id
  try {
    // Simuliere automatische Ausführung
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    showToast(
      'Automatische Ausführung', 
      `${todo.title} wurde automatisch durchgeführt.`, 
      'success'
    )
    
    emit('todo-updated', todo.id, { completed: true })
  } catch (error) {
    showToast('Fehler', 'Die automatische Ausführung ist fehlgeschlagen.', 'error')
  } finally {
    executing.value = null
  }
}

const showTodoDetails = (todo: SetupTodoData) => {
  expandedTodo.value = expandedTodo.value === todo.id ? null : todo.id
}

const getTodoCardClass = (todo: SetupTodoData) => {
  if (todo.completed) return 'border-success bg-light'
  if (!canCompleteTodo(todo)) return 'border-warning'
  return 'border-primary'
}

const getTodoStatusClass = (todo: SetupTodoData) => {
  if (todo.completed) return 'status-completed'
  if (!canCompleteTodo(todo)) return 'status-blocked'
  return 'status-ready'
}

const getTodoIcon = (todo: SetupTodoData) => {
  if (todo.completed) return 'fa fa-check'
  if (!canCompleteTodo(todo)) return 'fa fa-lock'
  return 'fa fa-play'
}

const getPriorityBadgeClass = (priority?: string) => {
  switch (priority) {
    case 'high': return 'bg-danger'
    case 'medium': return 'bg-warning text-dark'
    case 'low': return 'bg-info'
    default: return 'bg-secondary'
  }
}

const getPriorityText = (priority?: string) => {
  switch (priority) {
    case 'high': return 'Hoch'
    case 'medium': return 'Mittel'
    case 'low': return 'Niedrig'
    default: return 'Normal'
  }
}

const getTodoTypeIcon = (type: string) => {
  switch (type) {
    case 'group': return 'fa fa-users'
    case 'calendar': return 'fa fa-calendar'
    case 'wiki': return 'fa fa-book'
    case 'permissions': return 'fa fa-shield'
    case 'form': return 'fa fa-wpforms'
    default: return 'fa fa-cog'
  }
}

const getTodoTypeText = (type: string) => {
  switch (type) {
    case 'group': return 'Gruppe'
    case 'calendar': return 'Kalender'
    case 'wiki': return 'Wiki'
    case 'permissions': return 'Berechtigungen'
    case 'form': return 'Formular'
    default: return 'Allgemein'
  }
}

const getProgressCircleStyle = () => {
  const progress = setupProgress.value
  const circumference = 2 * Math.PI * 45 // radius = 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference
  
  return {
    '--progress': progress,
    '--stroke-dasharray': strokeDasharray,
    '--stroke-dashoffset': strokeDashoffset
  }
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
.progress-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: conic-gradient(
    #0d6efd 0deg,
    #0d6efd calc(var(--progress) * 3.6deg),
    #e9ecef calc(var(--progress) * 3.6deg),
    #e9ecef 360deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.progress-circle::before {
  content: '';
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  position: absolute;
}

.progress-text {
  position: relative;
  z-index: 1;
  font-weight: bold;
  color: #0d6efd;
}

.todo-status-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.status-completed {
  background-color: #d1e7dd;
  color: #0f5132;
}

.status-ready {
  background-color: #cff4fc;
  color: #055160;
}

.status-blocked {
  background-color: #fff3cd;
  color: #664d03;
}

.setup-todos .card {
  transition: all 0.2s ease;
}

.setup-todos .card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-group .btn {
  border-radius: 0.375rem;
  margin-left: 0.25rem;
}

.btn-group .btn:first-child {
  margin-left: 0;
}

pre {
  font-size: 0.75rem;
  max-height: 200px;
  overflow-y: auto;
}
</style>