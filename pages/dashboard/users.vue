<template>
  <div class="space-y-6">
    <!-- User Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div class="flex items-center">
          <UsersIcon class="w-8 h-8 text-primary-500" />
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Users
            </p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ userStats.total }}
            </p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div class="flex items-center">
          <UserPlusIcon class="w-8 h-8 text-primary-500" />
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              New Users (30 days)
            </p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ userStats.newUsers }}
            </p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div class="flex items-center">
          <UserCheckIcon class="w-8 h-8 text-primary-500" />
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Active Users
            </p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ userStats.active }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- User Management -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            User Management
          </h2>
          
          <div class="flex flex-col md:flex-row gap-2">
            <div class="relative">
              <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search users..."
                class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <button
              @click="showAddUser = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Add User
            </button>
            
            <button
              @click="exportUsers"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <DownloadIcon class="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                v-for="header in userHeaders"
                :key="header"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ header }}
              </th>
              <th class="px-6 py-3 text-right">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ user.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ user.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ user.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ user.role }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(user.status)"
                >
                  {{ user.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ user.createdAt }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editUser(user)"
                  class="text-primary-600 hover:text-primary-900 mr-3"
                >
                  Edit
                </button>
                <button
                  @click="toggleUserStatus(user)"
                  class="text-gray-600 hover:text-gray-900"
                >
                  {{ user.status === 'active' ? 'Disable' : 'Enable' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="currentPage > 1 ? currentPage-- : null"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            @click="currentPage < totalPages ? currentPage++ : null"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Showing
              <span class="font-medium">{{ startItem }}</span>
              to
              <span class="font-medium">{{ endItem }}</span>
              of
              <span class="font-medium">{{ totalItems }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                @click="currentPage > 1 ? currentPage-- : null"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <span class="sr-only">Previous</span>
                <ChevronLeftIcon class="h-5 w-5" />
              </button>
              <button
                v-for="page in displayedPages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  currentPage === page
                    ? 'z-10 bg-primary-50 border-primary-500 text-primary-600 dark:bg-primary-900 dark:border-primary-700 dark:text-primary-400'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="currentPage < totalPages ? currentPage++ : null"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <span class="sr-only">Next</span>
                <ChevronRightIcon class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <TransitionRoot appear :show="showAddUser" as="template">
      <Dialog as="div" @close="showAddUser = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto bg-black/30 backdrop-blur-lg">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  {{ editingUser ? 'Edit User' : 'Add New User' }}
                </DialogTitle>

                <form @submit.prevent="saveUser" class="mt-4 space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name
                    </label>
                    <input
                      v-model="userForm.name"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-3 px-3"
                      :class="{ 'border-red-300 dark:border-red-700': errors.name }"
                    />
                    <p v-if="errors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.name }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      v-model="userForm.email"
                      type="email"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-3 px-3"
                      :class="{ 'border-red-300 dark:border-red-700': errors.email }"
                    />
                    <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.email }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Role
                    </label>
                    <select
                      v-model="userForm.role"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-3 px-3"
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="support">Support</option>
                      <option value="driver">Driver</option>
                    </select>
                  </div>

                  <div v-if="!editingUser">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <input
                      v-model="userForm.password"
                      type="password"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-3 px-3"
                      :class="{ 'border-red-300 dark:border-red-700': errors.password }"
                    />
                    <p v-if="errors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.password }}</p>
                  </div>

                  <div class="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      @click="showAddUser = false"
                      class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
  Users as UsersIcon,
  UserPlus as UserPlusIcon,
  UserCheck as UserCheckIcon,
  Search as SearchIcon,
  Plus as PlusIcon,
  Download as DownloadIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from 'lucide-vue-next'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle
} from '@headlessui/vue'

// User statistics
const userStats = reactive({
  total: 24531,
  newUsers: 1243,
  active: 18975
})

// Users table
const userHeaders = [
  'ID',
  'Name',
  'Email',
  'Role',
  'Status',
  'Created At'
]

// Dummy users data
const users = ref([
  {
    id: 'U-1001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: 'U-1002',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'manager',
    status: 'active',
    createdAt: '2024-01-20'
  },
  {
    id: 'U-1003',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'support',
    status: 'inactive',
    createdAt: '2024-02-05'
  },
  {
    id: 'U-1004',
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    role: 'driver',
    status: 'active',
    createdAt: '2024-02-10'
  },
  {
    id: 'U-1005',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    role: 'driver',
    status: 'active',
    createdAt: '2024-02-15'
  },
  {
    id: 'U-1006',
    name: 'Diana Prince',
    email: 'diana.prince@example.com',
    role: 'support',
    status: 'active',
    createdAt: '2024-02-20'
  },
  {
    id: 'U-1007',
    name: 'Edward Norton',
    email: 'edward.norton@example.com',
    role: 'driver',
    status: 'inactive',
    createdAt: '2024-03-01'
  }
])

// Search and pagination
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

// Filtered users based on search
const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    return paginatedUsers.value
  }
  
  const query = searchQuery.value.toLowerCase()
  const filtered = users.value.filter(user => 
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    user.role.toLowerCase().includes(query) ||
    user.id.toLowerCase().includes(query)
  )
  
  return filtered.slice(startIndex.value, endIndex.value)
})

