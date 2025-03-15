<template>
    <div class="space-y-6">
      <!-- Support Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          v-for="stat in supportStats"
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
  
      <!-- Support Tickets -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">
              Support Tickets
            </h2>
            
            <div class="flex flex-col md:flex-row gap-2">
              <div class="relative">
                <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search tickets..."
                  class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <select
                v-model="statusFilter"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              
              <button
                @click="exportTickets"
                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <DownloadIcon class="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
  
        <!-- Tickets Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th
                  v-for="header in ticketHeaders"
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
                v-for="ticket in filteredTickets"
                :key="ticket.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ ticket.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ ticket.subject }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ ticket.customer }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getPriorityClass(ticket.priority)"
                  >
                    {{ ticket.priority }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getStatusClass(ticket.status)"
                  >
                    {{ ticket.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ ticket.createdAt }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="viewTicket(ticket)"
                    class="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    View
                  </button>
                  <button
                    @click="updateTicketStatus(ticket)"
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
  
      <!-- Ticket Detail Modal -->
      <TransitionRoot appear :show="showTicketDetail" as="template">
        <Dialog as="div" @close="showTicketDetail = false" class="relative z-50">
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
                <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    class="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    Ticket Details
                  </DialogTitle>
  
                  <div v-if="selectedTicket" class="mt-4">
                    <div class="flex justify-between items-start">
                      <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Ticket ID</p>
                        <p class="text-sm text-gray-900 dark:text-white">{{ selectedTicket.id }}</p>
                      </div>
                      <div>
                        <span
                          class="px-2 py-1 text-xs font-medium rounded-full"
                          :class="getStatusClass(selectedTicket.status)"
                        >
                          {{ selectedTicket.status }}
                        </span>
                      </div>
                    </div>
                    
                    <div class="mt-4">
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Subject</p>
                      <p class="text-sm text-gray-900 dark:text-white">{{ selectedTicket.subject }}</p>
                    </div>
                    
                    <div class="mt-4">
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Customer</p>
                      <p class="text-sm text-gray-900 dark:text-white">{{ selectedTicket.customer }}</p>
                    </div>
                    
                    <div class="mt-4">
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Priority</p>
                      <span
                        class="px-2 py-1 text-xs font-medium rounded-full"
                        :class="getPriorityClass(selectedTicket.priority)"
                      >
                        {{ selectedTicket.priority }}
                      </span>
                    </div>
                    
                    <div class="mt-4">
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</p>
                      <p class="text-sm text-gray-900 dark:text-white">{{ selectedTicket.createdAt }}</p>
                    </div>
                    
                    <div class="mt-4">
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">{{ selectedTicket.description }}</p>
                    </div>
                    
                    <!-- Messages -->
                    <div class="mt-6">
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Messages</p>
                      <div class="space-y-4">
                        <div
                          v-for="(message, index) in selectedTicket.messages"
                          :key="index"
                          :class="[
                            'p-3 rounded-lg',
                            message.sender === 'customer' 
                              ? 'bg-gray-100 dark:bg-gray-700' 
                              : 'bg-primary-50 dark:bg-primary-900'
                          ]"
                        >
                          <div class="flex justify-between items-center mb-1">
                            <p class="text-xs font-medium text-gray-900 dark:text-white">
                              {{ message.sender === 'customer' ? selectedTicket.customer : 'Support Agent' }}
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">{{ message.time }}</p>
                          </div>
                          <p class="text-sm text-gray-900 dark:text-white">{{ message.text }}</p>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Reply Form -->
                    <div class="mt-6">
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Reply</p>
                      <textarea
                        v-model="replyText"
                        rows="3"
                        class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        placeholder="Type your reply here..."
                      ></textarea>
                    </div>
                    
                    <!-- Update Status -->
                    <div class="mt-4">
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Update Status</p>
                      <div class="flex space-x-2">
                        <button
                          v-for="status in ['open', 'in_progress', 'resolved', 'closed']"
                          :key="status"
                          @click="changeTicketStatus(selectedTicket, status)"
                          :class="[
                            'px-2 py-1 text-xs font-medium rounded-md',
                            selectedTicket.status === status 
                              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 border-2 border-primary-500'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          ]"
                        >
                          {{ status }}
                        </button>
                      </div>
                    </div>
                    
                    <div class="mt-6 flex justify-end space-x-3">
                      <button
                        @click="showTicketDetail = false"
                        class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        @click="sendReply"
                        class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                      >
                        Send Reply
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
  import { ref, reactive, computed, watch } from 'vue'
  import {
    MessageSquare as TicketIcon,
    Clock as PendingIcon,
    CheckCircle as ResolvedIcon,
    AlertCircle as UrgentIcon,
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
  
  // Support statistics
  const supportStats = [
    {
      name: 'Total Tickets',
      value: '1,243',
      icon: TicketIcon
    },
    {
      name: 'Open Tickets',
      value: '87',
      icon: PendingIcon
    },
    {
      name: 'Resolved Today',
      value: '32',
      icon: ResolvedIcon
    },
    {
      name: 'Urgent Tickets',
      value: '15',
      icon: UrgentIcon
    }
  ]
  
  // Tickets table
  const ticketHeaders = [
    'Ticket ID',
    'Subject',
    'Customer',
    'Priority',
    'Status',
    'Created At'
  ]
  
  // Dummy tickets data
  const tickets = ref([
    {
      id: 'T-1001',
      subject: 'App not working properly',
      customer: 'John Smith',
      priority: 'high',
      status: 'open',
      createdAt: '2024-03-15',
      description: 'I am having issues with the app. It keeps crashing when I try to book a ride.',
      messages: [
        {
          sender: 'customer',
          text: 'I am having issues with the app. It keeps crashing when I try to book a ride.',
          time: '2024-03-15 10:30 AM'
        }
      ]
    },
    {
      id: 'T-1002',
      subject: 'Driver was late',
      customer: 'Jane Doe',
      priority: 'medium',
      status: 'in_progress',
      createdAt: '2024-03-14',
      description: 'My driver was 20 minutes late for pickup. This caused me to be late for my meeting.',
      messages: [
        {
          sender: 'customer',
          text: 'My driver was 20 minutes late for pickup. This caused me to be late for my meeting.',
          time: '2024-03-14 09:15 AM'
        },
        {
          sender: 'agent',
          text: 'I apologize for the inconvenience. We are looking into this issue and will get back to you shortly.',
          time: '2024-03-14 09:30 AM'
        },
        {
          sender: 'customer',
          text: 'Thank you for your prompt response. I appreciate it.',
          time: '2024-03-14 09:45 AM'
        }
      ]
    },
    {
      id: 'T-1003',
      subject: 'Overcharged for ride',
      customer: 'Bob Johnson',
      priority: 'high',
      status: 'open',
      createdAt: '2024-03-14',
      description: 'I was charged $35 for a ride that was estimated to cost $25. Please refund the difference.',
      messages: [
        {
          sender: 'customer',
          text: 'I was charged $35 for a ride that was estimated to cost $25. Please refund the difference.',
          time: '2024-03-14 02:30 PM'
        }
      ]
    },
    {
      id: 'T-1004',
      subject: 'Driver was rude',
      customer: 'Alice Williams',
      priority: 'medium',
      status: 'resolved',
      createdAt: '2024-03-13',
      description: 'The driver was very rude and unprofessional during my ride.',
      messages: [
        {
          sender: 'customer',
          text: 'The driver was very rude and unprofessional during my ride.',
          time: '2024-03-13 11:00 AM'
        },
        {
          sender: 'agent',
          text: 'I apologize for your experience. We take these matters seriously. Could you provide more details about the incident?',
          time: '2024-03-13 11:15 AM'
        },
        {
          sender: 'customer',
          text: 'The driver was talking on the phone the entire ride and ignored my requests to turn down the music.',
          time: '2024-03-13 11:30 AM'
        },
        {
          sender: 'agent',
          text: 'Thank you for the details. We have spoken with the driver and taken appropriate action. We apologize for the inconvenience and have added a $10 credit to your account.',
          time: '2024-03-13 02:00 PM'
        },
        {
          sender: 'customer',
          text: 'Thank you for addressing this issue promptly.',
          time: '2024-03-13 02:15 PM'
        }
      ]
    },
    {
      id: 'T-1005',
      subject: 'Payment issue',
      customer: 'Charlie Brown',
      priority: 'low',
      status: 'closed',
      createdAt: '2024-03-12',
      description: 'I am having trouble adding my new credit card to my account.',
      messages: [
        {
          sender: 'customer',
          text: 'I am having trouble adding my new credit card to my account.',
          time: '2024-03-12 03:45 PM'
        },
        {
          sender: 'agent',
          text: 'I\'m sorry to hear that. Could you please try clearing your browser cache and cookies, then try again?',
          time: '2024-03-12 04:00 PM'
        },
        {
          sender: 'customer',
          text: 'That worked! Thank you for your help.',
          time: '2024-03-12 04:15 PM'
        },
        {
          sender: 'agent',
          text: 'Great! I\'m glad that resolved the issue. Please let us know if you need any further assistance.',
          time: '2024-03-12 04:20 PM'
        }
      ]
    },
    {
      id: 'T-1006',
      subject: 'Feature request',
      customer: 'Diana Prince',
      priority: 'low',
      status: 'in_progress',
      createdAt: '2024-03-11',
      description: 'It would be great if the app could remember my frequent destinations.',
      messages: [
        {
          sender: 'customer',
          text: 'It would be great if the app could remember my frequent destinations.',
          time: '2024-03-11 10:00 AM'
        },
        {
          sender: 'agent',
          text: 'Thank you for your suggestion! We are actually working on a similar feature that will be released in our next update.',
          time: '2024-03-11 10:30 AM'
        },
        {
          sender: 'customer',
          text: 'That\'s great to hear! Looking forward to the update.',
          time: '2024-03-11 10:45 AM'
        }
      ]
    },
    {
      id: 'T-1007',
      subject: 'Wrong destination',
      customer: 'Edward Norton',
      priority: 'high',
      status: 'resolved',
      createdAt: '2024-03-10',
      description: 'The driver took me to the wrong destination and I had to pay for another ride.',
      messages: [
        {
          sender: 'customer',
          text: 'The driver took me to the wrong destination and I had to pay for another ride.',
          time: '2024-03-10 09:00 AM'
        },
        {
          sender: 'agent',
          text: 'I apologize for this experience. Could you provide the details of both rides so we can investigate?',
          time: '2024-03-10 09:15 AM'
        },
        {
          sender: 'customer',
          text: 'The first ride was from my home to 123 Main St, but the driver took me to 123 Main Ave instead. I then had to book another ride to the correct location.',
          time: '2024-03-10 09:30 AM'
        },
        {
          sender: 'agent',
          text: 'Thank you for the details. We have refunded both rides and added a $15 credit to your account for the inconvenience.',
          time: '2024-03-10 10:00 AM'
        },
        {
          sender: 'customer',
          text: 'Thank you for resolving this issue.',
          time: '2024-03-10 10:15 AM'
        }
      ]
    }
  ])
  
  // Search and filters
  const searchQuery = ref('')
  const statusFilter = ref('all')
  const currentPage = ref(1)
  const itemsPerPage = 5
  
  // Ticket detail modal
  const showTicketDetail = ref(false)
  const selectedTicket = ref(null)
  const replyText = ref('')
  
  // Filtered tickets based on search and status
  const filteredTickets = computed(() => {
    let filtered = tickets.value
    
    // Apply status filter
    if (statusFilter.value !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter.value)
    }
    
    // Apply search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(ticket => 
        ticket.id.toLowerCase().includes(query) ||
        ticket.subject.toLowerCase().includes(query) ||
        ticket.customer.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query)
      )
    }
    
    // Apply pagination
    return filtered.slice(startIndex.value, endIndex.value)
  })
  
  // Pagination calculations
  const totalItems = computed(() => {
    let filtered = tickets.value
    
    if (statusFilter.value !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter.value)
    }
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(ticket => 
        ticket.id.toLowerCase().includes(query) ||
        ticket.subject.toLowerCase().includes(query) ||
        ticket.customer.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query)
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
  
  // Status and priority styling
  const getStatusClass = (status) => {
    const classes = {
      open: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
    return classes[status] || ''
  }
  
  const getPriorityClass = (priority) => {
    const classes = {
      low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }
    return classes[priority] || ''
  }
  
  // Actions
  const viewTicket = (ticket) => {
    selectedTicket.value = ticket
    showTicketDetail.value = true
    replyText.value = ''
  }
  
  const updateTicketStatus = (ticket) => {
    const statuses = ['open', 'in_progress', 'resolved', 'closed']
    const currentIndex = statuses.indexOf(ticket.status)
    const nextIndex = (currentIndex + 1) % statuses.length
    ticket.status = statuses[nextIndex]
  }
  
  const changeTicketStatus = (ticket, status) => {
    ticket.status = status
  }
  
  const sendReply = () => {
    if (!replyText.value.trim()) return
    
    selectedTicket.value.messages.push({
      sender: 'agent',
      text: replyText.value,
      time: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    })
    
    // If ticket is open, change to in_progress
    if (selectedTicket.value.status === 'open') {
      selectedTicket.value.status = 'in_progress'
    }
    
    replyText.value = ''
  }
  
  const exportTickets = () => {
    const headers = ticketHeaders.join(',')
    const rows = tickets.value.map(ticket => 
      [ticket.id, ticket.subject, ticket.customer, ticket.priority, ticket.status, ticket.createdAt].join(',')
    ).join('\n')
    
    const csv = `${headers}\n${rows}`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tickets.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }
  
  // Reset pagination when filters change
  watch([searchQuery, statusFilter], () => {
    currentPage.value = 1
  })

  definePageMeta({
      layout: 'dashboard',
       middleware: 'auth'
  })
  </script>