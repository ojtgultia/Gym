import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export interface Session {
  id: string
  title: string
  date: string
  start_time: string
  end_time: string
  capacity: number
  description: string
  created_by: string
  created_at: string
  appointments?: { count: number }[]
}

export const useSessionStore = defineStore('sessions', {
  state: () => ({
    sessions: [] as Session[],
    loading: false,
    error: null as string | null,
  }),
  
  actions: {
    async fetchSessions() {
      try {
        this.loading = true
        this.error = null

        const { data, error } = await supabase
          .from('sessions')
          .select(`
            *,
            appointments:appointments(count)
          `)
          .order('date', { ascending: true })

        if (error) throw error

        this.sessions = data.map(session => ({
          ...session,
          appointments: session.appointments || []
        }))
      } catch (e: any) {
        this.error = e.message
        console.error('Error fetching sessions:', e)
      } finally {
        this.loading = false
      }
    },

    async createSession(sessionData: Omit<Session, 'id' | 'created_at'>) {
      try {
        this.loading = true
        this.error = null

        // Validate session data
        if (!sessionData.title || !sessionData.date || !sessionData.start_time || !sessionData.end_time) {
          throw new Error('Please fill in all required fields')
        }

        if (sessionData.capacity < 1) {
          throw new Error('Capacity must be at least 1')
        }

        // Format the data for insertion
        const newSession = {
          ...sessionData,
          created_at: new Date().toISOString()
        }

        const { data, error } = await supabase
          .from('sessions')
          .insert([newSession])
          .select(`
            *,
            appointments:appointments(count)
          `)
          .single()

        if (error) throw error

        // Add the new session to the state
        this.sessions.push({
          ...data,
          appointments: data.appointments || []
        })

        return data
      } catch (e: any) {
        this.error = e.message
        console.error('Error creating session:', e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async updateSession(id: string, updates: Partial<Session>) {
      try {
        this.loading = true
        this.error = null

        // Validate updates
        if (updates.capacity !== undefined && updates.capacity < 1) {
          throw new Error('Capacity must be at least 1')
        }

        const { data, error } = await supabase
          .from('sessions')
          .update(updates)
          .eq('id', id)
          .select(`
            *,
            appointments:appointments(count)
          `)
          .single()

        if (error) throw error

        // Update the session in the state
        const index = this.sessions.findIndex(s => s.id === id)
        if (index !== -1) {
          this.sessions[index] = {
            ...data,
            appointments: data.appointments || []
          }
        }

        return data
      } catch (e: any) {
        this.error = e.message
        console.error('Error updating session:', e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async deleteSession(id: string) {
      try {
        this.loading = true
        this.error = null

        // First check if there are any appointments
        const { data: appointments, error: checkError } = await supabase
          .from('appointments')
          .select('id')
          .eq('session_id', id)

        if (checkError) throw checkError

        // If there are appointments, delete them first
        if (appointments && appointments.length > 0) {
          const { error: deleteAppError } = await supabase
            .from('appointments')
            .delete()
            .eq('session_id', id)

          if (deleteAppError) throw deleteAppError
        }

        // Then delete the session
        const { error } = await supabase
          .from('sessions')
          .delete()
          .eq('id', id)

        if (error) throw error

        // Remove the session from the state
        this.sessions = this.sessions.filter(s => s.id !== id)
      } catch (e: any) {
        this.error = e.message
        console.error('Error deleting session:', e)
        throw e
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    getSessions: (state) => state.sessions,
    
    getSessionById: (state) => (id: string) => 
      state.sessions.find(session => session.id === id),
    
    getUpcomingSessions: (state) => {
      const now = new Date()
      return state.sessions
        .filter(session => {
          const sessionDate = new Date(session.date)
          return sessionDate >= now
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    },

    getAvailableSessions: (state) => {
      const now = new Date()
      return state.sessions
        .filter(session => {
          const sessionDate = new Date(session.date)
          const bookings = session.appointments?.[0]?.count || 0
          return sessionDate >= now && bookings < session.capacity
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }
  }
}) 