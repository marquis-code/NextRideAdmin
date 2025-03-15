<template>
    <div class="space-y-6">
      <!-- Settings Navigation -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex overflow-x-auto">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-4 py-4 text-sm font-medium whitespace-nowrap"
              :class="[
                activeTab === tab.id
                  ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              <component :is="tab.icon" class="w-5 h-5 inline-block mr-2" />
              {{ tab.name }}
            </button>
          </nav>
        </div>
        
        <!-- General Settings -->
        <div v-if="activeTab === 'general'" class="p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6">
            General Settings
          </h2>
          
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company Name
              </label>
              <input
                v-model="generalSettings.companyName"
                type="text"
                class="w-full max-w-md rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Support Email
              </label>
              <input
                v-model="generalSettings.supportEmail"
                type="email"
                class="w-full max-w-md rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Phone
              </label>
              <input
                v-model="generalSettings.contactPhone"
                type="tel"
                class="w-full max-w-md rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Default Currency
              </label>
              <select
                v-model="generalSettings.currency"
                class="w-full max-w-md rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Timezone
              </label>
              <select
                v-model="generalSettings.timezone"
                class="w-full max-w-md rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
              </select>
            </div>
            
            <div class="flex items-center">
              <input
                id="darkMode"
                v-model="generalSettings.darkMode"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="darkMode" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Enable Dark Mode by Default
              </label>
            </div>
            
            <div>
              <button
                @click="saveGeneralSettings"
                class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
        
        <!-- Security Settings -->
        <div v-if="activeTab === 'security'" class="p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Security Settings
          </h2>
          
          <div class="space-y-6">
            <div>
              <h3 class="text-md font-medium text-gray-900 dark:text-white mb-4">
                Change Password
              </h3>
              
              <div class="space-y-4 max-w-md">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    v-model="securitySettings.currentPassword"
                    type="password"
                    class="w-full rounded-md p-3 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    v-model="securitySettings.newPassword"
                    type="password"
                    class="w-full rounded-md p-3 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    v-model="securitySettings.confirmPassword"
                    type="password"
                    class="w-full rounded-md p-3 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <button
                    @click="changePassword"
                    class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
            
            <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-md font-medium text-gray-900 dark:text-white mb-4">
                Two-Factor Authentication
              </h3>
              
              <div class="flex items-center justify-between max-w-md">
                <div>
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    {{ securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ securitySettings.twoFactorEnabled ? 'Two-factor authentication is currently enabled for your account.' : 'Enable two-factor authentication for additional security.' }}
                  </p>
                </div>
                <button
                  @click="toggleTwoFactor"
                  class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                >
                  {{ securitySettings.twoFactorEnabled ? 'Disable' : 'Enable' }}
                </button>
              </div>
            </div>
            
            <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-md font-medium text-gray-900 dark:text-white mb-4">
                Session Management
              </h3>
              
              <div class="space-y-4 max-w-md">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active Sessions
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      You currently have {{ securitySettings.activeSessions.length }} active sessions.
                    </p>
                  </div>
                  <button
                    @click="logoutAllSessions"
                    class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Logout All
                  </button>
                </div>
                
                <div class="space-y-2">
                  <div
                    v-for="(session, index) in securitySettings.activeSessions"
                    :key="index"
                    class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <div>
                      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {{ session.device }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ session.location }} · {{ session.lastActive }}
                      </p>
                    </div>
                    <button
                      v-if="!session.current"
                      @click="logoutSession(index)"
                      class="text-sm text-red-600 hover:text-red-800"
                    >
                      Logout
                    </button>
                    <span
                      v-else
                      class="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full"
                    >
                      Current
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Notifications Settings -->
        <div v-if="activeTab === 'notifications'" class="p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Notification Settings
          </h2>
          
          <div class="space-y-6 max-w-2xl">
            <div
              v-for="(category, index) in notificationSettings.categories"
              :key="index"
              class="pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0"
            >
              <h3 class="text-md font-medium text-gray-900 dark:text-white mb-4">
                {{ category.name }}
              </h3>
              
              <div class="space-y-4">
                <div
                  v-for="(notification, nIndex) in category.notifications"
                  :key="nIndex"
                  class="flex items-center justify-between"
                >
                  <div>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ notification.name }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {{ notification.description }}
                    </p>
                  </div>
                  <div class="flex items-center space-x-4">
                    <div class="flex items-center">
                      <input
                        :id="`email-${index}-${nIndex}`"
                        v-model="notification.email"
                        type="checkbox"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label :for="`email-${index}-${nIndex}`" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                    </div>
                    <div class="flex items-center">
                      <input
                        :id="`push-${index}-${nIndex}`"
                        v-model="notification.push"
                        type="checkbox"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label :for="`push-${index}-${nIndex}`" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Push
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <button
                @click="saveNotificationSettings"
                class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
        
        <!-- API Settings -->
        <div v-if="activeTab === 'api'" class="p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6">
            API Settings
          </h2>
          
          <div class="space-y-6">
            <div>
              <h3 class="text-md font-medium text-gray-900 dark:text-white mb-4">
                API Keys
              </h3>
              
              <div class="space-y-4 max-w-2xl">
                <div
                  v-for="(key, index) in apiSettings.apiKeys"
                  :key="index"
                  class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md"
                >
                  <div>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ key.name }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Created: {{ key.created }} · Last used: {{ key.lastUsed }}
                    </p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="showApiKey(key)"
                      class="px-3 py-1 text-xs font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900"
                    >
                      Show
                    </button>
                    <button
                      @click="revokeApiKey(index)"
                      class="px-3 py-1 text-xs font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
                
                <button
                  @click="generateApiKey"
                  class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                >
                  Generate New API Key
                </button>
              </div>
            </div>
            
            <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-md font-medium text-gray-900 dark:text-white mb-4">
                Webhooks
              </h3>
              
              <div class="space-y-4 max-w-2xl">
                <div
                  v-for="(webhook, index) in apiSettings.webhooks"
                  :key="index"
                  class="p-4 bg-gray-50 dark:bg-gray-700 rounded-md"
                >
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ webhook.name }}
                    </p>
                    <div class="flex items-center space-x-2">
                      <button
                        @click="editWebhook(webhook)"
                        class="px-3 py-1 text-xs font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900"
                      >
                        Edit
                      </button>
                      <button
                        @click="deleteWebhook(index)"
                        class="px-3 py-1 text-xs font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    URL: {{ webhook.url }}
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="event in webhook.events"
                      :key="event"
                      class="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-300 rounded-full"
                    >
                      {{ event }}
                    </span>
                  </div>
                </div>
                
                <button
                  @click="addWebhook"
                  class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                >
                  Add Webhook
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Role Management -->
        <div v-if="activeTab === 'roles'" class="p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Role Management
          </h2>
          
          <div class="space-y-6">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Users
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr
                    v-for="role in roleSettings.roles"
                    :key="role.id"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {{ role.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ role.description }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ role.users }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        @click="editRole(role)"
                        class="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        v-if="role.id !== 'admin'"
                        @click="deleteRole(role.id)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <button
              @click="addRole"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
            >
              Add Role
            </button>
          </div>
        </div>
      </div>
      
      <!-- Role Edit Modal -->
      <TransitionRoot appear :show="showRoleModal" as="template">
        <Dialog as="div" @close="showRoleModal = false" class="relative z-50">
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
                    {{ editingRole ? 'Edit Role' : 'Add New Role' }}
                  </DialogTitle>
  
                  <form @submit.prevent="saveRole" class="mt-4 space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Role Name
                      </label>
                      <input
                        v-model="roleForm.name"
                        type="text"
                        class="mt-1 block w-full p-3 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
  
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                      </label>
                      <input
                        v-model="roleForm.description"
                        type="text"
                        class="mt-1 block w-full p-3 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
  
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Permissions
                      </label>
                      <div class="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-md">
                        <div
                          v-for="permission in availablePermissions"
                          :key="permission.id"
                          class="flex items-center"
                        >
                          <input
                            :id="`permission-${permission.id}`"
                            v-model="roleForm.permissions"
                            :value="permission.id"
                            type="checkbox"
                            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label :for="`permission-${permission.id}`" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            {{ permission.name }}
                          </label>
                        </div>
                      </div>
                    </div>
  
                    <div class="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        @click="showRoleModal = false"
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
      
      <!-- Webhook Modal -->
      <TransitionRoot appear :show="showWebhookModal" as="template">
        <Dialog as="div" @close="showWebhookModal = false" class="relative z-50">
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
                    {{ editingWebhook ? 'Edit Webhook' : 'Add New Webhook' }}
                  </DialogTitle>
  
                  <form @submit.prevent="saveWebhook" class="mt-4 space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Webhook Name
                      </label>
                      <input
                        v-model="webhookForm.name"
                        type="text"
                        class="mt-1 block w-full p-3 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
  
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        URL
                      </label>
                      <input
                        v-model="webhookForm.url"
                        type="url"
                        class="mt-1 block w-full p-3 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
  
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Events
                      </label>
                      <div class="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-md">
                        <div
                          v-for="event in availableEvents"
                          :key="event"
                          class="flex items-center"
                        >
                          <input
                            :id="`event-${event}`"
                            v-model="webhookForm.events"
                            :value="event"
                            type="checkbox"
                            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label :for="`event-${event}`" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            {{ event }}
                          </label>
                        </div>
                      </div>
                    </div>
  
                    <div class="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        @click="showWebhookModal = false"
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
//   import { useToast } from '@/composables/useToast'
  import {
    Settings as SettingsIcon,
    Shield as SecurityIcon,
    Bell as NotificationsIcon,
    Code as ApiIcon,
    Users as RolesIcon
  } from 'lucide-vue-next'
  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle
  } from '@headlessui/vue'
  
