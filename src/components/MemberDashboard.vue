<template>
  <div class="space-y-6">
    <!-- Member Dashboard Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">Member Dashboard</h1>
      <div class="flex space-x-4">
        <button
          @click="activeView = 'available'"
          class="btn-primary"
          :class="{ 'bg-indigo-700': activeView === 'available' }"
        >
          <CalendarIcon class="h-5 w-5 mr-2" />
          Available Sessions
        </button>
        <button
          @click="activeView = 'appointments'"
          class="btn-primary"
          :class="{ 'bg-indigo-700': activeView === 'appointments' }"
        >
          <ClockIcon class="h-5 w-5 mr-2" />
          My Appointments
        </button>
      </div>
    </div>

    <!-- Member Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900">Available Sessions</h3>
        <p class="text-3xl font-bold text-indigo-600">{{ availableSessions }}</p>
      </div>
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900">My Appointments</h3>
        <p class="text-3xl font-bold text-emerald-600">{{ myAppointments }}</p>
      </div>
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900">Next Session</h3>
        <div v-if="nextSession" class="text-sm">
          <p class="text-xl font-bold text-violet-600">{{ nextSession.title }}</p>
          <p class="text-gray-600">{{ formatDate(nextSession.date) }}</p>
        </div>
        <p v-else class="text-xl font-bold text-gray-400">No upcoming sessions</p>
      </div>
    </div>

    <!-- Available Sessions View -->
    <div v-if="activeView === 'available'" class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-medium text-gray-900">Available Sessions</h2>
        <div class="flex space-x-4">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search sessions..."
            class="form-input w-64"
          />
          <select v-model="filterType" class="form-select w-40">
            <option value="all">All Sessions</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      <!-- Sessions Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SessionCard
          v-for="session in filteredSessions"
          :key="session.id"
          :session="session"
          @book="bookSession"
        />
      </div>
    </div>

    <!-- My Appointments View -->
    <div v-if="activeView === 'appointments'" class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-medium text-gray-900">My Appointments</h2>
      </div>
      <AppointmentList
        :appointments="userAppointments"
        @cancel="cancelAppointment"
      />
    </div>

    <!-- Booking Confirmation Modal -->
    <Modal v-model="showBookingModal">
      <template #header>
        <h3 class="text-lg font-medium text-gray-900">Confirm Booking</h3>
      </template>
      <template #body>
        <div v-if="selectedSession" class="space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-900">{{ selectedSession.title }}</h4>
            <p class="text-sm text-gray-500">{{ formatDate(selectedSession.date) }}</p>
            <p class="text-sm text-gray-500">
              {{ formatTime(selectedSession.start_time) }} - {{ formatTime(selectedSession.end_time) }}
            </p>
          </div>
          <p class="text-sm text-gray-600">
            Are you sure you want to book this session?
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="showBookingModal = false"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button
            @click="confirmBooking"
            :disabled="isBooking"
            class="btn-primary"
          >
            <LoadingSpinner v-if="isBooking" class="mr-2" />
            {{ isBooking ? 'Booking...' : 'Confirm Booking' }}
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CalendarIcon, ClockIcon } from '@heroicons/vue/24/solid'
import { useSessionStore } from '../stores/sessionStore'
import { useAppointmentStore } from '../stores/appointmentStore'
import { useToast } from '../composables/useToast'
import { supabase } from '../supabase'
import Modal from './Modal.vue'
import SessionCard from './SessionCard.vue'
import AppointmentList from './AppointmentList.vue'
import LoadingSpinner from './LoadingSpinner.vue'

// Stores
const sessionStore = useSessionStore()
const appointmentStore = useAppointmentStore()
const toast = useToast()

// State
const activeView = ref('available')
const searchQuery = ref('')
const filterType = ref('all')
const showBookingModal = ref(false)
const selectedSession = ref(null)
const isBooking = ref(false)

// Computed
const availableSessions = computed(() => sessionStore.getAvailableSessions.length)
const myAppointments = computed(() => appointmentStore.getUserAppointments.length)
const nextSession = computed(() => {
  const upcoming = appointmentStore.getUserAppointments
    .filter(app => new Date(app.session.date) > new Date())
    .sort((a, b) => new Date(a.session.date).getTime() - new Date(b.session.date).getTime())
  return upcoming[0]?.session || null
})

const filteredSessions = computed(() => {
  let sessions = sessionStore.getAvailableSessions

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    sessions = sessions.filter(session => 
      session.title.toLowerCase().includes(query) ||
      session.description?.toLowerCase().includes(query)
    )
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  switch (filterType.value) {
    case 'today':
      return sessions.filter(session => {
        const sessionDate = new Date(session.date)
        return sessionDate.toDateString() === today.toDateString()
      })
    case 'week':
      const endOfWeek = new Date(today)
      endOfWeek.setDate(today.getDate() + 7)
      return sessions.filter(session => {
        const sessionDate = new Date(session.date)
        return sessionDate >= today && sessionDate <= endOfWeek
      })
    case 'month':
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      return sessions.filter(session => {
        const sessionDate = new Date(session.date)
        return sessionDate >= today && sessionDate <= endOfMonth
      })
    default:
      return sessions
  }
})

// Methods
const bookSession = (session) => {
  selectedSession.value = session
  showBookingModal.value = true
}

const confirmBooking = async () => {
  try {
    isBooking.value = true
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      toast.error('Please sign in to book a session')
      return
    }

    const result = await appointmentStore.createAppointment({
      user_id: user.id,
      session_id: selectedSession.value.id,
      notes: ''
    })

    if (result.success) {
      toast.success('Session booked successfully!')
      showBookingModal.value = false
      await sessionStore.fetchSessions()
    } else {
      toast.error(result.error || 'Failed to book session')
    }
  } catch (error: any) {
    toast.error(error.message)
  } finally {
    isBooking.value = false
  }
}

const cancelAppointment = async (appointmentId) => {
  try {
    const result = await appointmentStore.cancelAppointment(appointmentId)
    if (result.success) {
      toast.success('Appointment cancelled successfully')
      await sessionStore.fetchSessions()
    } else {
      toast.error(result.error || 'Failed to cancel appointment')
    }
  } catch (error: any) {
    toast.error(error.message)
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    sessionStore.fetchSessions(),
    appointmentStore.fetchUserAppointments()
  ])

  // Set up real-time subscription
  const subscription = supabase
    .channel('public:sessions')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'sessions' },
      async () => {
        await sessionStore.fetchSessions()
      }
    )
    .subscribe()

  onUnmounted(() => {
    supabase.removeChannel(subscription)
  })
})

// Helpers
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
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
    disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200
    flex items-center;
}

.btn-secondary {
  @apply px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 
    disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200;
}

.form-input {
  @apply block w-full rounded-md border-gray-300 shadow-sm 
    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm;
}

.form-select {
  @apply block w-full rounded-md border-gray-300 shadow-sm 
    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm;
}
</style>