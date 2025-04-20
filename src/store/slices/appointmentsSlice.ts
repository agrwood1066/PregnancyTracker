import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appointment, Reminder } from '@/types';

// Define the Appointment type
export interface Appointment {
  id: string;
  title: string;
  date: string; // ISO string format
  doctor: string;
  location: string;
  notes?: string;
  type: string;
  reminders: Reminder[];
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
}

// Define the AppointmentsState interface
interface AppointmentsState {
  items: Appointment[];
  categories: string[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AppointmentsState = {
  items: [],
  categories: ['Medical', 'Check-up', 'Scan', 'Class', 'Other'],
  loading: false,
  error: null,
};

// Create the appointments slice
const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Add a new appointment
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.items.push(action.payload);
    },
    
    // Update an existing appointment
    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    
    // Delete an appointment
    deleteAppointment: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    
    // Set all appointments (useful for loading from storage or API)
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.items = action.payload;
    },
    
    // Clear all appointments
    clearAppointments: (state) => {
      state.items = [];
    },
    
    addReminder: (state, action: PayloadAction<{ appointmentId: string; reminder: Reminder }>) => {
      const appointment = state.items.find(item => item.id === action.payload.appointmentId);
      if (appointment) {
        if (!appointment.reminders) {
          appointment.reminders = [];
        }
        appointment.reminders.push(action.payload.reminder);
      }
    },
    updateReminder: (
      state,
      action: PayloadAction<{ appointmentId: string; reminder: Reminder }>
    ) => {
      const appointment = state.items.find((item) => item.id === action.payload.appointmentId);
      if (appointment) {
        const index = appointment.reminders.findIndex(
          (reminder) => reminder.id === action.payload.reminder.id
        );
        if (index !== -1) {
          appointment.reminders[index] = action.payload.reminder;
        }
      }
    },
    deleteReminder: (
      state,
      action: PayloadAction<{ appointmentId: string; reminderId: string }>
    ) => {
      const appointment = state.items.find(item => item.id === action.payload.appointmentId);
      if (appointment && appointment.reminders) {
        appointment.reminders = appointment.reminders.filter(
          reminder => reminder.id !== action.payload.reminderId
        );
      }
    },
    toggleReminderActive: (
      state,
      action: PayloadAction<{ appointmentId: string; reminderId: string }>
    ) => {
      const appointment = state.items.find(item => item.id === action.payload.appointmentId);
      if (appointment && appointment.reminders) {
        const reminder = appointment.reminders.find(r => r.id === action.payload.reminderId);
        if (reminder) {
          reminder.isActive = !reminder.isActive;
        }
      }
    },
    addCategory: (state, action: PayloadAction<string>) => {
      if (!state.categories.includes(action.payload)) {
        state.categories.push(action.payload);
      }
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter((category) => category !== action.payload);
    },
  },
});

// Export actions
export const {
  setLoading,
  setError,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  setAppointments,
  clearAppointments,
  addReminder,
  updateReminder,
  deleteReminder,
  toggleReminderActive,
  addCategory,
  removeCategory,
} = appointmentsSlice.actions;

// Export reducer
export default appointmentsSlice.reducer; 