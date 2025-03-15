import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware if on login page
  if (to.path === '/') return
  
  // Check if user is authenticated
  const token = localStorage.getItem('nextride_token')
  if (!token) {
    return navigateTo('/')
  }
})