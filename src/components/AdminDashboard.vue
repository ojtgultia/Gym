<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Dashboard Header -->
    <div class="mb-10">
      <h1 class="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Session Management Dashboard</h1>
      <p class="text-gray-600">Manage your gym sessions and track member activity</p>
    </div>

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div class="card p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
        <h3 class="text-sm font-medium text-gray-500 mb-1">Total Sessions</h3>
        <div class="flex items-center">
          <span class="text-3xl font-bold text-gray-900">{{ totalSessions }}</span>
          <div class="ml-3 p-2 bg-indigo-100 rounded-lg">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          </div>
        </div>
      </div>
      <div class="card p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
        <h3 class="text-sm font-medium text-gray-500 mb-1">Total Bookings</h3>
        <div class="flex items-center">
          <span class="text-3xl font-bold text-gray-900">{{ totalBookings }}</span>
          <div class="ml-3 p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          </div>
        </div>
      </div>
      <div class="card p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
        <h3 class="text-sm font-medium text-gray-500 mb-1">Active Members</h3>
        <div class="flex items-center">
          <span class="text-3xl font-bold text-gray-900">{{ activeMembers }}</span>
          <div class="ml-3 p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          </div>
        </div>
      </div>
      <div class="card p-6 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100">
        <h3 class="text-sm font-medium text-gray-500 mb-1">Today's Sessions</h3>
        <div class="flex items-center">
          <span class="text-3xl font-bold text-gray-900">{{ todaySessions }}</span>
          <div class="ml-3 p-2 bg-amber-100 rounded-lg">
            <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Session Management Section -->
    <div class="card p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4 sm:mb-0">Session Management</h2>
        <button
          @click="showCreateSessionModal = true"
          class="btn-primary inline-flex items-center group"
        >
          <svg class="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New Session
        </button>
      </div>

      <!-- Filters -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search sessions..."
            class="form-input"
          />
        </div>
        <div>
          <select v-model="filterStatus" class="form-input">
            <option value="all">All Sessions</option>
            <option value="upcoming">Upcoming</option>
            <option value="today">Today</option>
            <option value="past">Past</option>
          </select>
        </div>
        <div>
          <select v-model="sortBy" class="form-input">
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="capacity">Sort by Capacity</option>
            <option value="bookings">Sort by Bookings</option>
          </select>
        </div>
      </div>

      <!-- Sessions Table -->
      <div class="overflow-x-auto rounded-xl border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked Members</th>
              <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading" class="animate-pulse">
              <td colspan="7" class="px-6 py-4">
                <div class="flex items-center justify-center">
                  <svg class="w-6 h-6 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredSessions.length === 0">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                No sessions found
              </td>
            </tr>
            <tr v-for="session in filteredSessions" :key="session.id" class="hover:bg-gray-50 transition-colors duration-150">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ session.title }}</div>
                <div class="text-sm text-gray-500 truncate max-w-xs">{{ session.description }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ formatDate(session.date) }}</div>
                <div class="text-sm text-gray-500">
                  {{ formatTime(session.start_time) }} - {{ formatTime(session.end_time) }}
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ session.capacity }}</td>
              <td class="px-6 py-4">
                <span :class="getSessionStatusBadge(session)">
                  {{ getSessionStatus(session) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="getBookingStatusClass(session)">
                  {{ getBookingCount(session) }} / {{ session.capacity }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div v-if="session.bookings && session.bookings.length > 0" class="space-y-1">
                  <div v-for="booking in session.bookings" :key="booking.id" class="text-sm text-gray-900">
                    {{ booking.user.full_name }}
                    <span class="text-gray-500 text-xs">({{ booking.user.email }})</span>
                  </div>
                </div>
                <div v-else class="text-sm text-gray-500">
                  No bookings yet
                </div>
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium space-x-2">
                <button
                  @click="editSession(session)"
                  class="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  @click="confirmDeleteSession(session)"
                  class="text-red-600 hover:text-red-900 transition-colors duration-200"
                >
                  Delete
                </button>
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
              :class="['form-input', { error: errors.title }]"
              placeholder="Enter session title"
            />
            <p v-if="errors.title" class="form-error">{{ errors.title }}</p>
          </div>
          <div>
            <label for="date" class="form-label">Date</label>
            <input
              type="date"
              id="date"
              v-model="sessionForm.date"
              required
              :class="['form-input', { error: errors.date }]"
              :min="minDate"
            />
            <p v-if="errors.date" class="form-error">{{ errors.date }}</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="start_time" class="form-label">Start Time</label>
              <input
                type="time"
                id="start_time"
                v-model="sessionForm.start_time"
                required
                :class="['form-input', { error: errors.start_time }]"
              />
              <p v-if="errors.start_time" class="form-error">{{ errors.start_time }}</p>
            </div>
            <div>
              <label for="end_time" class="form-label">End Time</label>
              <input
                type="time"
                id="end_time"
                v-model="sessionForm.end_time"
                required
                :class="['form-input', { error: errors.end_time }]"
              />
              <p v-if="errors.end_time" class="form-error">{{ errors.end_time }}</p>
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
              :class="['form-input', { error: errors.capacity }]"
              placeholder="Enter maximum participants"
            />
            <p v-if="errors.capacity" class="form-error">{{ errors.capacity }}</p>
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
            class="px-4 py-2 border rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
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
            class="px-4 py-2 border rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            @click="deleteSession"
            :disabled="isDeleting"
            class="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 flex items-center transition-colors duration-200"
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
import { ref, onMounted, computed, watch } from 'vue'
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
const sortBy = ref('date')
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

// Add errors ref
const errors = ref({
  title: '',
  date: '',
  start_time: '',
  end_time: '',
  capacity: ''
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
const todaySessions = computed(() => {
  const today = new Date().toDateString()
  return sessions.value.filter(session => 
    new Date(session.date).toDateString() === today
  ).length
})

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
  switch (filterStatus.value) {
    case 'upcoming':
      filtered = filtered.filter(session => new Date(session.date) > now)
      break
    case 'past':
      filtered = filtered.filter(session => new Date(session.date) < now)
      break
    case 'today':
      const today = now.toDateString()
      filtered = filtered.filter(session => 
        new Date(session.date).toDateString() === today
      )
      break
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'capacity':
        return b.capacity - a.capacity
      case 'bookings':
        const bookingsA = a.appointments?.[0]?.count || 0
        const bookingsB = b.appointments?.[0]?.count || 0
        return bookingsB - bookingsA
      default: // date
        return new Date(a.date).getTime() - new Date(b.date).getTime()
    }
  })

  return filtered
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
    if (!user) {
      useToast().error('You must be logged in to manage sessions')
      return
    }

    // Reset errors
    Object.keys(errors.value).forEach(key => {
      errors.value[key] = ''
    })

    // Validate form data
    if (!sessionForm.value.title?.trim()) {
      errors.value.title = 'Please enter a session title to continue'
      useToast().error('Title is required to create a session')
      return
    }
    if (!sessionForm.value.date) {
      errors.value.date = 'Please select a date for the session'
      useToast().error('Date must be selected to create a session')
      return
    }
    if (!sessionForm.value.start_time) {
      errors.value.start_time = 'Please select a start time for the session'
      useToast().error('Start time must be selected to create a session')
      return
    }
    if (!sessionForm.value.end_time) {
      errors.value.end_time = 'Please select an end time for the session'
      useToast().error('End time must be selected to create a session')
      return
    }
    if (!sessionForm.value.capacity || sessionForm.value.capacity < 1) {
      errors.value.capacity = 'Please enter a valid capacity (minimum 1)'
      useToast().error('Capacity must be set to at least 1 to create a session')
      return
    }

    // Validate time
    if (sessionForm.value.end_time <= sessionForm.value.start_time) {
      errors.value.end_time = 'End time must be after start time'
      useToast().error('End time must be after start time')
      return
    }

    // Validate date is not in the past
    const sessionDate = new Date(sessionForm.value.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (sessionDate < today) {
      errors.value.date = 'Cannot create sessions for past dates'
      useToast().error('Cannot create sessions for past dates')
      return
    }

    // For updates, check if new capacity is less than current bookings
    if (showEditSessionModal.value && selectedSession.value) {
      const currentBookings = getBookingCount(selectedSession.value)
      if (sessionForm.value.capacity < currentBookings) {
        errors.value.capacity = `Cannot reduce capacity below current bookings (${currentBookings})`
        useToast().error(`Cannot reduce capacity below current bookings (${currentBookings})`)
        return
      }
    }

    const sessionData = {
      ...sessionForm.value,
      created_by: user.id
    }

    if (showEditSessionModal.value && selectedSession.value) {
      // Only update changed fields to minimize database operations
      const changes: Record<string, any> = {}
      Object.keys(sessionData).forEach(key => {
        if (sessionData[key] !== selectedSession.value[key]) {
          changes[key] = sessionData[key]
        }
      })

      if (Object.keys(changes).length > 0) {
        await sessionStore.updateSession(selectedSession.value.id, changes)
      useToast().success('Session updated successfully')
      } else {
        useToast().info('No changes were made to the session')
      }
    } else {
      await sessionStore.createSession(sessionData)
      useToast().success('Session created successfully')
    }
    
    closeSessionModal()
    await sessionStore.fetchSessions() // Refresh the sessions list
  } catch (error: any) {
    console.error('Session update error:', error)
    useToast().error(error.message || 'Failed to update session')
  } finally {
    isSubmitting.value = false
  }
}

const editSession = (session) => {
  try {
  selectedSession.value = session
  sessionForm.value = { ...session }
  showEditSessionModal.value = true
    useToast().info('Session loaded for editing')
  } catch (error: any) {
    console.error('Error loading session for editing:', error)
    useToast().error('Failed to load session for editing')
  }
}

const confirmDeleteSession = (session) => {
  try {
  selectedSession.value = session
  showDeleteModal.value = true
    useToast().warning('Please confirm session deletion')
  } catch (error: any) {
    console.error('Error confirming session deletion:', error)
    useToast().error('Failed to confirm session deletion')
  }
}

const deleteSession = async () => {
  try {
    isDeleting.value = true
    await sessionStore.deleteSession(selectedSession.value.id)
    
    if (deleteOptions.value.notifyMembers) {
      useToast().info('Sending cancellation notices to booked members...')
      // Here you would implement notification logic
      console.log('Sending notifications to members...')
    }
    
    useToast().success('Session deleted successfully')
    showDeleteModal.value = false
  } catch (error: any) {
    console.error('Session deletion error:', error)
    useToast().error(error.message || 'Failed to delete session')
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
  // Clear errors
  Object.keys(errors.value).forEach(key => {
    errors.value[key] = ''
  })
}

const getSessionStatus = (session) => {
  const sessionDate = new Date(session.date)
  const now = new Date()
  const bookingCount = getBookingCount(session)
  
  if (bookingCount >= session.capacity) return 'Full'
  if (sessionDate < now) return 'Past'
  if (sessionDate.toDateString() === now.toDateString()) return 'Today'
  return 'Upcoming'
}

const getSessionStatusBadge = (session) => {
  const status = getSessionStatus(session)
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  
  switch (status) {
    case 'Full':
      return `${baseClasses} bg-red-100 text-red-800`
    case 'Past':
      return `${baseClasses} bg-gray-100 text-gray-800`
    case 'Today':
      return `${baseClasses} bg-blue-100 text-blue-800`
    default:
      return `${baseClasses} bg-green-100 text-green-800`
  }
}

const fetchActiveMembers = async () => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('user_id')
      .not('user_id', 'is', null)
    
    if (error) throw error
    
    // Count unique user_ids
    const uniqueUsers = new Set(data.map(booking => booking.user_id))
    activeMembers.value = uniqueUsers.size
    
    useToast().info(`Found ${activeMembers.value} active members`)
  } catch (error) {
    console.error('Error fetching active members:', error)
    useToast().error('Failed to fetch active members count')
  }
}

// Add watcher for sessions
watch(sessions, async () => {
  await fetchActiveMembers()
}, { deep: true })

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

const fetchSessions = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        appointments:appointments(count),
        bookings:appointments(
          id,
          notes,
          user:users(
            id,
            full_name,
            email
          )
        )
      `)
      .order('date', { ascending: true })

    if (error) throw error

    sessions.value = data.map(session => ({
      ...session,
      appointments: session.appointments || [],
      bookings: session.bookings || []
    }))
  } catch (e: any) {
    console.error('Error fetching sessions:', e)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await fetchSessions()
  await fetchActiveMembers()
})
</script>

<style scoped>
.form-checkbox {
  @apply rounded-xl border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50;
}

.btn-primary {
  @apply px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200;
}

.card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200;
}

.form-input {
  @apply block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors duration-200;
}

.form-input.error {
  @apply border-red-500 focus:border-red-500 focus:ring-red-500;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-error {
  @apply mt-1 text-sm text-red-600;
}

/* Additional styles */
.table-header {
  @apply px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.table-cell {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-900;
}

.table-row {
  @apply hover:bg-gray-50 transition-colors duration-150;
}

.badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

/* Custom scrollbar */
select::-webkit-scrollbar {
  width: 8px;
}

select::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

select::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

select::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
