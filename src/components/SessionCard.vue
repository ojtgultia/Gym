<template>
  <div class="card overflow-hidden">
    <div class="p-4 sm:p-6 space-y-4">
      <!-- Session Header -->
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">{{ session.title }}</h3>
          <p class="mt-1 text-sm text-gray-500">{{ formatDate(session.date) }}</p>
        </div>
        <span 
          class="px-2 py-1 text-xs font-medium rounded-full"
          :class="[
            session.spots_available > 5 
              ? 'bg-green-100 text-green-800'
              : session.spots_available > 0
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          ]"
        >
          {{ session.spots_available }} spots left
        </span>
      </div>

      <!-- Session Details -->
      <div class="space-y-2">
        <div class="flex items-center text-sm text-gray-600">
          <ClockIcon class="h-4 w-4 mr-2" />
          {{ formatTime(session.start_time) }} - {{ formatTime(session.end_time) }}
        </div>
        <div class="flex items-center text-sm text-gray-600">
          <UserGroupIcon class="h-4 w-4 mr-2" />
          {{ session.instructor_name }}
        </div>
        <p v-if="session.description" class="text-sm text-gray-600">
          {{ session.description }}
        </p>
      </div>

      <!-- Action Button -->
      <div class="pt-2">
        <button
          @click="$emit('book', session)"
          :disabled="isBooked || session.spots_available === 0"
          class="w-full btn-primary justify-center"
          :class="{
            'cursor-not-allowed': isBooked || session.spots_available === 0,
            'opacity-75': isBooked || session.spots_available === 0
          }"
        >
          <span v-if="isBooked" class="flex items-center">
            <CheckCircleIcon class="h-4 w-4 mr-2" />
            Already Booked
          </span>
          <span v-else-if="session.spots_available === 0">
            Session Full
          </span>
          <span v-else>
            Book Session
          </span>
        </button>
      </div>

      <!-- Booked Badge -->
      <div 
        v-if="isBooked" 
        class="absolute top-4 right-4 transform rotate-45 bg-indigo-600 text-white px-8 py-1 text-xs font-medium"
      >
        Booked
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClockIcon, UserGroupIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  session: {
    type: Object,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  }
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
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
.card {
  @apply relative bg-white rounded-xl shadow-sm border border-gray-200 
    hover:shadow-md transition-all duration-200;
}

.btn-primary {
  @apply px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl 
    hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 
    focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 
    disabled:cursor-not-allowed transition-all duration-200 flex items-center 
    shadow-sm hover:shadow-md;
}
</style> 