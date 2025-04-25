<template>
  <div class="space-y-6">
    <!-- Dashboard Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
      <button
        @click="showCreateSessionModal = true"
        class="btn-primary flex items-center space-x-2"
      >
        <PlusIcon class="h-5 w-5" />
        <span>Create Session</span>
      </button>
    </div>

    <!-- Dashboard Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900">Total Sessions</h3>
        <p class="text-3xl font-bold text-indigo-600">{{ totalSessions }}</p>
      </div>
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900">Total Bookings</h3>
        <p class="text-3xl font-bold text-emerald-600">{{ totalBookings }}</p>
      </div>
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900">Active Members</h3>
        <p class="text-3xl font-bold text-violet-600">{{ activeMembers }}</p>
      </div>
    </div>

    <!-- Session Management -->
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 class="text-xl font-medium text-gray-900">Session Management</h2>
        <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search sessions..."
            class="form-input w-full sm:w-64"
          />
          <select v-model="filterStatus" class="form-input w-full sm:w-40">
            <option value="all">All Sessions</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      <!-- Sessions Table -->
      <div class="overflow-x-auto bg-white rounded-lg shadow">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading" class="text-center">
              <td colspan="6" class="px-6 py-4">
                <div class="flex justify-center items-center">
                  <svg class="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span class="ml-2">Loading sessions...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredSessions.length === 0" class="text-center">
              <td colspan="6" class="px-6 py-4 text-gray-500">No sessions found</td>
            </tr>
            <tr v-for="session in filteredSessions" 
                :key="session.id"
                class="hover:bg-gray-50 transition-colors duration-200">
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="font-medium text-gray-900">{{ session.title }}</span>
                  <span class="text-sm text-gray-500">{{ session.description }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ formatDate(session.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ formatTime(session.start_time) }} - {{ formatTime(session.end_time) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ session.capacity }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getBookingStatusClass(session)">
                  {{ getBookingCount(session) }}/{{ session.capacity }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex space-x-3">
                  <button
                    @click="editSession(session)"
                    class="text-indigo-600 hover:text-indigo-900 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDeleteSession(session)"
                    class="text-red-600 hover:text-red-900 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Session Modal -->
    <Modal v-model="isSessionModalOpen">
      <template #header>
        <h3 class="text-lg font-medium text-gray-900">
          {{ showEditSessionModal ? 'Edit Session' : 'Create New Session' }}
        </h3>
      </template>
      <template #body>
        <form @submit.prevent="handleSessionSubmit" class="space-y-4">
          <div>
            <label for="title" class="form-label">Title</label>
            <input
              type="text"
              id="title"
              v-model="sessionForm.title"
              required
              class="form-input"
              placeholder="Enter session title"
            />
          </div>
          <div>
            <label for="date" class="form-label">Date</label>
            <input
              type="date"
              id="date"
              v-model="sessionForm.date"
              required
              class="form-input"
              :min="minDate"
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="start_time" class="form-label">Start Time</label>
              <input
                type="time"
                id="start_time"
                v-model="sessionForm.start_time"
                required
                class="form-input"
              />
            </div>
            <div>
              <label for="end_time" class="form-label">End Time</label>
              <input
                type="time"
                id="end_time"
                v-model="sessionForm.end_time"
                required
                class="form-input"
              />
            </div>
          </div>
          <div>
            <label for="capacity" class="form-label">Capacity</label>
            <input
              type="number"
              id="capacity"
              v-model="sessionForm.capacity"
              required
              min="1"
              class="form-input"
              placeholder="Enter maximum participants"
            />
          </div>
          <div>
            <label for="description" class="form-label">Description</label>
            <textarea
              id="description"
              v-model="sessionForm.description"
              rows="3"
              class="form-input"
              placeholder="Enter session description"
            ></textarea>
          </div>
        </form>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="closeSessionModal"
            class="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="handleSessionSubmit"
            :disabled="isSubmitting"
            class="btn-primary flex items-center"
          >
            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ showEditSessionModal ? 'Update Session' : 'Create Session' }}
          </button>
        </div>
      </template>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal v-model="showDeleteModal">
      <template #header>
        <h3 class="text-lg font-medium text-red-600">Delete Session</h3>
      </template>
      <template #body>
        <p class="text-gray-600">
          Are you sure you want to delete this session? This action cannot be undone.
        </p>
        <div class="mt-4">
          <label class="inline-flex items-center">
            <input
              type="checkbox"
              v-model="deleteOptions.notifyMembers"
              class="form-checkbox"
            />
            <span class="ml-2">Send cancellation notices to booked members</span>
          </label>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="deleteSession"
            :disabled="isDeleting"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
          >
            <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Delete Session
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/solid'
import Modal from './Modal.vue'
import { useToast } from '../composables/useToast'
import { useSessionStore } from '../stores/sessionStore'
import { supabase } from '../supabase'

