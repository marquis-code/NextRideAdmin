<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <template v-if="isAuthenticated && !isLoginPage">
        <!-- Sidebar -->
        <aside
          :class="[
            'fixed top-0 left-0 z-40 h-screen transition-transform',
            'w-64 md:translate-x-0',
            { '-translate-x-full': !isSidebarOpen }
          ]"
          class="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
        >
          <div class="flex flex-col h-full">
            <!-- Logo -->
            <div class="h-16 flex items-center justify-between px-4 border-b dark:border-gray-700">
              <!-- <span class="text-xl font-semibold dark:text-white">Nextride Admin</span> -->
               <img class="text-xl font-semibold dark:text-white h-8" src="@/assets/img/logo.png" />
              <button
                @click="toggleSidebar"
                class="md:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400"
              >
                <MenuIcon v-if="!isSidebarOpen" />
                <XIcon v-else />
              </button>
            </div>
  
            <!-- Navigation -->
            <nav class="flex-1 overflow-y-auto p-4">
              <ul class="space-y-2">
                <li v-for="item in filteredNavigationItems" :key="item.path">
                  <NuxtLink
                    :to="item.path"
                    class="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    :class="{ 'bg-gray-100 dark:bg-gray-700': isCurrentRoute(item.path) }"
                  >
                    <component
                      :is="item.icon"
                      class="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    />
                    <span class="ml-3 text-gray-900 dark:text-white">{{ item.name }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </nav>
  
            <!-- User Menu -->
            <div class="border-t border-gray-200 dark:border-gray-700 p-4">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <UserIcon class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ user?.name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ user?.role }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
  
        <!-- Main Content -->
        <main
          :class="[
            'transition-all duration-300 ease-in-out',
            'md:ml-64'
          ]"
        >
          <!-- Top Navigation -->
          <header class="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
            <button
              @click="toggleSidebar"
              class="md:hidden mr-4 text-gray-500 hover:text-gray-900 dark:text-gray-400"
            >
              <MenuIcon />
            </button>
            <div class="flex-1">
              <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ currentPageTitle }}
              </h1>
            </div>
            <div class="flex items-center space-x-4">
              <button
                @click="toggleTheme"
                class="text-gray-500 hover:text-gray-900 dark:text-gray-400"
              >
                <SunIcon v-if="isDark" />
                <MoonIcon v-else />
              </button>
              <button
                @click="logout"
                class="text-gray-500 hover:text-gray-900 dark:text-gray-400"
              >
                <LogOutIcon />
              </button>
            </div>
          </header>
  
          <!-- Page Content -->
          <div class="p-4">
            <slot />
          </div>
        </main>
      </template>
      
      <template v-else>
        <slot />
      </template>
    </div>
  </template>
  
  <script setup>
  import {
    Menu as MenuIcon,
    X as XIcon,
    Home as HomeIcon,
    Users as UsersIcon,
    Calendar as BookingsIcon,
    DollarSign as FinanceIcon,
    Truck as FleetIcon,
    MessageSquare as SupportIcon,
    BarChart as AnalyticsIcon,
    Settings as SettingsIcon,
    Sun as SunIcon,
    Moon as MoonIcon,
    LogOut as LogOutIcon,
    User as UserIcon
  } from 'lucide-vue-next'
  
  // Composables
  const useNavigation = () => {
    const route = useRoute()
    const { hasPermission } = useAuth()
    
    // const navigationItems = [
    //   { name: 'Dashboard', path: '/', icon: HomeIcon, permission: null },
    //   { name: 'Users', path: '/users', icon: UsersIcon, permission: 'users:manage' },
    //   { name: 'Bookings', path: '/bookings', icon: BookingsIcon, permission: 'bookings:view' },
    //   { name: 'Finance', path: '/finance', icon: FinanceIcon, permission: 'finance:manage' },
    //   { name: 'Fleet', path: '/fleet', icon: FleetIcon, permission: 'fleet:manage' },
    //   { name: 'Support', path: '/support', icon: SupportIcon, permission: 'support:manage' },
    //   { name: 'Analytics', path: '/analytics', icon: AnalyticsIcon, permission: 'analytics:view' },
    //   { name: 'Settings', path: '/settings', icon: SettingsIcon, permission: 'settings:manage' }
    // ]
    const navigationItems = [
      { name: 'Dashboard', path: '/dashboard', icon: HomeIcon, permission: null },
      { name: 'Users', path: '/dashboard/users', icon: UsersIcon, permission: null },
      { name: 'Bookings', path: '/dashboard/bookings', icon: BookingsIcon, permission: null },
      { name: 'Finance', path: '/dashboard/finance', icon: FinanceIcon, permission: null },
      { name: 'Fleet', path: '/dashboard/fleet', icon: FleetIcon, permission: null },
      { name: 'Support', path: '/dashboard/support', icon: SupportIcon, permission: null },
      { name: 'Analytics', path: '/dashboard/analytics', icon: AnalyticsIcon, permission: null },
      { name: 'Settings', path: '/dashboard/settings', icon: SettingsIcon, permission: null }
    ]
  
    const filteredNavigationItems = computed(() => {
      return navigationItems.filter(item => {
        return item.permission === null || hasPermission(item.permission)
      })
    })
  
    const isCurrentRoute = (path) => route.path === path
    
    const currentPageTitle = computed(() => {
      const current = navigationItems.find(item => isCurrentRoute(item.path))
      return current ? current.name : 'Dashboard'
    })
  
    return {
      navigationItems,
      filteredNavigationItems,
      isCurrentRoute,
      currentPageTitle
    }
  }
  
  const useSidebar = () => {
    const isSidebarOpen = ref(false)
    
    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value
    }
  
    return {
      isSidebarOpen,
      toggleSidebar
    }
  }
  
  const useTheme = () => {
    const isDark = ref(false)
    
    const toggleTheme = () => {
      isDark.value = !isDark.value
      document.documentElement.classList.toggle('dark')
    }
  
    onMounted(() => {
      // Check for saved theme preference
      const savedTheme = localStorage.getItem('nextride_theme')
      if (savedTheme === 'dark') {
        isDark.value = true
        document.documentElement.classList.add('dark')
      }
    })
  
    watch(isDark, (newValue) => {
      localStorage.setItem('nextride_theme', newValue ? 'dark' : 'light')
    })
  
    return {
      isDark,
      toggleTheme
    }
  }
  
  // Auth composable
  const { user, isAuthenticated, logout, initAuth } = useAuth()
  
  // Route
  const route = useRoute()
  const isLoginPage = computed(() => route.path === '/login')
  
  // Composition
  const { filteredNavigationItems, isCurrentRoute, currentPageTitle } = useNavigation()
  const { isSidebarOpen, toggleSidebar } = useSidebar()
  const { isDark, toggleTheme } = useTheme()
  
  // Initialize auth on app mount
  onMounted(() => {
    initAuth()
  })

  definePageMeta({
      middleware: 'auth'
  })
  </script>
  
  <style>
  /* Add any custom styles here */
  :root {
    --primary-50: 240, 249, 255;
    --primary-100: 224, 242, 254;
    --primary-200: 186, 230, 253;
    --primary-300: 125, 211, 252;
    --primary-400: 56, 189, 248;
    --primary-500: 14, 165, 233;
    --primary-600: 2, 132, 199;
    --primary-700: 3, 105, 161;
    --primary-800: 7, 89, 133;
    --primary-900: 12, 74, 110;
    --primary-950: 8, 47, 73;
  }
  
  .bg-primary-600 {
    background-color: rgb(var(--primary-600));
  }
  
  .hover\:bg-primary-700:hover {
    background-color: rgb(var(--primary-700));
  }
  
  .text-primary-600 {
    color: rgb(var(--primary-600));
  }
  
  .hover\:text-primary-900:hover {
    color: rgb(var(--primary-900));
  }
  
  .text-primary-500 {
    color: rgb(var(--primary-500));
  }
  
  .focus\:ring-primary-500:focus {
    --tw-ring-color: rgb(var(--primary-500));
  }
  
  .focus\:border-primary-500:focus {
    border-color: rgb(var(--primary-500));
  }
  </style>