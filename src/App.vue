<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'
import AuthPage from './components/AuthPage.vue'
import SessionList from './components/SessionList.vue'

const session = ref(null)

onMounted(() => {
  supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
    session.value = currentSession
  })

  supabase.auth.onAuthStateChange((_event, currentSession) => {
    session.value = currentSession
  })
})
</script>

<template>
  <div>
    <template v-if="session">
      <div class="min-h-screen bg-gray-100">
        <nav class="bg-white shadow-sm">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
              <div class="flex items-center">
                <h1 class="text-2xl font-bold text-gray-900">Gym Booking</h1>
              </div>
              <div class="flex items-center">
                <button
                  @click="() => supabase.auth.signOut()"
                  class="text-sm text-gray-700 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div class="px-4 py-6 sm:px-0">
            <SessionList />
          </div>
        </main>
      </div>
    </template>
    <AuthPage v-else />
  </div>
</template>

<style>
@import './style.css';
</style>
