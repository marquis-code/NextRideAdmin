// import { ref, reactive, computed } from 'vue'
// import { navigateTo } from '#app'

// export default function useAuth() {
//   const user = ref(null)
//   const isAuthenticated = computed(() => !!user.value)
//   const isLoading = ref(true)
  
//   // Role-based permissions
//   const permissions = reactive({
//     // admin: ['users:manage', 'bookings:manage', 'finance:manage', 'fleet:manage', 'support:manage', 'analytics:view', 'settings:manage'],
//     admin: ['users:manage', 'bookings:manage', 'finance:manage', 'fleet:manage', 'support:manage', 'analytics:view', 'settings:manage', 'users:view', 'bookings:view', 'finance:view'], // admin gets all permissions
//     manager: ['bookings:manage', 'fleet:manage', 'support:manage', 'analytics:view'],
//     support: ['bookings:view', 'support:manage'],
//     driver: ['bookings:view']
//   })
  
//   // Check if user has permission
//   const hasPermission = (permission) => {
//     if (!user.value || !user.value.role) return false
//     return permissions[user.value.role]?.includes(permission) || false
//   }
  
//   // Initialize auth state
//   const initAuth = () => {
//     isLoading.value = true
    
//     try {
//       const storedUser = localStorage.getItem('nextride_user')
//       if (storedUser) {
//         user.value = JSON.parse(storedUser)
//       }
//     } catch (error) {
//       console.error('Failed to initialize auth:', error)
//     } finally {
//       isLoading.value = false
//     }
//   }
  
//   // Login
//   const login = async (email, password) => {
//     // In a real app, this would make an API call
//     if (email === 'admin@nextride.com' && password === 'password') {
//       const userData = {
//         id: 1,
//         name: 'Admin User',
//         email,
//         role: 'admin'
//       }
      
//       localStorage.setItem('nextride_token', 'demo_token_12345')
//       localStorage.setItem('nextride_user', JSON.stringify(userData))
//       user.value = userData
      
//       return { success: true }
//     }
    
//     return { success: false, message: 'Invalid credentials' }
//   }
  
//   // Logout
//   const logout = () => {
//     localStorage.removeItem('nextride_token')
//     localStorage.removeItem('nextride_user')
//     user.value = null
//     navigateTo('/login')
//   }
  
//   return {
//     user,
//     isAuthenticated,
//     isLoading,
//     hasPermission,
//     initAuth,
//     login,
//     logout
//   }
// }

import { ref, reactive, computed } from 'vue'

// Export as a function that can be called
export default function useAuth() {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)
  const isLoading = ref(true)
  
  // Role-based permissions
  const permissions = reactive({
    superadmin: ['users:manage', 'bookings:manage', 'finance:manage', 'fleet:manage', 'support:manage', 
                 'analytics:view', 'settings:manage', 'users:view', 'bookings:view', 'finance:view',
                 'system:manage', 'partners:manage'], // superadmin has additional permissions
    admin: ['users:manage', 'bookings:manage', 'finance:manage', 'fleet:manage', 'support:manage', 
            'analytics:view', 'settings:manage', 'users:view', 'bookings:view', 'finance:view'],
    manager: ['bookings:manage', 'fleet:manage', 'support:manage', 'analytics:view'],
    support: ['bookings:view', 'support:manage'],
    driver: ['bookings:view']
  })
  
  // Check if user has permission
  const hasPermission = (permission) => {
    if (!user.value || !user.value.role) return false
    return permissions[user.value.role]?.includes(permission) || false
  }
  
  // Initialize auth state - make SSR safe
  const initAuth = () => {
    isLoading.value = true
    
    // Only access localStorage in client-side context
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('nextride_user')
        if (storedUser) {
          user.value = JSON.parse(storedUser)
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
      }
    }
    
    isLoading.value = false
  }
  
  // Login
  const login = async (email, password) => {
    // In a real app, this would make an API call
    if (email === 'admin@nextride.com' && password === 'password') {
      const userData = {
        id: 1,
        name: 'Admin User',
        email,
        role: 'admin'
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('nextride_token', 'demo_token_12345')
        localStorage.setItem('nextride_user', JSON.stringify(userData))
      }
      
      user.value = userData
      return { success: true }
    }
    
    if (email === 'superadmin@nextride.com' && password === 'password') {
      const userData = {
        id: 0,
        name: 'Super Admin',
        email,
        role: 'superadmin'
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('nextride_token', 'super_token_12345')
        localStorage.setItem('nextride_user', JSON.stringify(userData))
      }
      
      user.value = userData
      return { success: true }
    }
    
    return { success: false, message: 'Invalid credentials' }
  }
  
  // Logout
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nextride_token')
      localStorage.removeItem('nextride_user')
    }
    
    user.value = null
    
    // Use navigateTo only in client context
    if (typeof window !== 'undefined') {
      // Import navigateTo dynamically to avoid SSR issues
      import('#app').then(({ navigateTo }) => {
        navigateTo('/login')
      })
    }
  }
  
  return {
    user,
    isAuthenticated,
    isLoading,
    hasPermission,
    initAuth,
    login,
    logout
  }
}