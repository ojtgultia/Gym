<template>
  <header class="relative z-20 w-full">
    <!-- Top Navigation Bar -->
    <nav class="bg-gray-900 relative w-full">
      <div class="max-w-7xl mx-auto px-6 lg:px-8 w-full">
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
            <!-- Show different navigation based on user role -->
            <template v-if="!isAdmin">
              <button
                @click="$emit('changeTab', 'sessions')"
                class="px-4 py-2 text-sm font-medium rounded-md transition-all duration-200"
                :class="activeTab === 'sessions' ? 'bg-white text-gray-900' : 'text-gray-200 hover:bg-gray-800'"
              >
                Available Sessions
              </button>
              <button
                @click="$emit('changeTab', 'appointments')"
                class="px-4 py-2 text-sm font-medium rounded-md transition-all duration-200"
                :class="activeTab === 'appointments' ? 'bg-white text-gray-900' : 'text-gray-200 hover:bg-gray-800'"
              >
                My Bookings
              </button>
            </template>

            <!-- User Menu -->
            <div class="ml-3 relative user-menu">
              <div>
                <button
                  @click="userMenuOpen = !userMenuOpen"
                  class="flex items-center max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white"
                >
                  <span class="sr-only">Open user menu</span>
                  <div class="h-8 w-8 rounded-full flex items-center justify-center bg-gray-700 text-white">
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
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Sign out
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section - Show only for admin -->
    <div v-if="isAdmin" class="bg-gradient-to-b from-gray-900 to-gray-800 relative w-full">
      <div class="max-w-7xl mx-auto py-12 px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Session Management Dashboard</h2>
          <p class="text-lg md:text-xl text-gray-300">
            Manage your gym sessions, track bookings, and monitor member activity all in one place.
          </p>
        </div>
      </div>
      <!-- Decorative bottom border -->
      <div class="absolute bottom-0 w-full h-1 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"></div>
    </div>
    
    <!-- Hero Section - Show for non-admin users -->
    <div v-else class="bg-gradient-to-b from-gray-900 to-gray-800 relative w-full">
      <div class="max-w-7xl mx-auto py-12 px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            {{ activeTab === 'sessions' ? 'Book Your Next Workout' : 'Your Fitness Journey' }}
          </h2>
          <p class="text-lg md:text-xl text-gray-300">
            {{ activeTab === 'sessions' 
              ? 'Choose from our wide range of fitness sessions and start your fitness journey today.'
              : 'Track and manage your upcoming gym sessions.' }}
          </p>
        </div>
      </div>
      <!-- Decorative bottom border -->
      <div class="absolute bottom-0 w-full h-1 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"></div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { supabase } from '../supabase'

const props = defineProps<{
  activeTab: string
  userEmail: string
  isAdmin: boolean
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
/* Add these styles to ensure proper layering */
header {
  position: relative;
  z-index: 20;
  width: 100%;
}

nav {
  position: relative;
  z-index: 20;
  width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-menu {
  position: relative;
  z-index: 30;
}

/* Content Alignment */
.content-wrapper {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
}

@media (min-width: 1024px) {
  .content-wrapper {
    padding: 0 4rem;
  }
}

/* Hero Section Styles */
.hero-section {
  position: relative;
  padding: 4rem 0;
  background-size: cover;
  background-position: center;
}

/* Responsive Typography */
@media (min-width: 768px) {
  h2 {
    font-size: 2.5rem;
    line-height: 1.2;
  }
  
  p {
    font-size: 1.25rem;
    line-height: 1.75;
  }
}

/* Container Styles */
.max-w-7xl {
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

/* Navigation Button Hover Effects */
button {
  transition: all 0.2s ease-in-out;
}

button:hover {
  transform: translateY(-1px);
}

/* User Menu Styles */
.user-menu button {
  transition: all 0.2s ease-in-out;
}

.user-menu button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Gradient Animation */
@keyframes gradientShift {
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

.bg-gradient-to-b {
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
}
</style> 