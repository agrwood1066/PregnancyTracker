import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Appointment, Reminder } from '@/types';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#F8B3D1',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

export const scheduleAppointmentReminder = async (
  appointment: Appointment,
  reminder: Reminder
): Promise<string | null> => {
  try {
    const appointmentDate = new Date(appointment.dateTime);
    const reminderDate = new Date(
      appointmentDate.getTime() - reminder.minutesBefore * 60 * 1000
    );

    // Don't schedule if the reminder time is in the past
    if (reminderDate.getTime() <= Date.now()) {
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Appointment Reminder',
        body: `${appointment.title} is in ${reminder.minutesBefore} minutes`,
        data: {
          appointmentId: appointment.id,
          reminderId: reminder.id,
        },
      },
      trigger: {
        date: reminderDate,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

export const cancelAppointmentReminder = async (notificationId: string): Promise<boolean> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    return true;
  } catch (error) {
    console.error('Error canceling notification:', error);
    return false;
  }
};

export const cancelAllReminders = async (): Promise<boolean> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return true;
  } catch (error) {
    console.error('Error canceling all notifications:', error);
    return false;
  }
};

export const getScheduledNotifications = async (): Promise<Notifications.NotificationRequest[]> => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

export const updateAppointmentReminder = async (
  appointment: Appointment,
  reminder: Reminder,
  oldNotificationId: string
): Promise<string | null> => {
  try {
    // Cancel the old notification
    await cancelAppointmentReminder(oldNotificationId);

    // Schedule the new notification
    return await scheduleAppointmentReminder(appointment, reminder);
  } catch (error) {
    console.error('Error updating notification:', error);
    return null;
  }
}; 