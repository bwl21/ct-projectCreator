<template>
  <div id="app" class="min-vh-100 bg-light">
    <!-- Navigation Header -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand d-flex align-items-center">
          <svg class="me-2" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          ChurchTools Projektorganisation
        </router-link>
        
        <div class="navbar-nav ms-auto">
          <span v-if="user" class="navbar-text text-light">
            <svg class="me-1" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            {{ user.firstName }} {{ user.lastName }}
          </span>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container-fluid py-4">
      <router-view />
    </main>

    <!-- Toast container -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Toast from './components/common/Toast.vue'
import { useToast } from './composables/useToast'
import { churchtoolsClient } from './services/churchtools'
import type { Person } from './ct-types'

const { showToast } = useToast()
const user = ref<Person | null>(null)

onMounted(async () => {
  try {
    // In development mode, try to load user info if ChurchTools is configured
    if (import.meta.env.MODE === 'development' && import.meta.env.VITE_CHURCHTOOLS_URL) {
      user.value = await churchtoolsClient.get<Person>('/whoami')
    }
  } catch (error) {
    console.warn('Failed to load user, running in demo mode:', error)
    // Show demo mode info
    showToast('Demo-Modus', 'Läuft mit Mock-Daten - keine ChurchTools-Verbindung', 'info')
  }
})
</script>

<style scoped>
/* Ensure navigation has proper height */
.navbar {
  min-height: 56px;
}

/* Prevent excessive spacing */
.navbar-brand {
  margin-right: 1rem;
}
</style>