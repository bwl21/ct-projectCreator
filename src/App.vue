<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <nav class="bg-primary-600 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center text-white hover:text-primary-100 transition-colors">
              <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <span class="text-lg font-semibold">ChurchTools Projektorganisation</span>
            </router-link>
          </div>
          
          <div class="flex items-center">
            <span v-if="user" class="text-primary-100 text-sm">
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              {{ user.firstName }} {{ user.lastName }}
            </span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
/* Tailwind handles all styling, minimal custom CSS needed */
</style>