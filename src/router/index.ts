import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Lazy load components for better performance
const ProjectOverviewCard = () => import('@/components/project-management/ProjectOverviewCard.vue')
const ProjectDetailView = () => import('@/components/project-detail/ProjectDetailView.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: ProjectOverviewCard,
    meta: {
      title: 'Projektübersicht'
    }
  },
  {
    path: '/project/:id',
    name: 'ProjectDetail',
    component: ProjectDetailView,
    meta: {
      title: 'Projekt-Details'
    },
    props: true
  },
  {
    // Catch-all route for 404s
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Scroll to top when navigating to a new route
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Set document title based on route meta
  if (to.meta.title) {
    document.title = `${to.meta.title} - ChurchTools Projektorganisation`
  }
  
  next()
})

export default router