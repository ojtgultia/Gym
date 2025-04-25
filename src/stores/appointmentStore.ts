import { defineStore } from 'pinia'
import { supabase } from '../supabase'

interface Appointment {
  id: string
  user_id: string
  session_id: string
  notes: string
  created_at: string
  session?: {
    title: string
    date: string
    start_time: string
    end_time: string
  }
}

export const useAppointmentStore = defineStore('appointments', {
  state: () => ({
    appointments: [] as Appointment[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getUserAppointments: (state) => {
      return state.appointments.sort((a, b) => {
        if (!a.session || !b.session) return 0
        return new Date(a.session.date).getTime() - new Date(b.session.date).getTime()
      })
    },
  },

  actions: {
    async fetchUserAppointments(userId: string) {
      try {
        this.loading = true
        this.error = null

        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            session:sessions (
              title,
              date,
              start_time,
              end_time
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (error) throw error

        this.appointments = data
      } catch (e: any) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    async createAppointment(appointmentData: Omit<Appointment, 'id' | 'created_at'>) {
      try {
        this.loading = true
        this.error = null

        // First check if user already has an appointment for this session
        const { data: existingAppointment, error: checkError } = await supabase
          .from('appointments')
          .select('id')
          .eq('user_id', appointmentData.user_id)
          .eq('session_id', appointmentData.session_id)
          .single()

        if (checkError && checkError.code !== 'PGRST116') throw checkError
        if (existingAppointment) throw new Error('You have already booked this session')

        // Check session capacity
        const { data: session, error: sessionError } = await supabase
          .from('sessions')
          .select('capacity, appointments(count)')
          .eq('id', appointmentData.session_id)
          .single()

        if (sessionError) throw sessionError

        const currentBookings = session.appointments[0]?.count || 0
        if (currentBookings >= session.capacity) {
          throw new Error('This session is fully booked')
        }

        // Create the appointment
        const { data, error } = await supabase
          .from('appointments')
          .insert([appointmentData])
          .select(`
            *,
            session:sessions (
              title,
              date,
              start_time,
              end_time
            )
          `)
          .single()

        if (error) throw error

        // Add the new appointment to the state
        this.appointments.unshift(data)
        return data
      } catch (e: any) {
        this.error = e.message
        throw e
      } finally {
        this.loading = false
      }
    },

    async cancelAppointment(id: string) {
      try {
        this.loading = true
        this.error = null

        const { error } = await supabase
          .from('appointments')
          .delete()
          .eq('id', id)

        if (error) throw error

        // Remove the appointment from the state
        this.appointments = this.appointments.filter(a => a.id !== id)
      } catch (e: any) {
        this.error = e.message
        throw e
      } finally {
        this.loading = false
      }
    }
  }
}) 