import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import shoppingListReducer from './slices/shoppingListSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import preferencesReducer from './slices/preferencesSlice';

export const store = configureStore({
  reducer: {
    shoppingList: shoppingListReducer,
    appointments: appointmentsReducer,
    preferences: preferencesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['appointments/setDateTime'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.dateTime'],
        // Ignore these paths in the state
        ignoredPaths: ['appointments.items.dateTime'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 