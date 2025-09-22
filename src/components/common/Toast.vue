<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
          :class="getToastClass(toast.type)"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-6 h-6 flex items-center justify-center text-lg" :class="getIconClass(toast.type)">
                  {{ getIcon(toast.type) }}
                </div>
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900" v-if="toast.title">{{ toast.title }}</p>
                <p class="text-sm text-gray-500" :class="{ 'mt-1': toast.title }">{{ toast.message }}</p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  v-if="toast.dismissible"
                  class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                  @click.stop="removeToast(toast.id)"
                >
                  <span class="text-xl">×</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '../../composables/useToast'

const { toasts, removeToast } = useToast()

const getIcon = (type: string) => {
  const icons = {
    success: '✓',
    warning: '⚠',
    error: '✕',
    info: 'ℹ'
  }
  return icons[type as keyof typeof icons] || icons.info
}

const getIconClass = (type: string) => {
  const classes = {
    success: 'text-success-500',
    warning: 'text-warning-500',
    error: 'text-danger-500',
    info: 'text-primary-500'
  }
  return classes[type as keyof typeof classes] || classes.info
}

const getToastClass = (type: string) => {
  const classes = {
    success: 'border-l-4 border-l-success-500',
    warning: 'border-l-4 border-l-warning-500',
    error: 'border-l-4 border-l-danger-500',
    info: 'border-l-4 border-l-primary-500'
  }
  return classes[type as keyof typeof classes] || classes.info
}
</script>

<style scoped>
/* Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>