<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h2 class="text-xl font-semibold text-gray-900">Available Sessions</h2>
        <p class="mt-2 text-sm text-gray-700">Book your preferred gym session from the available slots below.</p>
      </div>
    </div>

    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div v-if="loading" class="text-center py-4">Loading sessions...</div>
          <div v-else-if="error" class="text-center text-red-600 py-4">{{ error }}</div>
          <div v-else class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Time</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Capacity</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Book</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="session in upcomingSessions" :key="session.id">
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{{ session.title }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ formatDate(session.date) }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ formatTime(session.start_time) }} - {{ formatTime(session.end_time) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ session.capacity }}</td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      @click="bookSession(session)"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      Book<span class="sr-only">, {{ session.title }}</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useSessionStore } from '../stores/sessionStore'
import { useAppointmentStore } from '../stores/appointmentStore'

const sessionStore = useSessionStore()
const appointmentStore = useAppointmentStore()

const loading = computed(() => sessionStore.loading)
const error = computed(() => sessionStore.error)
const upcomingSessions = computed(() => sessionStore.getUpcomingSessions)

onMounted(async () => {
  await sessionStore.fetchSessions()
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const formatTime = (time: string) => {
  return new Date(`1970-01-01T${time}`).toLocaleTimeString([], { 
    hour: '2-digit',
    minute: '2-digit'
  })
}

const bookSession = async (session: any) => {
  // In a real app, you would get the user_id from your auth system
  const userId = 'test-user-id'
  try {
    await appointmentStore.createAppointment({
      user_id: userId,
      session_id: session.id,
      notes: ''
    })
    alert('Session booked successfully!')
  } catch (error) {
    alert('Failed to book session')
  }
}
</script> 