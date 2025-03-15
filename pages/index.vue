<template>
  <div class="space-y-6">
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stat in stats"
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
        <div class="mt-4">
          <span
            :class="[
              stat.trend > 0 ? 'text-green-600' : 'text-red-600',
              'text-sm font-medium'
            ]"
          >
            {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
          </span>
          <span class="text-sm text-gray-600 dark:text-gray-400 ml-2">vs last month</span>
        </div>
      </div>
    </div>

    <!-- Recent Bookings -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            Recent Bookings
          </h2>
          <button
            @click="exportBookings"
            class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <DownloadIcon class="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>
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
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="booking in recentBookings"
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
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Users as UsersIcon,
  Car as CarIcon,
  DollarSign as RevenueIcon,
  Star as RatingIcon,
  Download as DownloadIcon
} from 'lucide-vue-next'

// Stats data
const stats = [
  {
    name: 'Total Users',
    value: '24,531',
    trend: 12,
    icon: UsersIcon
  },
  {
    name: 'Active Vehicles',
    value: '432',
    trend: 8,
    icon: CarIcon
  },
  {
    name: 'Revenue',
    value: '$103,430',
    trend: 15,
    icon: RevenueIcon
  },
  {
    name: 'Avg. Rating',
    value: '4.8',
    trend: 2,
    icon: RatingIcon
  }
]

// Bookings table
const bookingHeaders = [
  'Booking ID',
  'Customer',
  'Pickup',
  'Destination',
  'Status',
  'Amount'
]

const recentBookings = [
  {
    id: 'B-1234',
    customer: 'Alice Johnson',
    pickup: '123 Main St',
    destination: '456 Park Ave',
    status: 'completed',
    amount: '$25.00'
  },
  {
    id: 'B-1235',
    customer: 'Bob Smith',
    pickup: '789 Oak Rd',
    destination: '321 Pine St',
    status: 'in_progress',
    amount: '$32.50'
  },
  {
    id: 'B-1236',
    customer: 'Carol White',
    pickup: '159 Elm St',
    destination: '753 Maple Ave',
    status: 'pending',
    amount: '$18.75'
  }
]

// Status styling
const getStatusClass = (status) => {
  const classes = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return classes[status] || ''
}

// Export functionality
const exportBookings = () => {
  const headers = bookingHeaders.join(',')
  const rows = recentBookings.map(booking => 
    Object.values(booking).join(',')
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

definePageMeta({
      layout: 'dashboard'
  })
</script>