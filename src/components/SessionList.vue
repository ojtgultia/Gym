<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="ml-2 text-gray-600">Loading sessions...</span>
    </div>

    <!-- Session Filters -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search sessions..."
          class="form-input w-full sm:w-64"
        />
        <select v-model="filterType" class="form-input w-full sm:w-40">
          <option value="all">All Sessions</option>
          <option value="available">Available</option>
          <option value="full">Full</option>
        </select>
      </div>
    </div>

    <!-- No Sessions -->
    <div v-if="!loading && filteredSessions.length === 0" class="text-center py-8">
      <div class="mx-auto h-12 w-12 text-gray-400">
        <svg class="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No sessions found</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ searchQuery ? 'Try adjusting your search terms.' : 'Check back later for new sessions.' }}
      </p>
    </div>

    <!-- Sessions Grid -->
    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="session in filteredSessions"
        :key="session.id"
        class="card p-6 flex flex-col justify-between"
      >
        <div>
          <h3 class="text-lg font-medium text-gray-900">{{ session.title }}</h3>
          <p class="mt-1 text-sm text-gray-500">{{ formatDate(session.date) }}</p>
          <p class="text-sm text-gray-500">
            {{ formatTime(session.start_time) }} - {{ formatTime(session.end_time) }}
          </p>
          <p v-if="session.description" class="mt-2 text-sm text-gray-600">
            {{ session.description }}
          </p>
          
          <!-- Availability Badge -->
          <div class="mt-4">
            <span
              :class="getAvailabilityClass(session)"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            >
              {{ getBookingCount(session) }}/{{ session.capacity }} spots filled
            </span>
          </div>
        </div>

        <div class="mt-6">
          <button
            @click="bookSession(session)"
            :disabled="isSessionFull(session) || loading"
            class="w-full btn-primary"
          >
            {{ isSessionFull(session) ? 'Session Full' : 'Book Session' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Booking Confirmation Modal -->
    <Modal v-model="showBookingModal">
      <template #header>
        <h3 class="text-lg font-medium text-gray-900">Confirm Booking</h3>
      </template>
      <template #body>
        <div v-if="selectedSession" class="space-y-4">
          <div>
            <h4 class="font-medium text-gray-900">{{ selectedSession.title }}</h4>
            <p class="text-sm text-gray-500">{{ formatDate(selectedSession.date) }}</p>
            <p class="text-sm text-gray-500">
              {{ formatTime(selectedSession.start_time) }} - {{ formatTime(selectedSession.end_time) }}
            </p>
          </div>
          <div class="mt-4">
            <label for="notes" class="block text-sm font-medium text-gray-700">
              Additional Notes (optional)
            </label>
            <textarea
              id="notes"
              v-model="bookingNotes"
              rows="3"
              class="mt-1 form-input"
              placeholder="Any special requirements or notes for the instructor"
            ></textarea>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="showBookingModal = false"
            class="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="confirmBooking"
            :disabled="isBooking"
            class="btn-primary flex items-center"
          >
            <svg v-if="isBooking" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Confirm Booking
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSessionStore } from '../stores/sessionStore'
import { useAppointmentStore } from '../stores/appointmentStore'
import Modal from './Modal.vue'
import { useToast } from '../composables/useToast'

const props = defineProps<{
  currentUser: {
    id: string
    email: string
    full_name: string
    role: string
  } | null
  theme?: {
    primary: {
      light: string
      dark: string
      gradient: string
    }
    secondary: {
      light: string
      dark: string
      gradient: string
    }
    accent: {
      light: string
      dark: string
      gradient: string
    }
  }
}>()

const sessionStore = useSessionStore()
const appointmentStore = useAppointmentStore()

const loading = computed(() => sessionStore.loading)
const error = computed(() => sessionStore.error)
const searchQuery = ref('')
const filterType = ref('all')
const showBookingModal = ref(false)
const selectedSession = ref<any>(null)
const bookingNotes = ref('')
const isBooking = ref(false)

const sessions = computed(() => sessionStore.getSessions)

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

  // Apply availability filter
  if (filterType.value === 'available') {
    filtered = filtered.filter(session => !isSessionFull(session))
  } else if (filterType.value === 'full') {
    filtered = filtered.filter(session => isSessionFull(session))
  }

  // Sort by date and time
  return filtered.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.start_time}`)
    const dateB = new Date(`${b.date}T${b.start_time}`)
    return dateA.getTime() - dateB.getTime()
  })
})

const getBookingCount = (session: any) => {
  return session.appointments?.[0]?.count || 0
}

const isSessionFull = (session: any) => {
  return getBookingCount(session) >= session.capacity
}

const getAvailabilityClass = (session: any) => {
  const bookingCount = getBookingCount(session)
  const percentage = (bookingCount / session.capacity) * 100

  if (percentage >= 100) return 'bg-red-100 text-red-800'
  if (percentage >= 75) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

const bookSession = (session: any) => {
  selectedSession.value = session
  bookingNotes.value = ''
  showBookingModal.value = true
}

const confirmBooking = async () => {
  if (!selectedSession.value || !props.currentUser) return

  try {
    isBooking.value = true
    await appointmentStore.createAppointment({
      user_id: props.currentUser.id,
      session_id: selectedSession.value.id,
      notes: bookingNotes.value,
      created_at: new Date().toISOString()
    })

    useToast().success('Session booked successfully!')
    showBookingModal.value = false
    await sessionStore.fetchSessions() // Refresh sessions to update availability
  } catch (error: any) {
    useToast().error(error.message)
  } finally {
    isBooking.value = false
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

onMounted(async () => {
  await sessionStore.fetchSessions()
})
</script>

<style scoped>
.form-input {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors duration-200;
}

.btn-primary {
  @apply px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200;
}
</style> 