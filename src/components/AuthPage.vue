<template>
  <div class="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Left side - Hero Image -->
    <div class="hidden lg:flex lg:w-1/2 relative">
      <img 
        src="../assets/Gym1.jpg" 
        alt="Gym Background" 
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"></div>
      <div class="relative w-full flex items-center justify-center">
        <div class="px-12 text-center">
          <div class="mb-12">
            <h1 class="text-6xl font-extrabold text-white mb-6 tracking-tight">
              Welcome to <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">FitBook Pro</span>
            </h1>
            <p class="text-xl text-white/90 leading-relaxed max-w-lg mx-auto">
              Your journey to fitness starts here. Book classes, track progress, and achieve your goals.
            </p>
          </div>
          <div class="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div class="group bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:bg-white/20">
              <div class="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg p-3 w-12 h-12 mx-auto mb-4 group-hover:from-indigo-400 group-hover:to-purple-400 transition-colors duration-300">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-2">Easy Booking</h3>
              <p class="text-white/70 text-sm">Book your sessions in just a few clicks</p>
            </div>
            <div class="group bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:bg-white/20">
              <div class="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg p-3 w-12 h-12 mx-auto mb-4 group-hover:from-indigo-400 group-hover:to-purple-400 transition-colors duration-300">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-2">Track Progress</h3>
              <p class="text-white/70 text-sm">Monitor your fitness journey</p>
            </div>
            <div class="group bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:bg-white/20">
              <div class="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg p-3 w-12 h-12 mx-auto mb-4 group-hover:from-indigo-400 group-hover:to-purple-400 transition-colors duration-300">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-2">Achieve Goals</h3>
              <p class="text-white/70 text-sm">Reach your fitness milestones</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right side - Auth Form -->
    <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm">
        <div class="text-center">
          <div class="mb-10">
            <h2 class="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight">
              {{ isLogin ? 'Welcome Back!' : 'Join Us Today' }}
            </h2>
            <p class="mt-3 text-sm text-gray-600">
              {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
              <button
                @click="toggleAuthMode"
                class="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition-colors duration-200"
              >
                {{ isLogin ? 'Create one now' : 'Sign in instead' }}
              </button>
            </p>
          </div>
        </div>

        <div class="mt-8">
          <div class="mt-6">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Role Selection -->
              <div>
                <label for="role" class="block text-sm font-medium text-gray-700">
                  Select Role
                </label>
                <div class="mt-1">
                  <select
                    id="role"
                    v-model="selectedRole"
                    name="role"
                    required
                    class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div class="mt-1">
                  <input
                    id="email"
                    v-model="email"
                    name="email"
                    type="email"
                    required
                    class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                    :class="{ 'border-red-300': error }"
                  />
                </div>
              </div>

              <div v-if="!isLogin">
                <label for="fullName" class="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div class="mt-1">
                  <input
                    id="fullName"
                    v-model="fullName"
                    name="fullName"
                    type="text"
                    required
                    class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                  />
                </div>
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div class="mt-1">
                  <input
                    id="password"
                    v-model="password"
                    name="password"
                    type="password"
                    required
                    class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                    :class="{ 'border-red-300': error }"
                  />
                </div>
              </div>

              <!-- Admin Key Input (shown only when admin is selected) -->
              <div v-if="selectedRole === 'admin'" class="space-y-1">
                <label for="adminKey" class="block text-sm font-medium text-gray-700">
                  Admin Key
                </label>
                <div class="mt-1">
                  <input
                    id="adminKey"
                    v-model="adminKey"
                    name="adminKey"
                    type="password"
                    required
                    placeholder="Enter admin access key"
                    class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                    :class="{ 'border-red-300': error }"
                  />
                </div>
                <p class="mt-1 text-xs text-gray-500">
                  Contact system administrator for the admin access key
                </p>
              </div>

              <div v-if="error" class="rounded-xl bg-red-50 p-4 border border-red-100">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-red-700">{{ error }}</p>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    v-if="loading"
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create account') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../supabase'
import { useToast } from '../composables/useToast'

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const fullName = ref('')
const error = ref('')
const loading = ref(false)
const selectedRole = ref('member')
const adminKey = ref('')

// Use the environment variable for admin key
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY

const toggleAuthMode = () => {
  isLogin.value = !isLogin.value
  error.value = ''
  email.value = ''
  password.value = ''
  fullName.value = ''
  selectedRole.value = 'member'
  adminKey.value = ''
}

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''

    // Validate admin key if admin role is selected
    if (selectedRole.value === 'admin' && adminKey.value !== ADMIN_KEY) {
      throw new Error('Invalid admin key')
    }

    if (isLogin.value) {
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      
      if (signInError) throw signInError

      // Verify user role matches selected role
      if (user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (userError) throw userError

        if (userData.role !== selectedRole.value) {
          // Sign out the user if role doesn't match
          await supabase.auth.signOut()
          throw new Error(`Invalid credentials for ${selectedRole.value} role`)
        }
      }
    } else {
      if (password.value.length < 6) {
        throw new Error('Password must be at least 6 characters long')
      }

      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })
      
      if (signUpError) throw signUpError
      
      if (user) {
        // Create user profile in users table with selected role
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: user.id,
              email: email.value,
              full_name: fullName.value,
              role: selectedRole.value
            }
          ])
        
        if (profileError) throw profileError

        useToast().success('Account created successfully! Please check your email to verify your account.')
        return
      }
    }
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

/* Smooth transitions */
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Form focus states */
input:focus, select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

/* Error state animations */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.border-red-300 {
  animation: shake 0.5s ease-in-out;
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

/* Hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Gradient text */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Backdrop blur */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style> 