<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from './supabase'
import AuthPage from './components/AuthPage.vue'
import SessionList from './components/SessionList.vue'
import UserAppointments from './components/UserAppointments.vue'
import TheHeader from './components/TheHeader.vue'
import AdminDashboard from './components/AdminDashboard.vue'

// Types based on database schema
interface User {
  id: string
  email: string
  full_name: string
  role: 'member' | 'admin'
  created_at: string
}

interface Session {
  id: string
  title: string
  date: string
  start_time: string
  end_time: string
  capacity: number
  created_by: string
  created_at: string
  appointments_count?: number
}

interface Appointment {
  id: string
  user_id: string
  session_id: string
  notes: string | null
  created_at: string
}

const session = ref<any>(null)
const currentUser = ref<User | null>(null)
const activeTab = ref('sessions')

// Theme configuration
const theme = {
  primary: {
    light: '#4F46E5',
    dark: '#4338CA',
    gradient: 'from-indigo-600 to-violet-600'
  },
  secondary: {
    light: '#10B981',
    dark: '#059669',
    gradient: 'from-emerald-500 to-teal-600'
  },
  accent: {
    light: '#8B5CF6',
    dark: '#7C3AED',
    gradient: 'from-violet-500 to-purple-600'
  }
}

const userEmail = computed(() => currentUser.value?.email || '')
const userName = computed(() => currentUser.value?.full_name || '')
const isAdmin = computed(() => currentUser.value?.role === 'admin')

// Fetch current user data
const fetchUserData = async () => {
  if (!session.value?.user?.id) return

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.value.user.id)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    return
  }

  currentUser.value = user
}

onMounted(async () => {
  // Get initial session
  const { data: { session: initialSession } } = await supabase.auth.getSession()
  session.value = initialSession

  if (initialSession) {
    await fetchUserData()
  }

  // Listen for auth changes
  supabase.auth.onAuthStateChange(async (_event, currentSession) => {
    session.value = currentSession
    if (currentSession) {
      await fetchUserData()
    } else {
      currentUser.value = null
    }
  })
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="relative flex flex-col min-h-screen">
      <template v-if="session">
        <!-- Header -->
        <TheHeader
          :active-tab="activeTab"
          :user-email="userEmail"
          :user-name="userName"
          :is-admin="isAdmin"
          @change-tab="activeTab = $event"
          class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30"
        />

        <!-- Main Content Area -->
        <main class="flex-grow">
          <div class="responsive-container py-4 sm:py-6 lg:py-8">
            <!-- Welcome Section -->
            <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Welcome, {{ userName }}</h1>
                <p class="text-sm text-gray-600">{{ userEmail }}</p>
              </div>
              <!-- Quick Actions -->
              <div v-if="isAdmin" class="w-full sm:w-auto">
                <button 
                  @click="activeTab = 'admin'"
                  class="btn-primary w-full sm:w-auto"
                >
                  Manage Sessions
                </button>
              </div>
            </div>

            <!-- Content Container -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <!-- Content Header -->
              <div class="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-medium text-gray-900">
                  {{ activeTab === 'admin' ? 'Session Management' : 
                     activeTab === 'sessions' ? 'Available Sessions' : 
                     'My Appointments' }}
                </h2>
              </div>

              <!-- Main Content -->
              <div class="responsive-padding">
                <Transition
                  enter-active-class="transition-opacity duration-200 ease-out"
                  enter-from-class="opacity-0"
                  enter-to-class="opacity-100"
                  leave-active-class="transition-opacity duration-150 ease-in"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <AdminDashboard 
                    v-if="isAdmin && activeTab === 'admin'"
                    :current-user="currentUser"
                  />
                  <SessionList 
                    v-else-if="activeTab === 'sessions'" 
                    :theme="theme"
                    :is-admin="isAdmin"
                    :current-user="currentUser"
                  />
                  <UserAppointments 
                    v-else 
                    :theme="theme"
                    :current-user="currentUser"
                  />
                </Transition>
              </div>
            </div>
          </div>
        </main>

        <!-- Toast Notifications -->
        <div aria-live="assertive" class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50">
          <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
            <!-- Toast messages will be dynamically inserted here -->
          </div>
        </div>
      </template>

      <!-- Auth Page -->
      <AuthPage v-else :theme="theme" class="min-h-screen" />
    </div>
  </div>
</template>

<style>
@import './style.css';

/* Layout Utilities */
.max-w-7xl {
  max-width: 80rem;
}

/* Clean Card Style */
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden;
}

/* Table Styles */
.table-container {
  @apply -mx-4 sm:mx-0 overflow-x-auto;
}

.data-table {
  @apply min-w-full divide-y divide-gray-200;
}

.table-header {
  @apply bg-gray-50;
}

.table-header th {
  @apply px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap;
}

.table-body {
  @apply bg-white divide-y divide-gray-200;
}

.table-row {
  @apply hover:bg-gray-50;
}

.table-cell {
  @apply px-4 sm:px-6 py-4 text-sm text-gray-900;
}

/* Form Styles */
.form-group {
  @apply space-y-1 mb-4;
}

.form-input {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors duration-200;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

/* Badge Styles */
.badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.badge-success {
  @apply bg-green-100 text-green-800;
}

.badge-warning {
  @apply bg-yellow-100 text-yellow-800;
}

.badge-error {
  @apply bg-red-100 text-red-800;
}
</style>
