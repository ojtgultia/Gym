<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="ml-2 text-gray-600">Loading your appointments...</span>
    </div>

    <!-- No Appointments -->
    <div v-else-if="appointments.length === 0" class="text-center py-8">
      <div class="mx-auto h-12 w-12 text-gray-400">
        <svg class="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by booking a session.</p>
      <div class="mt-6">
        <button
          @click="$emit('changeTab', 'sessions')"
          class="btn-primary"
        >
          Book a Session
        </button>
      </div>
    </div>

    <!-- Appointments List -->
    <div v-else class="space-y-6">
      <!-- Upcoming Appointments -->
      <div v-if="upcomingAppointments.length > 0" class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900">Upcoming Appointments</h3>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="appointment in upcomingAppointments"
            :key="appointment.id"
            class="card p-4 flex flex-col justify-between"
          >
            <div>
              <h4 class="font-medium text-gray-900">{{ appointment.session?.title }}</h4>
              <p class="text-sm text-gray-500">{{ formatDate(appointment.session?.date) }}</p>
              <p class="text-sm text-gray-500">
                {{ formatTime(appointment.session?.start_time) }} - {{ formatTime(appointment.session?.end_time) }}
              </p>
            </div>
            <div class="mt-4">
              <button
                @click="confirmCancelAppointment(appointment)"
                class="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Past Appointments -->
      <div v-if="pastAppointments.length > 0" class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900">Past Appointments</h3>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="appointment in pastAppointments"
            :key="appointment.id"
            class="card p-4 opacity-75"
          >
            <h4 class="font-medium text-gray-900">{{ appointment.session?.title }}</h4>
            <p class="text-sm text-gray-500">{{ formatDate(appointment.session?.date) }}</p>
            <p class="text-sm text-gray-500">
              {{ formatTime(appointment.session?.start_time) }} - {{ formatTime(appointment.session?.end_time) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel Confirmation Modal -->
    <Modal v-model="showCancelModal">
      <template #header>
        <h3 class="text-lg font-medium text-red-600">Cancel Booking</h3>
      </template>
      <template #body>
        <p class="text-gray-600">
          Are you sure you want to cancel this booking? This action cannot be undone.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="showCancelModal = false"
            class="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Keep Booking
          </button>
          <button
            @click="cancelAppointment"
            :disabled="isCancelling"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
          >
            <svg v-if="isCancelling" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cancel Booking
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
}>()

const emit = defineEmits(['changeTab'])

const appointmentStore = useAppointmentStore()
const appointments = computed(() => appointmentStore.getUserAppointments)
const loading = computed(() => appointmentStore.loading)

const showCancelModal = ref(false)
const selectedAppointment = ref<any>(null)
const isCancelling = ref(false)

// Split appointments into upcoming and past
const upcomingAppointments = computed(() => {
  const now = new Date()
  return appointments.value.filter(appointment => {
    if (!appointment.session?.date) return false
    return new Date(appointment.session.date) >= now
  })
})

const pastAppointments = computed(() => {
  const now = new Date()
  return appointments.value.filter(appointment => {
    if (!appointment.session?.date) return false
    return new Date(appointment.session.date) < now
  })
})

const confirmCancelAppointment = (appointment: any) => {
  selectedAppointment.value = appointment
  showCancelModal.value = true
}

const cancelAppointment = async () => {
  if (!selectedAppointment.value) return

  try {
    isCancelling.value = true
    await appointmentStore.cancelAppointment(selectedAppointment.value.id)
    useToast().success('Booking cancelled successfully')
    showCancelModal.value = false
  } catch (error: any) {
    useToast().error(error.message)
  } finally {
    isCancelling.value = false
  }
}

const formatDate = (date?: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (time?: string) => {
  if (!time) return ''
  return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  if (props.currentUser) {
    await appointmentStore.fetchUserAppointments(props.currentUser.id)
  }
})
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200;
}
</style> 