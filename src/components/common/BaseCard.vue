<template>
  <div class="card" :class="{ 'opacity-80': loading }">
    <div v-if="title" class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center">
        <svg v-if="icon" class="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon"></path>
        </svg>
        {{ title }}
      </h3>
      <slot name="actions"></slot>
    </div>
    
    <div class="p-6">
      <div v-if="loading" class="text-center py-8">
        <div class="spinner w-8 h-8 mx-auto mb-4"></div>
        <p class="text-gray-500">{{ loadingText || 'Laden...' }}</p>
      </div>

      <div v-else-if="error" class="text-center py-4">
        <div class="bg-danger-50 border border-danger-200 rounded-md p-4 mb-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-danger-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <span class="text-danger-800">{{ error }}</span>
          </div>
        </div>
        <slot name="error-actions">
          <button type="button" @click="$emit('retry')" class="btn btn-outline text-danger-600 border-danger-300 hover:bg-danger-50">
            {{ retryText || 'Erneut versuchen' }}
          </button>
        </slot>
      </div>

      <div v-else>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  icon?: string
  loading?: boolean
  error?: string | null
  loadingText?: string
  retryText?: string
}>()

defineEmits<{
  retry: []
}>()
</script>

<style scoped>
/* Tailwind handles all styling */
</style>
