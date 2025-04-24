import { defineStore } from 'pinia'
import { supabase } from '../supabase'

interface Appointment {
  id: string
  user_id: string
  session_id: string
  notes?: string
  created_at: string
}

export const useAppointmentStore = defineStore('appointments', {
  state: () => ({
    appointments: [] as Appointment[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchUserAppointments(userId: string) {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            sessions (*)
          `)
          .eq('user_id', userId)
        
        if (error) throw error
        this.appointments = data
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async createAppointment(appointmentData: Omit<Appointment, 'id' | 'created_at'>) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .insert([appointmentData])
          .select()
        
        if (error) throw error
        if (data) {
          this.appointments.push(data[0])
        }
        return { success: true }
      } catch (err: any) {
        this.error = err.message
        return { success: false, error: err.message }
      }
    },

    async cancelAppointment(appointmentId: string) {
      try {
        const { error } = await supabase
          .from('appointments')
          .delete()
          .eq('id', appointmentId)
        
        if (error) throw error
        this.appointments = this.appointments.filter(app => app.id !== appointmentId)
        return { success: true }
      } catch (err: any) {
        this.error = err.message
        return { success: false, error: err.message }
      }
    }
  },

  getters: {
    getUserAppointments: (state) => state.appointments,
    getAppointmentById: (state) => (id: string) =>
      state.appointments.find(app => app.id === id)
  }
}) 