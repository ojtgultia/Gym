<template>
    <div class="space-y-8">
      <!-- Member Dashboard Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Member Dashboard</h1>
          <p class="mt-2 text-sm text-gray-600">Manage your fitness journey and track your progress</p>
        </div>
        <div class="flex space-x-3 bg-white p-1 rounded-xl shadow-sm border border-gray-200">
          <button
            @click="activeView = 'available'"
            class="flex items-center px-4 py-2 rounded-lg transition-all duration-200"
            :class="[
              activeView === 'available' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50'
            ]"
          >
            <CalendarIcon class="h-5 w-5 mr-2" />
            Available Sessions
          </button>
          <button
            @click="activeView = 'appointments'"
            class="flex items-center px-4 py-2 rounded-lg transition-all duration-200"
            :class="[
              activeView === 'appointments' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50'
            ]"
          >
            <ClockIcon class="h-5 w-5 mr-2" />
            My Appointments
          </button>
        </div>
      </div>
  
      <!-- Member Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div class="card p-4 sm:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xs sm:text-sm font-medium text-gray-500">Available Sessionss</h3>
              <p class="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-indigo-600">{{ availableSessions }}</p>
            </div>
            <div class="p-2 sm:p-3 bg-indigo-100 rounded-lg">
              <CalendarIcon class="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
            </div>
          </div>
        </div>
        <div class="card p-4 sm:p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xs sm:text-sm font-medium text-gray-500">My Appointments</h3>
              <p class="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-emerald-600">{{ myAppointments }}</p>
            </div>
            <div class="p-2 sm:p-3 bg-emerald-100 rounded-lg">
              <ClockIcon class="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div class="card p-4 sm:p-6 bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xs sm:text-sm font-medium text-gray-500">Next Session</h3>
              <div v-if="nextSession" class="mt-1 sm:mt-2">
                <p class="text-lg sm:text-xl font-bold text-violet-600">{{ nextSession.title }}</p>
                <p class="text-xs sm:text-sm text-gray-600">{{ formatDate(nextSession.date) }}</p>
              </div>
              <p v-else class="mt-1 sm:mt-2 text-lg sm:text-xl font-bold text-gray-400">No upcoming sessions</p>
            </div>
            <div class="p-2 sm:p-3 bg-violet-100 rounded-lg">
              <svg class="h-5 w-5 sm:h-6 sm:w-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Available Sessions View -->
      <div v-if="activeView === 'available'" class="space-y-4 sm:space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <h2 class="text-xl sm:text-2xl font-semibold text-gray-900">Available Sessions</h2>
          <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div class="relative flex-grow sm:flex-grow-0">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search sessions..."
                class="form-input pl-10 w-full text-sm"
              />
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select v-model="filterType" class="form-select text-sm">
              <option value="all">All Sessions</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
  
        <!-- Sessions Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <SessionCard
            v-for="session in filteredSessions"
            :key="session.id"
            :session="session"
            :is-booked="session.isBooked"
            @book="bookSession"
          />
        </div>
      </div>
  
    
      <!-- Booking Confirmation Modal -->
      <Modal v-model="showBookingModal">
        <template #header>
          <h3 class="text-lg sm:text-xl font-semibold text-gray-900">Confirm Booking</h3>
        </template>
        <template #body>
          <div v-if="selectedSession" class="space-y-4 sm:space-y-6">
            <div class="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 rounded-xl border border-indigo-100">
              <h4 class="text-base sm:text-lg font-semibold text-gray-900">{{ selectedSession.title }}</h4>
              <div class="mt-2 space-y-1">
                <p class="text-xs sm:text-sm text-gray-600">
                  <svg class="inline-block h-3 w-3 sm:h-4 sm:w-4 mr-1 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(selectedSession.date) }}
                </p>
                <p class="text-xs sm:text-sm text-gray-600">
                  <svg class="inline-block h-3 w-3 sm:h-4 sm:w-4 mr-1 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ formatTime(selectedSession.start_time) }} - {{ formatTime(selectedSession.end_time) }}
                </p>
              </div>
            </div>
            <p class="text-xs sm:text-sm text-gray-600">
              Are you sure you want to book this session? You can cancel it later if needed.
            </p>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end space-x-2 sm:space-x-3">
            <button
              @click="showBookingModal = false"
              class="btn-secondary text-xs sm:text-sm"
            >
              Cancel
            </button>
            <button
              @click="confirmBooking"
              :disabled="isBooking"
              class="btn-primary text-xs sm:text-sm"
            >
              <LoadingSpinner v-if="isBooking" class="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              {{ isBooking ? 'Booking...' : 'Confirm Booking' }}
            </button>
          </div>
        </template>
      </Modal>
  
      <!-- Add Cancellation Modal -->
      <Modal v-model="showCancellationModal">
        <template #header>
          <h3 class="text-lg sm:text-xl font-semibold text-gray-900">Cancel Appointment</h3>
        </template>
        <template #body>
          <div v-if="selectedSession" class="space-y-4 sm:space-y-6">
            <div class="bg-gradient-to-br from-red-50 to-pink-50 p-4 sm:p-6 rounded-xl border border-red-100">
              <h4 class="text-base sm:text-lg font-semibold text-gray-900">{{ selectedSession.title }}</h4>
              <div class="mt-2 space-y-1">
                <p class="text-xs sm:text-sm text-gray-600">
                  <svg class="inline-block h-3 w-3 sm:h-4 sm:w-4 mr-1 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(selectedSession.date) }}
                </p>
                <p class="text-xs sm:text-sm text-gray-600">
                  <svg class="inline-block h-3 w-3 sm:h-4 sm:w-4 mr-1 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ formatTime(selectedSession.start_time) }} - {{ formatTime(selectedSession.end_time) }}
                </p>
              </div>
            </div>
            <p class="text-xs sm:text-sm text-gray-600">
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </p>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end space-x-2 sm:space-x-3">
            <button
              @click="showCancellationModal = false"
              class="btn-secondary text-xs sm:text-sm"
            >
              Keep Booking
            </button>
            <button
              @click="cancelAppointment(selectedSession.userAppointment.id)"
              class="btn-danger text-xs sm:text-sm"
            >
              Cancel Appointment
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
  import axios from 'axios'
  
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
  const showCancellationModal = ref(false)
  
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
  }).map(session => ({
    ...session,
    isBooked: appointmentStore.getUserAppointments.some(
      appointment => appointment.session_id === session.id
    ),
    userAppointment: appointmentStore.getUserAppointments.find(
      appointment => appointment.session_id === session.id
    )
  }))
  
  // Methods
  
  // Book Session
  const bookSession = (session) => {
    if (session.isBooked) {
      selectedSession.value = session
      showCancellationModal.value = true
      return
    }
    selectedSession.value = session
    showBookingModal.value = true
  }
  
  // Confirm Booking (using axios)
  const confirmBooking = async () => {
    try {
      isBooking.value = true
      
      // Assuming user info is fetched from Supabase or elsewhere
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('Please sign in to book a session')
        return
      }
  
      const bookingData = {
        user_id: user.id,
        session_id: selectedSession.value.id,
        notes: '' // You can add more notes or data as needed
      }
  
      // Make an API call to book the session (using axios)
      const response = await axios.post('https://booking/book', bookingData)
  
      if (response.status === 200 && response.data.success) {
        toast.success('Session booked successfully!')
        showBookingModal.value = false
        await sessionStore.fetchSessions() // Refresh the sessions after booking
      } else {
        toast.error(response.data.error || 'Failed to book session')
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong while confirming booking')
    } finally {
      isBooking.value = false
    }
  }
  
  // Cancel Appointment (using axios)
  const cancelAppointment = async (appointmentId) => {
    try {
      // Call an API to cancel the appointment (using axios)
      const response = await axios.post('https://appointment/cancel', { appointmentId })
  
      if (response.status === 200 && response.data.success) {
        toast.success('Appointment cancelled successfully')
        await sessionStore.fetchSessions() // Refresh sessions after cancellation
        showCancellationModal.value = false
      } else {
        toast.error(response.data.error || 'Failed to cancel appointment')
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong while cancelling appointment')
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
    @apply px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl 
      hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 
      focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 
      disabled:cursor-not-allowed transition-all duration-200 flex items-center 
      shadow-sm hover:shadow-md;
  }
  
  .btn-secondary {
    @apply px-4 py-2 bg-white text-gray-700 rounded-xl border border-gray-300 
      hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
      focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed 
      transition-all duration-200 shadow-sm hover:shadow-md;
  }
  
  .form-input {
    @apply block w-full rounded-xl border-gray-300 shadow-sm 
      focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm 
      transition-all duration-200;
  }
  
  .form-select {
    @apply block w-full rounded-xl border-gray-300 shadow-sm 
      focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm 
      transition-all duration-200;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-sm border border-gray-200 
      hover:shadow-md transition-all duration-200;
  }
  
  .btn-danger {
    @apply px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl 
      hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 
      focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 
      disabled:cursor-not-allowed transition-all duration-200 flex items-center 
      shadow-sm hover:shadow-md;
  }
  </style>