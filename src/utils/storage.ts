import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, ShoppingItem, Appointment, UserPreferences } from '@/types';

const STORAGE_KEYS = {
  SHOPPING_LIST: '@pregnancy_tracker/shopping_list',
  APPOINTMENTS: '@pregnancy_tracker/appointments',
  PREFERENCES: '@pregnancy_tracker/preferences',
};

export const saveShoppingList = async (items: ShoppingItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving shopping list:', error);
    throw error;
  }
};

export const loadShoppingList = async (): Promise<ShoppingItem[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SHOPPING_LIST);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading shopping list:', error);
    return [];
  }
};

export const saveAppointments = async (appointments: Appointment[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  } catch (error) {
    console.error('Error saving appointments:', error);
    throw error;
  }
};

export const loadAppointments = async (): Promise<Appointment[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading appointments:', error);
    return [];
  }
};

export const savePreferences = async (preferences: UserPreferences): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving preferences:', error);
    throw error;
  }
};

export const loadPreferences = async (): Promise<UserPreferences | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading preferences:', error);
    return null;
  }
};

export const saveAppState = async (state: AppState): Promise<void> => {
  try {
    await Promise.all([
      saveShoppingList(state.shoppingList.items),
      saveAppointments(state.appointments.items),
      savePreferences(state.preferences),
    ]);
  } catch (error) {
    console.error('Error saving app state:', error);
    throw error;
  }
};

export const loadAppState = async (): Promise<Partial<AppState>> => {
  try {
    const [shoppingList, appointments, preferences] = await Promise.all([
      loadShoppingList(),
      loadAppointments(),
      loadPreferences(),
    ]);

    return {
      shoppingList: {
        items: shoppingList,
        categories: Array.from(
          new Set(shoppingList.map((item) => item.category))
        ),
        loading: false,
        error: null,
      },
      appointments: {
        items: appointments,
        categories: Array.from(
          new Set(appointments.map((apt) => apt.appointmentType))
        ),
        loading: false,
        error: null,
      },
      preferences: preferences || {
        theme: 'system',
        notifications: {
          enabled: true,
          appointmentReminders: true,
          shoppingListUpdates: true,
        },
        currency: 'GBP',
        language: 'en',
      },
    };
  } catch (error) {
    console.error('Error loading app state:', error);
    throw error;
  }
};

export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.SHOPPING_LIST,
      STORAGE_KEYS.APPOINTMENTS,
      STORAGE_KEYS.PREFERENCES,
    ]);
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
}; 