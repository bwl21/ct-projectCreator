<template>
  <div class="project-communication-tab">
    <div class="alert alert-info">
      <i class="fa fa-info-circle"></i>
      <strong>Kommunikations-Integration</strong><br>
      Diese Ansicht zeigt die Integration mit ChurchTools-Kommunikationsfeatures für das Projekt "{{ project.name }}".
      In der finalen Version werden hier Beiträge, Chat und Benachrichtigungen verwaltet.
    </div>

    <div class="row">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0">
              <i class="fa fa-bullhorn"></i>
              Projekt-Ankündigungen
            </h6>
          </div>
          <div class="card-body">
            <p class="text-muted">Beitrags-System wird hier implementiert...</p>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4">
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0">
              <i class="fa fa-comments"></i>
              Team-Kommunikation
            </h6>
          </div>
          <div class="card-body">
            <div v-for="workArea in project.workAreas" :key="workArea.id" class="mb-2">
              <div class="d-flex align-items-center">
                <i class="fa fa-users text-primary me-2"></i>
                <div>
                  <div class="fw-bold">{{ workArea.name }}</div>
                  <small class="text-muted">{{ workArea.members?.length || 0 }} Mitglieder</small>
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