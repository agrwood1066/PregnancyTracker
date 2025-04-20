import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  addReminder,
  deleteReminder,
  toggleReminderActive,
  selectAppointmentById,
} from '@store/slices/appointmentsSlice';
import {
  requestNotificationPermissions,
  scheduleAppointmentReminder,
  cancelReminder,
  scheduleAllReminders,
  cancelAllReminders,
} from '@services/notifications';
import { Reminder } from '@store/slices/appointmentsSlice';

export const useReminders = (appointmentId: string) => {
  const dispatch = useAppDispatch();
  const appointment = useAppSelector(state => selectAppointmentById(state, appointmentId));

  const handleAddReminder = useCallback(async (minutesBefore: number) => {
    if (!appointment) return;

    const reminder: Reminder = {
      id: Date.now().toString(),
      minutesBefore,
      isActive: true,
    };

    dispatch(addReminder({ appointmentId, reminder }));
    await scheduleAppointmentReminder(appointment, reminder);
  }, [appointment, appointmentId, dispatch]);

  const handleDeleteReminder = useCallback(async (reminderId: string) => {
    if (!appointment) return;

    const reminder = appointment.reminders?.find(r => r.id === reminderId);
    if (reminder) {
      dispatch(deleteReminder({ appointmentId, reminderId }));
      await cancelReminder(reminderId);
    }
  }, [appointment, appointmentId, dispatch]);

  const handleToggleReminder = useCallback(async (reminderId: string) => {
    if (!appointment) return;

    const reminder = appointment.reminders?.find(r => r.id === reminderId);
    if (reminder) {
      dispatch(toggleReminderActive({ appointmentId, reminderId }));
      
      if (reminder.isActive) {
        await cancelReminder(reminderId);
      } else {
        await scheduleAppointmentReminder(appointment, reminder);
      }
    }
  }, [appointment, appointmentId, dispatch]);

  const handleScheduleAllReminders = useCallback(async () => {
    if (!appointment) return;
    await scheduleAllReminders(appointment);
  }, [appointment]);

  const handleCancelAllReminders = useCallback(async () => {
    if (!appointment) return;
    await cancelAllReminders(appointment);
  }, [appointment]);

  return {
    reminders: appointment?.reminders || [],
    addReminder: handleAddReminder,
    deleteReminder: handleDeleteReminder,
    toggleReminder: handleToggleReminder,
    scheduleAllReminders: handleScheduleAllReminders,
    cancelAllReminders: handleCancelAllReminders,
  };
}; 