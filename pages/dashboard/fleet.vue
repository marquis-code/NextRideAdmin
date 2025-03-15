<template>
    <div class="space-y-6">
      <!-- Fleet Overview -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Vehicles
            </h3>
            <p class="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
              {{ fleetStats.totalVehicles }}
            </p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Active Vehicles
            </h3>
            <p class="mt-2 text-3xl font-semibold text-green-600">
              {{ fleetStats.activeVehicles }}
            </p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Maintenance
            </h3>
            <p class="mt-2 text-3xl font-semibold text-yellow-600">
              {{ fleetStats.inMaintenance }}
            </p>
          </div>
        </div>
      </div>
  
      <!-- Fleet Management -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">
              Fleet Management
            </h2>
            <div class="flex space-x-2">
              <button
                @click="showAddVehicle = true"
                class="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <PlusIcon class="w-4 h-4 mr-2" />
                Add Vehicle
              </button>
              <button
                @click="exportFleet"
                class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <DownloadIcon class="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
  
        <!-- Fleet Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th
                  v-for="header in fleetHeaders"
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
                v-for="vehicle in vehicles"
                :key="vehicle.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ vehicle.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ vehicle.type }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ vehicle.model }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ vehicle.driver }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getStatusClass(vehicle.status)"
                  >
                    {{ vehicle.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ vehicle.lastMaintenance }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="editVehicle(vehicle)"
                    class="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="updateStatus(vehicle)"
                    class="text-gray-600 hover:text-gray-900"
                  >
                    Update Status
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Add/Edit Vehicle Modal -->
      <TransitionRoot appear :show="showAddVehicle" as="template">
        <Dialog as="div" @close="showAddVehicle = false" class="relative z-50">
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
                    {{ editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle' }}
                  </DialogTitle>
  
                  <form @submit.prevent="saveVehicle" class="mt-4 space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Vehicle Type
                      </label>
                      <select
                        v-model="vehicleForm.type"
                        class="mt-1 block w-full p-3 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      >
                        <option value="sedan">Sedan</option>
                        <option value="suv">SUV</option>
                        <option value="van">Van</option>
                      </select>
                    </div>
  
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Model
                      </label>
                      <input
                        v-model="vehicleForm.model"
                        type="text"
                        class="mt-1 block w-full p-3 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      />
                    </div>
  
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Driver
                      </label>
                      <input
                        v-model="vehicleForm.driver"
                        type="text"
                        class="mt-1 block w-full p-3 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      />
                    </div>
  
                    <div class="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        @click="showAddVehicle = false"
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
  import { ref } from 'vue'
  import {
    Plus as PlusIcon,
    Download as DownloadIcon
  } from 'lucide-vue-next'
  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle
  } from '@headlessui/vue'
  
  // Fleet statistics
  const fleetStats = ref({
    totalVehicles: 432,
    activeVehicles: 389,
    inMaintenance: 43
  })
  
  // Fleet table
  const fleetHeaders = [
    'Vehicle ID',
    'Type',
    'Model',
    'Driver',
    'Status',
    'Last Maintenance'
  ]
  
  const vehicles = ref([
    {
      id: 'V-1234',
      type: 'Sedan',
      model: 'Toyota Camry',
      driver: 'John Smith',
      status: 'active',
      lastMaintenance: '2024-03-01'
    },
    {
      id: 'V-1235',
      type: 'SUV',
      model: 'Honda CR-V',
      driver: 'Jane Doe',
      status: 'maintenance',
      lastMaintenance: '2024-02-15'
    },
    {
      id: 'V-1236',
      type: 'Van',
      model: 'Ford Transit',
      driver: 'Mike Johnson',
      status: 'inactive',
      lastMaintenance: '2024-03-10'
    }
  ])
  
  // Vehicle form
  const showAddVehicle = ref(false)
  const editingVehicle = ref(null)
  const vehicleForm = ref({
    type: 'sedan',
    model: '',
    driver: ''
  })
  
  // Status styling
  const getStatusClass = (status) => {
    const classes = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }
    return classes[status] || ''
  }
  
  // Actions
  const editVehicle = (vehicle) => {
    editingVehicle.value = vehicle
    vehicleForm.value = { ...vehicle }
    showAddVehicle.value = true
  }
  
  const saveVehicle = () => {
    if (editingVehicle.value) {
      const index = vehicles.value.findIndex(v => v.id === editingVehicle.value.id)
      vehicles.value[index] = { ...editingVehicle.value, ...vehicleForm.value }
    } else {
      vehicles.value.push({
        id: `V-${Math.floor(Math.random() * 1000)}`,
        ...vehicleForm.value,
        status: 'active',
        lastMaintenance: new Date().toISOString().split('T')[0]
      })
    }
    
    showAddVehicle.value = false
    editingVehicle.value = null
    vehicleForm.value = { type: 'sedan', model: '', driver: '' }
  }
  
  const updateStatus = (vehicle) => {
    const statuses = ['active', 'maintenance', 'inactive']
    const currentIndex = statuses.indexOf(vehicle.status)
    const nextIndex = (currentIndex + 1) % statuses.length
    vehicle.status = statuses[nextIndex]
  }
  
  const exportFleet = () => {
    const headers = fleetHeaders.join(',')
    const rows = vehicles.value.map(vehicle => 
      Object.values(vehicle).join(',')
    ).join('\n')
    
    const csv = `${headers}\n${rows}`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'fleet.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  definePageMeta({
      layout: 'dashboard',
       middleware: 'auth'
  })
  </script>