import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserPreferences } from '@/types';

const initialState: UserPreferences = {
  theme: 'system',
  notifications: {
    enabled: true,
    appointmentReminders: true,
    shoppingListUpdates: true,
  },
  currency: 'GBP',
  language: 'en',
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    setNotificationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.notifications.enabled = action.payload;
    },
    setAppointmentReminders: (state, action: PayloadAction<boolean>) => {
      state.notifications.appointmentReminders = action.payload;
    },
    setShoppingListUpdates: (state, action: PayloadAction<boolean>) => {
      state.notifications.shoppingListUpdates = action.payload;
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    resetPreferences: () => initialState,
  },
});

export const {
  setTheme,
  setNotificationsEnabled,
  setAppointmentReminders,
  setShoppingListUpdates,
  setCurrency,
  setLanguage,
  resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer; 