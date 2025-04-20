import { format, parseISO, isValid, isBefore, isAfter, addMinutes } from 'date-fns';

export const formatDateTime = (dateTime: string | Date): string => {
  try {
    const date = typeof dateTime === 'string' ? parseISO(dateTime) : dateTime;
    if (!isValid(date)) {
      throw new Error('Invalid date');
    }
    return format(date, 'PPP p');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const formatDate = (date: string | Date): string => {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) {
      throw new Error('Invalid date');
    }
    return format(parsedDate, 'PPP');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const formatTime = (date: string | Date): string => {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) {
      throw new Error('Invalid date');
    }
    return format(parsedDate, 'p');
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid time';
  }
};

export const isDateInPast = (date: string | Date): boolean => {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) {
      throw new Error('Invalid date');
    }
    return isBefore(parsedDate, new Date());
  } catch (error) {
    console.error('Error checking if date is in past:', error);
    return true;
  }
};

export const isDateInFuture = (date: string | Date): boolean => {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) {
      throw new Error('Invalid date');
    }
    return isAfter(parsedDate, new Date());
  } catch (error) {
    console.error('Error checking if date is in future:', error);
    return false;
  }
};

export const getReminderTime = (appointmentTime: string | Date, minutesBefore: number): Date => {
  try {
    const appointmentDate = typeof appointmentTime === 'string' ? parseISO(appointmentTime) : appointmentTime;
    if (!isValid(appointmentDate)) {
      throw new Error('Invalid appointment date');
    }
    return addMinutes(appointmentDate, -minutesBefore);
  } catch (error) {
    console.error('Error calculating reminder time:', error);
    return new Date();
  }
};

export const formatReminderTime = (minutesBefore: number): string => {
  if (minutesBefore < 60) {
    return `${minutesBefore} minutes`;
  } else if (minutesBefore < 1440) {
    const hours = Math.floor(minutesBefore / 60);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  } else {
    const days = Math.floor(minutesBefore / 1440);
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  }
};

export const getTimeUntil = (date: string | Date): string => {
  try {
    const targetDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(targetDate)) {
      throw new Error('Invalid date');
    }

    const now = new Date();
    const diffInMinutes = Math.floor((targetDate.getTime() - now.getTime()) / (1000 * 60));

    if (diffInMinutes < 0) {
      return 'In the past';
    }

    return formatReminderTime(diffInMinutes);
  } catch (error) {
    console.error('Error calculating time until:', error);
    return 'Invalid date';
  }
};

export const parseDateTimeString = (dateTimeString: string): Date | null => {
  try {
    const date = parseISO(dateTimeString);
    return isValid(date) ? date : null;
  } catch (error) {
    console.error('Error parsing date time string:', error);
    return null;
  }
};

export const isValidDateTimeString = (dateTimeString: string): boolean => {
  try {
    const date = parseISO(dateTimeString);
    return isValid(date);
  } catch (error) {
    return false;
  }
}; 