// Pagination calculations
const totalItems = computed(() => {
  if (!searchQuery.value) {
    return users.value.length
  }
  
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    user.role.toLowerCase().includes(query) ||
    user.id.toLowerCase().includes(query)
  ).length
})

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalItems.value))
const startItem = computed(() => startIndex.value + 1)
const endItem = computed(() => endIndex.value)

// Pagination display logic
const displayedPages = computed(() => {
  const pages = []
  const maxPages = 5
  
  if (totalPages.value <= maxPages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    let startPage = Math.max(1, currentPage.value - Math.floor(maxPages / 2))
    let endPage = startPage + maxPages - 1
    
    if (endPage > totalPages.value) {
      endPage = totalPages.value
      startPage = Math.max(1, endPage - maxPages + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

// Paginated users
const paginatedUsers = computed(() => {
  return users.value.slice(startIndex.value, endIndex.value)
})

// User form
const showAddUser = ref(false)
const editingUser = ref(null)
const userForm = reactive({
  name: '',
  email: '',
  role: 'driver',
  password: ''
})
const errors = reactive({
  name: '',
  email: '',
  password: ''
})

// Status styling
const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return classes[status] || ''
}

// Form validation
const validateForm = () => {
  let isValid = true
  errors.name = ''
  errors.email = ''
  errors.password = ''
  
  if (!userForm.name) {
    errors.name = 'Name is required'
    isValid = false
  }
  
  if (!userForm.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^\S+@\S+\.\S+$/.test(userForm.email)) {
    errors.email = 'Email is invalid'
    isValid = false
  }
  
  if (!editingUser.value && !userForm.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (!editingUser.value && userForm.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }
  
  return isValid
}

// Actions
const editUser = (user) => {
  editingUser.value = user
  userForm.name = user.name
  userForm.email = user.email
  userForm.role = user.role
  userForm.password = ''
  showAddUser.value = true
}

const saveUser = () => {
  if (!validateForm()) return
  
  if (editingUser.value) {
    const index = users.value.findIndex(u => u.id === editingUser.value.id)
    users.value[index] = {
      ...users.value[index],
      name: userForm.name,
      email: userForm.email,
      role: userForm.role
    }
  } else {
    users.value.push({
      id: `U-${1000 + users.value.length + 1}`,
      name: userForm.name,
      email: userForm.email,
      role: userForm.role,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    })
  }
  
  showAddUser.value = false
  editingUser.value = null
  userForm.name = ''
  userForm.email = ''
  userForm.role = 'driver'
  userForm.password = ''
}

const toggleUserStatus = (user) => {
  user.status = user.status === 'active' ? 'inactive' : 'active'
}

const exportUsers = () => {
  const headers = userHeaders.join(',')
  const rows = users.value.map(user => 
    Object.values(user).join(',')
  ).join('\n')
  
  const csv = `${headers}\n${rows}`
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'users.csv'
  a.click()
  window.URL.revokeObjectURL(url)
}

definePageMeta({
      layout: 'dashboard',
       middleware: 'auth'
  })
</script>