//   const { toast } = useToast()
  
  // Tab navigation
  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'security', name: 'Security', icon: SecurityIcon },
    { id: 'notifications', name: 'Notifications', icon: NotificationsIcon },
    { id: 'api', name: 'API', icon: ApiIcon },
    { id: 'roles', name: 'Roles', icon: RolesIcon }
  ]
  const activeTab = ref('general')
  
  // General settings
  const generalSettings = ref({
    companyName: 'NextRide Mobility',
    supportEmail: 'support@nextride.com',
    contactPhone: '+1 (555) 123-4567',
    currency: 'USD',
    timezone: 'UTC',
    darkMode: false
  })
  
  const saveGeneralSettings = () => {
    // API call would go here
    toast({
      title: 'Settings Saved',
      description: 'Your general settings have been updated successfully.',
      type: 'success'
    })
  }
  
  // Security settings
  const securitySettings = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    activeSessions: [
      {
        device: 'Chrome on Windows',
        location: 'New York, USA',
        lastActive: 'Just now',
        current: true
      },
      {
        device: 'Safari on iPhone',
        location: 'Boston, USA',
        lastActive: '2 hours ago',
        current: false
      },
      {
        device: 'Firefox on MacOS',
        location: 'San Francisco, USA',
        lastActive: '1 day ago',
        current: false
      }
    ]
  })
  
  const changePassword = () => {
    if (securitySettings.value.newPassword !== securitySettings.value.confirmPassword) {
      toast({
        title: 'Password Error',
        description: 'New password and confirmation do not match.',
        type: 'error'
      })
      return
    }
    
    // API call would go here
    toast({
      title: 'Password Updated',
      description: 'Your password has been changed successfully.',
      type: 'success'
    })
    
    securitySettings.value.currentPassword = ''
    securitySettings.value.newPassword = ''
    securitySettings.value.confirmPassword = ''
  }
  
  const toggleTwoFactor = () => {
    securitySettings.value.twoFactorEnabled = !securitySettings.value.twoFactorEnabled
    
    toast({
      title: securitySettings.value.twoFactorEnabled ? 'Two-Factor Enabled' : 'Two-Factor Disabled',
      description: securitySettings.value.twoFactorEnabled 
        ? 'Two-factor authentication has been enabled for your account.' 
        : 'Two-factor authentication has been disabled for your account.',
      type: 'success'
    })
  }
  
  const logoutSession = (index) => {
    securitySettings.value.activeSessions.splice(index, 1)
    
    toast({
      title: 'Session Terminated',
      description: 'The selected session has been logged out.',
      type: 'success'
    })
  }
  
  const logoutAllSessions = () => {
    const currentSession = securitySettings.value.activeSessions.find(s => s.current)
    securitySettings.value.activeSessions = currentSession ? [currentSession] : []
    
    toast({
      title: 'All Sessions Terminated',
      description: 'All other sessions have been logged out.',
      type: 'success'
    })
  }
  
  // Notification settings
  const notificationSettings = ref({
    categories: [
      {
        name: 'Bookings',
        notifications: [
          {
            name: 'New Booking',
            description: 'When a new booking is created',
            email: true,
            push: true
          },
          {
            name: 'Booking Cancelled',
            description: 'When a booking is cancelled',
            email: true,
            push: false
          },
          {
            name: 'Booking Completed',
            description: 'When a booking is completed',
            email: true,
            push: false
          }
        ]
      },
      {
        name: 'Fleet',
        notifications: [
          {
            name: 'Vehicle Maintenance',
            description: 'When a vehicle requires maintenance',
            email: true,
            push: true
          },
          {
            name: 'Vehicle Status Change',
            description: 'When a vehicle status changes',
            email: false,
            push: true
          }
        ]
      },
      {
        name: 'System',
        notifications: [
          {
            name: 'Security Alerts',
            description: 'Important security notifications',
            email: true,
            push: true
          },
          {
            name: 'System Updates',
            description: 'When system updates are available',
            email: true,
            push: false
          }
        ]
      }
    ]
  })
  
  const saveNotificationSettings = () => {
    // API call would go here
    toast({
      title: 'Notification Preferences Saved',
      description: 'Your notification preferences have been updated.',
      type: 'success'
    })
  }
  
  // API settings
  const apiSettings = ref({
    apiKeys: [
      {
        name: 'Production API Key',
        key: 'nr_prod_a1b2c3d4e5f6g7h8i9j0',
        created: '2023-12-01',
        lastUsed: '2024-03-15'
      },
      {
        name: 'Development API Key',
        key: 'nr_dev_z9y8x7w6v5u4t3s2r1q0',
        created: '2024-01-15',
        lastUsed: '2024-03-14'
      }
    ],
    webhooks: [
      {
        name: 'Booking Notifications',
        url: 'https://example.com/webhooks/bookings',
        events: ['booking.created', 'booking.updated', 'booking.cancelled']
      },
      {
        name: 'Payment Notifications',
        url: 'https://example.com/webhooks/payments',
        events: ['payment.succeeded', 'payment.failed']
      }
    ]
  })
  
  const showApiKey = (key) => {
    toast({
      title: 'API Key',
      description: key.key,
      type: 'info',
      duration: 10000
    })
  }
  
  const generateApiKey = () => {
    const newKey = {
      name: 'New API Key',
      key: 'nr_' + Math.random().toString(36).substring(2, 15),
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never'
    }
    
    apiSettings.value.apiKeys.push(newKey)
    
    toast({
      title: 'API Key Generated',
      description: 'Your new API key has been created: ' + newKey.key,
      type: 'success',
      duration: 10000
    })
  }
  
  const revokeApiKey = (index) => {
    apiSettings.value.apiKeys.splice(index, 1)
    
    toast({
      title: 'API Key Revoked',
      description: 'The API key has been revoked and is no longer valid.',
      type: 'success'
    })
  }
  
  // Webhook management
  const showWebhookModal = ref(false)
  const editingWebhook = ref(null)
  const webhookForm = ref({
    name: '',
    url: '',
    events: []
  })
  
  const availableEvents = [
    'booking.created',
    'booking.updated',
    'booking.cancelled',
    'payment.succeeded',
    'payment.failed',
    'vehicle.maintenance',
    'vehicle.status_changed',
    'user.created',
    'user.updated'
  ]
  
  const addWebhook = () => {
    editingWebhook.value = null
    webhookForm.value = {
      name: '',
      url: '',
      events: []
    }
    showWebhookModal.value = true
  }
  
  const editWebhook = (webhook) => {
    editingWebhook.value = webhook
    webhookForm.value = { ...webhook }
    showWebhookModal.value = true
  }
  
  const saveWebhook = () => {
    if (!webhookForm.value.name || !webhookForm.value.url || webhookForm.value.events.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields and select at least one event.',
        type: 'error'
      })
      return
    }
    
    if (editingWebhook.value) {
      const index = apiSettings.value.webhooks.findIndex(w => w === editingWebhook.value)
      apiSettings.value.webhooks[index] = { ...webhookForm.value }
    } else {
      apiSettings.value.webhooks.push({ ...webhookForm.value })
    }
    
    showWebhookModal.value = false
    
    toast({
      title: editingWebhook.value ? 'Webhook Updated' : 'Webhook Added',
      description: editingWebhook.value 
        ? 'Your webhook has been updated successfully.' 
        : 'Your webhook has been added successfully.',
      type: 'success'
    })
  }
  
  const deleteWebhook = (index) => {
    apiSettings.value.webhooks.splice(index, 1)
    
    toast({
      title: 'Webhook Deleted',
      description: 'The webhook has been deleted successfully.',
      type: 'success'
    })
  }
  
  // Role management
  const roleSettings = ref({
    roles: [
      {
        id: 'admin',
        name: 'Administrator',
        description: 'Full access to all features',
        users: 3,
        permissions: ['all']
      },
      {
        id: 'manager',
        name: 'Manager',
        description: 'Can manage bookings and fleet',
        users: 8,
        permissions: ['bookings.read', 'bookings.write', 'fleet.read', 'fleet.write', 'users.read']
      },
      {
        id: 'support',
        name: 'Support Agent',
        description: 'Can view bookings and handle support tickets',
        users: 12,
        permissions: ['bookings.read', 'support.read', 'support.write']
      },
      {
        id: 'driver',
        name: 'Driver',
        description: 'Can view assigned bookings',
        users: 45,
        permissions: ['bookings.read.own']
      }
    ]
  })
  
  const showRoleModal = ref(false)
  const editingRole = ref(null)
  const roleForm = ref({
    name: '',
    description: '',
    permissions: []
  })
  
  const availablePermissions = [
    { id: 'bookings.read', name: 'View Bookings' },
    { id: 'bookings.write', name: 'Manage Bookings' },
    { id: 'bookings.read.own', name: 'View Own Bookings' },
    { id: 'fleet.read', name: 'View Fleet' },
    { id: 'fleet.write', name: 'Manage Fleet' },
    { id: 'users.read', name: 'View Users' },
    { id: 'users.write', name: 'Manage Users' },
    { id: 'finance.read', name: 'View Financial Data' },
    { id: 'finance.write', name: 'Manage Financial Data' },
    { id: 'support.read', name: 'View Support Tickets' },
    { id: 'support.write', name: 'Manage Support Tickets' },
    { id: 'settings.read', name: 'View Settings' },
    { id: 'settings.write', name: 'Manage Settings' },
    { id: 'all', name: 'Full Access (All Permissions)' }
  ]
  
  const addRole = () => {
    editingRole.value = null
    roleForm.value = {
      name: '',
      description: '',
      permissions: []
    }
    showRoleModal.value = true
  }
  
  const editRole = (role) => {
    editingRole.value = role
    roleForm.value = {
      name: role.name,
      description: role.description,
      permissions: [...role.permissions]
    }
    showRoleModal.value = true
  }
  
  const saveRole = () => {
    if (!roleForm.value.name || !roleForm.value.description || roleForm.value.permissions.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields and select at least one permission.',
        type: 'error'
      })
      return
    }
    
    if (editingRole.value) {
      const index = roleSettings.value.roles.findIndex(r => r.id === editingRole.value.id)
      roleSettings.value.roles[index] = {
        ...editingRole.value,
        name: roleForm.value.name,
        description: roleForm.value.description,
        permissions: roleForm.value.permissions
      }
    } else {
      const newId = roleForm.value.name.toLowerCase().replace(/\s+/g, '_')
      roleSettings.value.roles.push({
        id: newId,
        name: roleForm.value.name,
        description: roleForm.value.description,
        permissions: roleForm.value.permissions,
        users: 0
      })
    }
    
    showRoleModal.value = false
    
    toast({
      title: editingRole.value ? 'Role Updated' : 'Role Added',
      description: editingRole.value 
        ? 'The role has been updated successfully.' 
        : 'The role has been added successfully.',
      type: 'success'
    })
  }
  
  const deleteRole = (roleId) => {
    const index = roleSettings.value.roles.findIndex(r => r.id === roleId)
    if (index !== -1) {
      roleSettings.value.roles.splice(index, 1)
      
      toast({
        title: 'Role Deleted',
        description: 'The role has been deleted successfully.',
        type: 'success'
      })
    }
  }

  definePageMeta({
      layout: 'dashboard',
      middleware: 'auth'
  })
  </script>