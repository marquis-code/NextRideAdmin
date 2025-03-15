<template>
    <div class="space-y-6">
      <!-- Booking Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          v-for="stat in bookingStats"
          :key="stat.name"
          class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
        >
          <div class="flex items-center">
            <component
              :is="stat.icon"
              class="w-8 h-8 text-primary-500"
            />
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ stat.name }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ stat.value }}
              </p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Booking Management -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">
              Booking Management
            </h2>
            
            <div class="flex flex-col md:flex-row gap-2">
              <div class="relative">
                <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search bookings..."
                  class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <select
                v-model="statusFilter"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <button
                @click="exportBookings"
                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <DownloadIcon class="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
  
        <!-- Bookings Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th
                  v-for="header in bookingHeaders"
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
                v-for="booking in filteredBookings"
                :key="booking.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ booking.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ booking.customer }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ booking.driver }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ booking.pickup }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ booking.destination }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getStatusClass(booking.status)"
                  >
                    {{ booking.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ booking.amount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="viewBooking(booking)"
                    class="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    View
                  </button>
                  <button
                    @click="updateBookingStatus(booking)"
                    class="text-gray-600 hover:text-gray-900"
                  >
                    Update
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
  
      <!-- Booking Detail Modal -->
      <TransitionRoot appear :show="showBookingDetail" as="template">
        <Dialog as="div" @close="showBookingDetail = false" class="relative z-50">
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
  
          <div class="fixed inset-0 overflow-y-auto">
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
                    Booking Details
                  </DialogTitle>
  
                  <div v-if="selectedBooking" class="mt-4 space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Booking ID</p>
                        <p class="text-sm text-gray-900 dark:text-white">{{ selectedBooking.id }}</p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                        <span
                          class="px-2 py-1 text-xs font-medium rounded-full"
                          :class="getStatusClass(selectedBooking.status)"
                        >
                          {{ selectedBooking.status }}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Customer</p>
                      <p class="text-sm text-gray-900 dark:text-white">{{ selectedBooking.customer }}</p>
                    </div>
                    
                    <div>
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Driver</p>
                      <p class="text-sm text-gray-900 dark:text-white">{{ selectedBooking.driver }}</p>
                    </div>
                    
                    <div>
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Pickup Location</p>
                      <p class="text-sm text-gray-900 dark:text-white">{{ selectedBooking.pickup }}</p>
                    </div>
                    
                    <div>
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Destination</p>
                      <p class="text-sm text-gray-900 dark:text-white">{{ selectedBooking.destination }}</p>
                    </div>
                    
                    <div>
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</p>
                      <p class="text-sm text-gray-900 dark:text-white">{{ selectedBooking.amount }}</p>
                    </div>
                    
                    <div>
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Date</p>
                      <p class="text-sm text-gray-900 dark:text-white">{{ selectedBooking.date }}</p>
                    </div>
                    
                    <div>
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Update Status</p>
                      <div class="mt-2 flex space-x-2">
                        <button
                          v-for="status in ['pending', 'in_progress', 'completed', 'cancelled']"
                          :key="status"
                          @click="changeBookingStatus(selectedBooking, status)"
                          :class="[
                            'px-2 py-1 text-xs font-medium rounded-md',
                            selectedBooking.status === status 
                              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 border-2 border-primary-500'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          ]"
                        >
                          {{ status }}
                        </button>
                      </div>
                    </div>
                    
                    <div class="mt-6 flex justify-end">
                      <button
                        @click="showBookingDetail = false"
                        class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                      >
                        Close
                      </button>
                    </div>
                  </div>
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
    Calendar as CalendarIcon,
    Clock as ClockIcon,
    CheckCircle as CheckCircleIcon,
    XCircle as XCircleIcon,
    Search as SearchIcon,
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
  
  // Booking statistics
  const bookingStats = [
    {
      name: 'Total Bookings',
      value: '12,543',
      icon: CalendarIcon
    },
    {
      name: 'Pending',
      value: '124',
      icon: ClockIcon
    },
    {
      name: 'Completed',
      value: '10,987',
      icon: CheckCircleIcon
    },
    {
      name: 'Cancelled',
      value: '432',
      icon: XCircleIcon
    }
  ]
  
  // Bookings table
  const bookingHeaders = [
    'Booking ID',
    'Customer',
    'Driver',
    'Pickup',
    'Destination',
    'Status',
    'Amount'
  ]
  
  // Dummy bookings data
  const bookings = ref([
    {
      id: 'B-1001',
      customer: 'John Smith',
      driver: 'Mike Johnson',
      pickup: '123 Main St, New York',
      destination: '456 Park Ave, New York',
      status: 'completed',
      amount: '$25.00',
      date: '2024-03-01'
    },
    {
      id: 'B-1002',
      customer: 'Jane Doe',
      driver: 'Sarah Williams',
      pickup: '789 Oak Rd, Boston',
      destination: '321 Pine St, Boston',
      status: 'in_progress',
      amount: '$32.50',
      date: '2024-03-10'
    },
    {
      id: 'B-1003',
      customer: 'Bob Johnson',
      driver: 'Alex Brown',
      pickup: '159 Elm St, Chicago',
      destination: '753 Maple Ave, Chicago',
      status: 'pending',
      amount: '$18.75',
      date: '2024-03-12'
    },
    {
      id: 'B-1004',
      customer: 'Alice Williams',
      driver: 'Tom Wilson',
      pickup: '852 Cedar Ln, Miami',
      destination: '963 Palm Blvd, Miami',
      status: 'cancelled',
      amount: '$0.00',
      date: '2024-03-05'
    },
    {
      id: 'B-1005',
      customer: 'Charlie Brown',
      driver: 'Diana Prince',
      pickup: '741 Beach Rd, Los Angeles',
      destination: '852 Ocean Dr, Los Angeles',
      status: 'completed',
      amount: '$42.25',
      date: '2024-03-08'
    },
    {
      id: 'B-1006',
      customer: 'Diana Prince',
      driver: 'Bruce Wayne',
      pickup: '369 Mountain View, Denver',
      destination: '147 Valley Rd, Denver',
      status: 'completed',
      amount: '$35.50',
      date: '2024-03-09'
    },
    {
      id: 'B-1007',
      customer: 'Edward Norton',
      driver: 'Clark Kent',
      pickup: '258 River St, Seattle',
      destination: '369 Lake Ave, Seattle',
      status: 'pending',
      amount: '$28.75',
      date: '2024-03-15'
    }
  ])
  
  // Search and filters
  const searchQuery = ref('')
  const statusFilter = ref('all')
  const currentPage = ref(1)
  const itemsPerPage = 5
  
  // Booking detail modal
  const showBookingDetail = ref(false)
  const selectedBooking = ref(null)
  
  // Filtered bookings based on search and status
  const filteredBookings = computed(() => {
    let filtered = bookings.value
    
    // Apply status filter
    if (statusFilter.value !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter.value)
    }
    
    // Apply search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(booking => 
        booking.id.toLowerCase().includes(query) ||
        booking.customer.toLowerCase().includes(query) ||
        booking.driver.toLowerCase().includes(query) ||
        booking.pickup.toLowerCase().includes(query) ||
        booking.destination.toLowerCase().includes(query)
      )
    }
    
    // Apply pagination
    return filtered.slice(startIndex.value, endIndex.value)
  })
  
  // Pagination calculations
  const totalItems = computed(() => {
    let filtered = bookings.value
    
    if (statusFilter.value !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter.value)
    }
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(booking => 
        booking.id.toLowerCase().includes(query) ||
        booking.customer.toLowerCase().includes(query) ||
        booking.driver.toLowerCase().includes(query) ||
        booking.pickup.toLowerCase().includes(query) ||
        booking.destination.toLowerCase().includes(query)
      )
    }
    
    return filtered.length
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
  
  // Status styling
  const getStatusClass = (status) => {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }
    return classes[status] || ''
  }
  
  // Actions
  const viewBooking = (booking) => {
    selectedBooking.value = booking
    showBookingDetail.value = true
  }
  
  const updateBookingStatus = (booking) => {
    const statuses = ['pending', 'in_progress', 'completed', 'cancelled']
    const currentIndex = statuses.indexOf(booking.status)
    const nextIndex = (currentIndex + 1) % statuses.length
    booking.status = statuses[nextIndex]
  }
  
  const changeBookingStatus = (booking, status) => {
    booking.status = status
  }
  
  const exportBookings = () => {
    const headers = bookingHeaders.join(',')
    const rows = bookings.value.map(booking => 
      Object.values(booking).slice(0, 7).join(',')
    ).join('\n')
    
    const csv = `${headers}\n${rows}`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bookings.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }
  
  // Reset pagination when filters change
  watch([searchQuery, statusFilter], () => {
    currentPage.value = 1
  })

  definePageMeta({
      layout: 'dashboard'
  })
  </script>