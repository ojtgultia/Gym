import { defineStore } from 'pinia'
import { supabase } from '../supabase'

interface Session {
  id: string
  title: string
  date: string
  start_time: string
  end_time: string
  capacity: number
  created_by: string
  created_at: string
}

export const useSessionStore = defineStore('sessions', {
  state: () => ({
    sessions: [] as Session[],
    loading: false,
    error: null as string | null,
  }),
  
  actions: {
    async fetchSessions() {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('sessions')
          .select('*')
          .order('date', { ascending: true })
        
        if (error) throw error
        this.sessions = data
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async createSession(sessionData: Omit<Session, 'id' | 'created_at'>) {
      try {
        const { data, error } = await supabase
          .from('sessions')
          .insert([sessionData])
          .select()
        
        if (error) throw error
        if (data) {
          this.sessions.push(data[0])
        }
        return { success: true }
      } catch (err: any) {
        this.error = err.message
        return { success: false, error: err.message }
      }
    }
  },

  getters: {
    getSessions: (state) => state.sessions,
    getSessionById: (state) => (id: string) => 
      state.sessions.find(session => session.id === id),
    getUpcomingSessions: (state) => {
      const now = new Date()
      return state.sessions.filter(session => new Date(session.date) >= now)
    }
  }
}) 