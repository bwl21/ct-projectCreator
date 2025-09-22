<template>
  <div class="project-calendar-tab">
    <div class="alert alert-info">
      <i class="fa fa-info-circle"></i>
      <strong>Kalender-Integration</strong><br>
      Diese Ansicht zeigt die Integration mit ChurchTools-Kalendern für das Projekt "{{ project.name }}".
      In der finalen Version werden hier die tatsächlichen Kalender-Daten angezeigt.
    </div>

    <div class="row">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0">
              <i class="fa fa-calendar"></i>
              Projekt-Kalender
            </h6>
          </div>
          <div class="card-body">
            <p class="text-muted">Kalender-Ansicht wird hier implementiert...</p>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4">
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0">
              <i class="fa fa-list"></i>
              Verknüpfte Kalender
            </h6>
          </div>
          <div class="card-body">
            <div v-for="workArea in project.workAreas.filter(wa => wa.calendarId)" :key="workArea.id" class="mb-2">
              <div class="d-flex align-items-center">
                <i class="fa fa-calendar text-success me-2"></i>
                <div>
                  <div class="fw-bold">{{ workArea.name }}</div>
                  <small class="text-muted">Kalender ID: {{ workArea.calendarId }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProjectData } from '@/types/project'

interface Props {
  project: ProjectData
}

defineProps<Props>()
</script>