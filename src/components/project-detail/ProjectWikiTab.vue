<template>
  <div class="project-wiki-tab">
    <div class="alert alert-info">
      <i class="fa fa-info-circle"></i>
      <strong>Wiki-Integration</strong><br>
      Diese Ansicht zeigt die Integration mit ChurchTools-Wiki für das Projekt "{{ project.name }}".
      In der finalen Version werden hier die tatsächlichen Wiki-Seiten angezeigt und bearbeitet.
    </div>

    <div class="row">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0">
              <i class="fa fa-book"></i>
              Wiki-Inhalt
            </h6>
          </div>
          <div class="card-body">
            <p class="text-muted">Wiki-Editor wird hier implementiert...</p>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4">
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0">
              <i class="fa fa-sitemap"></i>
              Wiki-Struktur
            </h6>
          </div>
          <div class="card-body">
            <div v-if="project.wikiConfig?.structure">
              <div v-for="(section, name) in project.wikiConfig.structure" :key="name" class="mb-2">
                <div class="d-flex align-items-center">
                  <i class="fa fa-file-text text-info me-2"></i>
                  <div>
                    <div class="fw-bold">{{ name }}</div>
                    <small class="text-muted">{{ section.description }}</small>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-muted">
              Keine Wiki-Struktur konfiguriert
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