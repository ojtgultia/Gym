<template>
  <header class="relative z-20">
    <!-- Top Navigation Bar -->
    <nav class="bg-gradient-to-r from-indigo-600 to-purple-600 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and Brand -->
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="flex items-center">
                <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="ml-2 text-2xl font-bold text-white">FitBook Pro</span>
              </div>
            </div>
          </div>

          <!-- Navigation Menu -->
          <div class="flex items-center space-x-4">
            <button
              @click="$emit('changeTab', 'sessions')"
              class="px-3 py-2 text-sm font-medium rounded-md transition-all duration-200"
              :class="activeTab === 'sessions' ? 'bg-white text-indigo-600' : 'text-white hover:bg-indigo-500'"
            >
              Available Sessions
            </button>
            <button
              @click="$emit('changeTab', 'appointments')"
              class="px-3 py-2 text-sm font-medium rounded-md transition-all duration-200"
              :class="activeTab === 'appointments' ? 'bg-white text-indigo-600' : 'text-white hover:bg-indigo-500'"
            >
              My Bookings
            </button>

            <!-- User Menu -->
            <div class="ml-3 relative user-menu">
              <div>
                <button
                  @click="userMenuOpen = !userMenuOpen"
                  class="flex items-center max-w-xs bg-white bg-opacity-20 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                >
                  <span class="sr-only">Open user menu</span>
                  <div class="h-8 w-8 rounded-full flex items-center justify-center bg-indigo-500 text-white">
                    {{ userInitials }}
                  </div>
                </button>
              </div>

              <!-- Dropdown Menu -->
              <div v-if="userMenuOpen" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                <div class="px-4 py-2 text-xs text-gray-500">
                  Signed in as<br>
                  <span class="font-medium text-gray-900">{{ userEmail }}</span>
                </div>
                <div class="border-t border-gray-100"></div>
                <a
                  href="#"
                  @click.prevent="handleSignOut"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="bg-gradient-to-b from-indigo-600 to-indigo-800 pb-32 relative">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-extrabold text-white">
          {{ activeTab === 'sessions' ? 'Book Your Next Workout' : 'Your Fitness Journey' }}
        </h2>
        <p class="mt-4 text-lg text-indigo-200">
          {{ activeTab === 'sessions' 
            ? 'Choose from our wide range of fitness sessions and start your fitness journey today.'
            : 'Track and manage your upcoming gym sessions.' }}
        </p>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { supabase } from '../supabase'

const props = defineProps<{
  activeTab: string
  userEmail: string
}>()

const emit = defineEmits(['changeTab'])

const userMenuOpen = ref(false)

const userInitials = computed(() => {
  return props.userEmail
    .split('@')[0]
    .substring(0, 2)
    .toUpperCase()
})

const handleSignOut = async () => {
  await supabase.auth.signOut()
  userMenuOpen.value = false
}
</script>

<style scoped>
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Add these styles to ensure proper layering */
header {
  position: relative;
  z-index: 20;
}

nav {
  position: relative;
  z-index: 20;
}

.user-menu {
  position: relative;
  z-index: 30;
}
</style> 