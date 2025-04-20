import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Appointment, Reminder } from '@store/slices/appointmentsSlice';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
};

export const scheduleAppointmentReminder = async (
  appointment: Appointment,
  reminder: Reminder
): Promise<string> => {
  const trigger = new Date(appointment.date);
  trigger.setMinutes(trigger.getMinutes() - reminder.minutesBefore);

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Appointment Reminder',
      body: `Your appointment "${appointment.title}" is in ${reminder.minutesBefore} minutes`,
      data: { appointmentId: appointment.id, reminderId: reminder.id },
    },
    trigger,
  });

  return identifier;
};

export const cancelReminder = async (notificationId: string): Promise<void> => {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
};

export const scheduleAllReminders = async (appointment: Appointment): Promise<void> => {
  if (!appointment.reminders) return;

  for (const reminder of appointment.reminders) {
    if (reminder.isActive) {
      await scheduleAppointmentReminder(appointment, reminder);
    }
  }
};

export const cancelAllReminders = async (appointment: Appointment): Promise<void> => {
  if (!appointment.reminders) return;

  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  const appointmentNotifications = scheduledNotifications.filter(
    notification => notification.content.data?.appointmentId === appointment.id
  );

  for (const notification of appointmentNotifications) {
    await cancelReminder(notification.identifier);
  }
};

export const setupNotificationListeners = (
  onNotification: (notification: Notifications.Notification) => void
): (() => void) => {
  const subscription = Notifications.addNotificationReceivedListener(onNotification);
  return () => subscription.remove();
}; 