<template>
    <div class="space-y-6">
      <!-- Date Range Selector -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            Analytics Dashboard
          </h2>
          
          <div class="flex flex-col md:flex-row gap-2">
            <select
              v-model="dateRange"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last 12 Months</option>
            </select>
            
            <button
              @click="exportAnalytics"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <DownloadIcon class="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>
  
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          v-for="metric in keyMetrics"
          :key="metric.name"
          class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
        >
          <div class="flex items-center">
            <component
              :is="metric.icon"
              class="w-8 h-8 text-primary-500"
            />
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ metric.name }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ metric.value }}
              </p>
            </div>
          </div>
          <div class="mt-4">
            <span
              :class="[
                metric.trend > 0 ? 'text-green-600' : 'text-red-600',
                'text-sm font-medium'
              ]"
            >
              {{ metric.trend > 0 ? '+' : '' }}{{ metric.trend }}%
            </span>
            <span class="text-sm text-gray-600 dark:text-gray-400 ml-2">vs previous period</span>
          </div>
        </div>
      </div>
  
      <!-- Charts Row 1 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Bookings Chart -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Bookings Overview
          </h3>
          <div class="h-80 w-full">
            <canvas ref="bookingsChart"></canvas>
          </div>
        </div>
        
        <!-- Revenue Chart -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Revenue Breakdown
          </h3>
          <div class="h-80 w-full">
            <canvas ref="revenueChart"></canvas>
          </div>
        </div>
      </div>
  
      <!-- Charts Row 2 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- User Growth Chart -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            User Growth
          </h3>
          <div class="h-80 w-full">
            <canvas ref="userGrowthChart"></canvas>
          </div>
        </div>
        
        <!-- Vehicle Utilization Chart -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Vehicle Utilization
          </h3>
          <div class="h-80 w-full">
            <canvas ref="vehicleUtilizationChart"></canvas>
          </div>
        </div>
      </div>
  
      <!-- Top Performers -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Top Performing Drivers
        </h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th
                  v-for="header in driverHeaders"
                  :key="header"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="driver in topDrivers"
                :key="driver.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ driver.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ driver.trips }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ driver.revenue }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ driver.rating }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      class="bg-primary-600 h-2.5 rounded-full"
                      :style="{ width: `${driver.completionRate}%` }"
                    ></div>
                  </div>
                  <span class="text-xs mt-1 block">{{ driver.completionRate }}%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, watch } from 'vue'
  import {
    TrendingUp as GrowthIcon,
    Users as UsersIcon,
    Car as VehicleIcon,
    DollarSign as RevenueIcon,
    Download as DownloadIcon
  } from 'lucide-vue-next'
  import Chart from 'chart.js/auto'
  
  // Date range selector
  const dateRange = ref('month')
  
  // Key metrics
  const keyMetrics = [
    {
      name: 'Total Bookings',
      value: '12,543',
      trend: 15,
      icon: GrowthIcon
    },
    {
      name: 'Active Users',
      value: '18,975',
      trend: 8,
      icon: UsersIcon
    },
    {
      name: 'Active Vehicles',
      value: '389',
      trend: 5,
      icon: VehicleIcon
    },
    {
      name: 'Total Revenue',
      value: '$103,430',
      trend: 12,
      icon: RevenueIcon
    }
  ]
  
  // Chart references
  const bookingsChart = ref(null)
  const revenueChart = ref(null)
  const userGrowthChart = ref(null)
  const vehicleUtilizationChart = ref(null)
  
  // Chart instances
  let bookingsChartInstance = null
  let revenueChartInstance = null
  let userGrowthChartInstance = null
  let vehicleUtilizationChartInstance = null
  
  // Chart data by period
  const chartData = {
    today: {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      bookings: Array.from({ length: 24 }, () => Math.floor(Math.random() * 50) + 10),
      revenue: {
        labels: ['Sedan', 'SUV', 'Van'],
        data: [4500, 3200, 2100]
      },
      userGrowth: Array.from({ length: 24 }, (_, i) => 10000 + (i * 50) + Math.floor(Math.random() * 100)),
      vehicleUtilization: {
        labels: ['Active', 'Idle', 'Maintenance'],
        data: [65, 25, 10]
      }
    },
    week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      bookings: [320, 350, 400, 450, 520, 650, 580],
      revenue: {
        labels: ['Sedan', 'SUV', 'Van'],
        data: [15000, 12000, 8000]
      },
      userGrowth: [10000, 10500, 11000, 11200, 11500, 11800, 12000],
      vehicleUtilization: {
        labels: ['Active', 'Idle', 'Maintenance'],
        data: [70, 20, 10]
      }
    },
    month: {
      labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
      bookings: Array.from({ length: 30 }, () => Math.floor(Math.random() * 300) + 300),
      revenue: {
        labels: ['Sedan', 'SUV', 'Van'],
        data: [45000, 35000, 23000]
      },
      userGrowth: Array.from({ length: 30 }, (_, i) => 10000 + (i * 500) + Math.floor(Math.random() * 200)),
      vehicleUtilization: {
        labels: ['Active', 'Idle', 'Maintenance'],
        data: [75, 15, 10]
      }
    },
    year: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      bookings: [3500, 4200, 4800, 5100, 5400, 6000, 6500, 6800, 6200, 5800, 6300, 7000],
      revenue: {
        labels: ['Sedan', 'SUV', 'Van'],
        data: [520000, 420000, 280000]
      },
      userGrowth: [10000, 12000, 14000, 15500, 17000, 18500, 20000, 21500, 22500, 23000, 24000, 25000],
      vehicleUtilization: {
        labels: ['Active', 'Idle', 'Maintenance'],
        data: [80, 10, 10]
      }
    }
  }
  
  // Top drivers table
  const driverHeaders = [
    'Driver Name',
    'Total Trips',
    'Revenue Generated',
    'Average Rating',
    'Completion Rate'
  ]
  
  const topDrivers = [
    {
      id: 1,
      name: 'John Smith',
      trips: 245,
      revenue: '$5,430',
      rating: '4.9/5',
      completionRate: 98
    },
    {
      id: 2,
      name: 'Jane Doe',
      trips: 230,
      revenue: '$5,120',
      rating: '4.8/5',
      completionRate: 97
    },
    {
      id: 3,
      name: 'Mike Johnson',
      trips: 215,
      revenue: '$4,850',
      rating: '4.9/5',
      completionRate: 99
    },
    {
      id: 4,
      name: 'Sarah Williams',
      trips: 205,
      revenue: '$4,620',
      rating: '4.7/5',
      completionRate: 95
    },
    {
      id: 5,
      name: 'Alex Brown',
      trips: 190,
      revenue: '$4,280',
      rating: '4.8/5',
      completionRate: 96
    }
  ]
  
  // Initialize charts
  const initCharts = () => {
    const data = chartData[dateRange.value]
    const isDark = document.documentElement.classList.contains('dark')
    const textColor = isDark ? '#f3f4f6' : '#374151'
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
    
    // Bookings Chart
    if (bookingsChartInstance) {
      bookingsChartInstance.destroy()
    }
    
    const bookingsCtx = bookingsChart.value.getContext('2d')
    bookingsChartInstance = new Chart(bookingsCtx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Bookings',
            data: data.bookings,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              color: gridColor
            },
            ticks: {
              color: textColor,
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 10
            }
          },
          y: {
            grid: {
              color: gridColor
            },
            ticks: {
              color: textColor
            },
            beginAtZero: true
          }
        }
      }
    })
    
    // Revenue Chart
    if (revenueChartInstance) {
      revenueChartInstance.destroy()
    }
    
    const revenueCtx = revenueChart.value.getContext('2d')
    revenueChartInstance = new Chart(revenueCtx, {
      type: 'doughnut',
      data: {
        labels: data.revenue.labels,
        datasets: [
          {
            data: data.revenue.data,
            backgroundColor: [
              'rgb(59, 130, 246)',
              'rgb(16, 185, 129)',
              'rgb(249, 115, 22)'
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor
            }
          }
        }
      }
    })
    
    // User Growth Chart
    if (userGrowthChartInstance) {
      userGrowthChartInstance.destroy()
    }
    
    const userGrowthCtx = userGrowthChart.value.getContext('2d')
    userGrowthChartInstance = new Chart(userGrowthCtx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Users',
            data: data.userGrowth,
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
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
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              color: gridColor
            },
            ticks: {
              color: textColor,
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 10
            }
          },
          y: {
            grid: {
              color: gridColor
            },
            ticks: {
              color: textColor
            }
          }
        }
      }
    })
    
    // Vehicle Utilization Chart
    if (vehicleUtilizationChartInstance) {
      vehicleUtilizationChartInstance.destroy()
    }
    
    const vehicleUtilizationCtx = vehicleUtilizationChart.value.getContext('2d')
    vehicleUtilizationChartInstance = new Chart(vehicleUtilizationCtx, {
      type: 'pie',
      data: {
        labels: data.vehicleUtilization.labels,
        datasets: [
          {
            data: data.vehicleUtilization.data,
            backgroundColor: [
              'rgb(16, 185, 129)',
              'rgb(249, 115, 22)',
              'rgb(239, 68, 68)'
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor
            }
          }
        }
      }
    })
  }
  
  // Export analytics data
  const exportAnalytics = () => {
    const data = chartData[dateRange.value]
    
    // Create CSV content
    let csv = 'Nextride Analytics Report\n'
    csv += `Date Range: ${dateRange.value}\n\n`
    
    // Key Metrics
    csv += 'Key Metrics\n'
    keyMetrics.forEach(metric => {
      csv += `${metric.name},${metric.value},${metric.trend}%\n`
    })
    csv += '\n'
    
    // Bookings Data
    csv += 'Bookings Data\n'
    csv += `Period,Bookings\n`
    data.labels.forEach((label, index) => {
      csv += `${label},${data.bookings[index]}\n`
    })
    csv += '\n'
    
    // Revenue Data
    csv += 'Revenue Data\n'
    csv += `Vehicle Type,Revenue\n`
    data.revenue.labels.forEach((label, index) => {
      csv += `${label},${data.revenue.data[index]}\n`
    })
    csv += '\n'
    
    // Top Drivers
    csv += 'Top Performing Drivers\n'
    csv += `${driverHeaders.join(',')}\n`
    topDrivers.forEach(driver => {
      csv += `${driver.name},${driver.trips},${driver.revenue},${driver.rating},${driver.completionRate}%\n`
    })
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nextride_analytics_${dateRange.value}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }
  
  // Update charts when date range changes
  watch(dateRange, () => {
    initCharts()
  })
  
  // Initialize charts on component mount
  onMounted(() => {
    initCharts()
  })

  definePageMeta({
      layout: 'dashboard',
       middleware: 'auth'
  })
  </script>