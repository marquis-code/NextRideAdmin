<template>
<main>
    <div class="space-y-6">
<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
  <div
    v-for="stat in financeStats"
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


<div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-lg font-medium text-gray-900 dark:text-white">
      Revenue Overview
    </h2>
    <select
      v-model="chartPeriod"
      class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800"
    >
      <option value="week">Last 7 Days</option>
      <option value="month">Last 30 Days</option>
      <option value="year">Last 12 Months</option>
    </select>
  </div>
  <div class="h-80 w-full">
    <canvas ref="revenueChart"></canvas>
  </div>
</div>


<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
  <div class="p-6 border-b border-gray-200 dark:border-gray-700">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white">
        Recent Transactions
      </h2>
      
      <div class="flex flex-col md:flex-row gap-2">
        <div class="relative">
          <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search transactions..."
            class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <select
          v-model="typeFilter"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        
        <button
          @click="exportTransactions"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <DownloadIcon class="w-4 h-4 mr-2" />
          Export
        </button>
      </div>
    </div>
  </div>

  <!-- Transactions Table -->
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-900">
        <tr>
          <th
            v-for="header in transactionHeaders"
            :key="header"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        <tr
          v-for="transaction in filteredTransactions"
          :key="transaction.id"
          class="hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
            {{ transaction.id }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
            {{ transaction.date }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
            {{ transaction.description }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getTypeClass(transaction.type)"
            >
              {{ transaction.type }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium"
            :class="transaction.type === 'income' ? 'text-green-600' : 'text-red-600'"
          >
            {{ transaction.type === 'income' ? '+' : '-' }}{{ transaction.amount }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
            {{ transaction.method }}
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

</div>
</main>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import {
  DollarSign as RevenueIcon,
  CreditCard as PaymentIcon,
  TrendingUp as ProfitIcon,
  TrendingDown as ExpenseIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from 'lucide-vue-next'
import Chart from 'chart.js/auto'

// Finance statistics
const financeStats = [
  {
    name: 'Total Revenue',
    value: '$103,430',
    trend: 15,
    icon: RevenueIcon
  },
  {
    name: 'Total Payments',
    value: '5,430',
    trend: 8,
    icon: PaymentIcon
  },
  {
    name: 'Profit',
    value: '$43,242',
    trend: 12,
    icon: ProfitIcon
  },
  {
    name: 'Expenses',
    value: '$60,188',
    trend: -5,
    icon: ExpenseIcon
  }
]

// Chart data
const revenueChart = ref(null)
const chartPeriod = ref('month')
let chart = null

// Chart data by period
const chartData = {
  week: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    income: [1200, 1900, 1500, 2100, 2400, 3100, 2900],
    expenses: [800, 1100, 900, 1300, 1500, 1800, 1600]
  },
  month: {
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    income: Array.from({ length: 30 }, () => Math.floor(Math.random() * 3000) + 1000),
    expenses: Array.from({ length: 30 }, () => Math.floor(Math.random() * 2000) + 500)
  },
  year: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    income: [15000, 18000, 22000, 19000, 24000, 28000, 32000, 35000, 30000, 28000, 32000, 38000],
    expenses: [10000, 12000, 14000, 13000, 15000, 16000, 18000, 20000, 17000, 16000, 19000, 22000]
  }
}

// Transactions table
const transactionHeaders = [
  'Transaction ID',
  'Date',
  'Description',
  'Type',
  'Amount',
  'Payment Method'
]

// Dummy transactions data
const transactions = ref([
  {
    id: 'T-1001',
    date: '2024-03-15',
    description: 'Booking Payment - John Smith',
    type: 'income',
    amount: '$25.00',
    method: 'Credit Card'
  },
  {
    id: 'T-1002',
    date: '2024-03-14',
    description: 'Booking Payment - Jane Doe',
    type: 'income',
    amount: '$32.50',
    method: 'PayPal'
  },
  {
    id: 'T-1003',
    date: '2024-03-14',
    description: 'Vehicle Maintenance',
    type: 'expense',
    amount: '$150.00',
    method: 'Bank Transfer'
  },
  {
    id: 'T-1004',
    date: '2024-03-13',
    description: 'Booking Payment - Bob Johnson',
    type: 'income',
    amount: '$18.75',
    method: 'Credit Card'
  },
  {
    id: 'T-1005',
    date: '2024-03-12',
    description: 'Fuel Expense',
    type: 'expense',
    amount: '$85.50',
    method: 'Company Card'
  },
  {
    id: 'T-1006',
    date: '2024-03-12',
    description: 'Booking Payment - Alice Williams',
    type: 'income',
    amount: '$42.25',
    method: 'PayPal'
  },
  {
    id: 'T-1007',
    date: '2024-03-11',
    description: 'Driver Salary - Mike Johnson',
    type: 'expense',
    amount: '$450.00',
    method: 'Bank Transfer'
  },
  {
    id: 'T-1008',
    date: '2024-03-10',
    description: 'Booking Payment - Charlie Brown',
    type: 'income',
    amount: '$35.50',
    method: 'Credit Card'
  },
  {
    id: 'T-1009',
    date: '2024-03-10',
    description: 'Office Supplies',
    type: 'expense',
    amount: '$75.25',
    method: 'Company Card'
  },
  {
    id: 'T-1010',
    date: '2024-03-09',
    description: 'Booking Payment - Diana Prince',
    type: 'income',
    amount: '$28.75',
    method: 'PayPal'
  }
])

// Search and filters
const searchQuery = ref('')
const typeFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = 5

// Filtered transactions based on search and type
const filteredTransactions = computed(() => {
  let filtered = transactions.value
  
  // Apply type filter
  if (typeFilter.value !== 'all') {
    filtered = filtered.filter(transaction => transaction.type === typeFilter.value)
  }
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(transaction => 
      transaction.id.toLowerCase().includes(query) ||
      transaction.description.toLowerCase().includes(query) ||
      transaction.method.toLowerCase().includes(query)
    )
  }
  
  // Apply pagination
  return filtered.slice(startIndex.value, endIndex.value)
})

// Pagination calculations
const totalItems = computed(() => {
  let filtered = transactions.value
  
  if (typeFilter.value !== 'all') {
    filtered = filtered.filter(transaction => transaction.type === typeFilter.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(transaction => 
      transaction.id.toLowerCase().includes(query) ||
      transaction.description.toLowerCase().includes(query) ||
      transaction.method.toLowerCase().includes(query)
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

// Type styling
const getTypeClass = (type) => {
  const classes = {
    income: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    expense: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return classes[type] || ''
}

// Initialize chart
const initChart = () => {
  const ctx = revenueChart.value.getContext('2d')
  
  if (chart) {
    chart.destroy()
  }
  
  const data = chartData[chartPeriod.value]
  
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'Income',
          data: data.income,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Expenses',
          data: data.expenses,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#374151'
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#374151'
          }
        },
        y: {
          grid: {
            color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#374151',
            callback: function(value) {
              return '$' + value
            }
          }
        }
      }
    }
  })
}

// Export transactions
const exportTransactions = () => {
  const headers = transactionHeaders.join(',')
  const rows = transactions.value.map(transaction => 
    Object.values(transaction).join(',')
  ).join('\n')
  
  const csv = `${headers}\n${rows}`
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'transactions.csv'
  a.click()
  window.URL.revokeObjectURL(url)
}

// Reset pagination when filters change
watch([searchQuery, typeFilter], () => {
  currentPage.value = 1
})

// Update chart when period changes
watch(chartPeriod, () => {
  initChart()
})

// Initialize chart on component mount
onMounted(() => {
  initChart()
})

definePageMeta({
      layout: 'dashboard'
  })
</script>