// State
const sessionStore = useSessionStore()
const sessions = computed(() => sessionStore.sessions)
const loading = computed(() => sessionStore.loading)
const searchQuery = ref('')
const filterStatus = ref('all')
const showCreateSessionModal = ref(false)
const showEditSessionModal = ref(false)
const showDeleteModal = ref(false)
const selectedSession = ref(null)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const deleteOptions = ref({
  notifyMembers: true
})

const sessionForm = ref({
  title: '',
  date: '',
  start_time: '',
  end_time: '',
  capacity: 1,
  description: '',
  created_by: ''
})

// Computed
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const totalSessions = computed(() => sessions.value.length)
const totalBookings = computed(() => 
  sessions.value.reduce((acc, session) => {
    const bookings = session.appointments?.[0]?.count || 0
    return acc + bookings
  }, 0)
)
const activeMembers = ref(0)

// Filtered Sessions
const filteredSessions = computed(() => {
  let filtered = [...sessions.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(session => 
      session.title.toLowerCase().includes(query) ||
      session.description?.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  const now = new Date()
  if (filterStatus.value === 'upcoming') {
    filtered = filtered.filter(session => new Date(session.date) > now)
  } else if (filterStatus.value === 'past') {
    filtered = filtered.filter(session => new Date(session.date) < now)
  }

  return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

// Add this computed property for modal visibility
const isSessionModalOpen = computed({
  get: () => showCreateSessionModal.value || showEditSessionModal.value,
  set: (value) => {
    if (!value) {
      closeSessionModal()
    }
  }
})

// Methods
const handleSessionSubmit = async () => {
  try {
    isSubmitting.value = true
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Validate form data
    if (!sessionForm.value.title?.trim()) {
      throw new Error('Please enter a session title')
    }
    if (!sessionForm.value.date) {
      throw new Error('Please select a date')
    }
    if (!sessionForm.value.start_time || !sessionForm.value.end_time) {
      throw new Error('Please select both start and end times')
    }
    if (!sessionForm.value.capacity || sessionForm.value.capacity < 1) {
      throw new Error('Please enter a valid capacity (minimum 1)')
    }

    // Validate time
    if (sessionForm.value.end_time <= sessionForm.value.start_time) {
      throw new Error('End time must be after start time')
    }

    // Validate date is not in the past
    const sessionDate = new Date(sessionForm.value.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (sessionDate < today) {
      throw new Error('Cannot create sessions for past dates')
    }

    const sessionData = {
      ...sessionForm.value,
      created_by: user.id
    }

    if (showEditSessionModal.value && selectedSession.value) {
      await sessionStore.updateSession(selectedSession.value.id, sessionData)
      useToast().success('Session updated successfully')
    } else {
      await sessionStore.createSession(sessionData)
      useToast().success('Session created successfully')
    }
    
    closeSessionModal()
    await sessionStore.fetchSessions() // Refresh the sessions list
  } catch (error: any) {
    useToast().error(error.message)
  } finally {
    isSubmitting.value = false
  }
}

const editSession = (session) => {
  selectedSession.value = session
  sessionForm.value = { ...session }
  showEditSessionModal.value = true
}

const confirmDeleteSession = (session) => {
  selectedSession.value = session
  showDeleteModal.value = true
}

const deleteSession = async () => {
  try {
    isDeleting.value = true
    await sessionStore.deleteSession(selectedSession.value.id)
    
    if (deleteOptions.value.notifyMembers) {
      // Here you would implement notification logic
      console.log('Sending notifications to members...')
    }
    
    useToast().success('Session deleted successfully')
    showDeleteModal.value = false
  } catch (error: any) {
    useToast().error(error.message)
  } finally {
    isDeleting.value = false
  }
}

const closeSessionModal = () => {
  showCreateSessionModal.value = false
  showEditSessionModal.value = false
  selectedSession.value = null
  sessionForm.value = {
    title: '',
    date: '',
    start_time: '',
    end_time: '',
    capacity: 1,
    description: '',
    created_by: ''
  }
}

const fetchActiveMembers = async () => {
  try {
    const { count, error } = await supabase
      .from('appointments')
      .select('user_id', { count: 'distinct', head: true })
    
    if (error) throw error
    activeMembers.value = count
  } catch (error) {
    console.error('Error fetching active members:', error)
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (time: string) => {
  return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getBookingCount = (session) => {
  return session.appointments?.[0]?.count || 0
}

const getBookingStatusClass = (session) => {
  const bookingCount = getBookingCount(session)
  const percentage = (bookingCount / session.capacity) * 100

  if (percentage >= 100) return 'text-red-600 font-medium'
  if (percentage >= 75) return 'text-yellow-600 font-medium'
  return 'text-green-600 font-medium'
}

// Lifecycle
onMounted(async () => {
  await sessionStore.fetchSessions()
  await fetchActiveMembers()
})
</script>

<style scoped>
.form-checkbox {
  @apply rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50;
}

.btn-primary {
  @apply px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200;
}
</style>
