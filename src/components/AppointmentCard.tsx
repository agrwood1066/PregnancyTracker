import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { Appointment } from '@/types';
import { theme } from '@/constants/theme';

interface AppointmentCardProps {
  appointment: Appointment;
  onReminderToggle?: (appointmentId: string, reminderId: string) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onReminderToggle,
}) => {
  const navigation = useNavigation();
  const paperTheme = useTheme();

  const handlePress = () => {
    navigation.navigate('AppointmentDetail', { appointmentId: appointment.id });
  };

  const formattedDate = format(new Date(appointment.dateTime), 'PPP');
  const formattedTime = format(new Date(appointment.dateTime), 'p');

  return (
    <Card style={styles.card} onPress={handlePress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{appointment.title}</Text>
            <Text style={styles.type}>{appointment.appointmentType}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.date}>{formattedDate}</Text>
            <Text style={styles.time}>{formattedTime}</Text>
          </View>
        </View>

        {appointment.location && (
          <View style={styles.locationContainer}>
            <IconButton icon="map-marker" size={16} iconColor={theme.colors.gray[600]} />
            <Text style={styles.location}>{appointment.location}</Text>
          </View>
        )}

        {appointment.notes && <Text style={styles.notes}>{appointment.notes}</Text>}

        {appointment.reminders.length > 0 && (
          <View style={styles.remindersContainer}>
            <Text style={styles.remindersTitle}>Reminders:</Text>
            {appointment.reminders.map((reminder) => (
              <View key={reminder.id} style={styles.reminder}>
                <Text style={styles.reminderTime}>
                  {reminder.minutesBefore} minutes before
                </Text>
                {onReminderToggle && (
                  <IconButton
                    icon={reminder.isActive ? 'bell' : 'bell-off'}
                    size={16}
                    onPress={() => onReminderToggle(appointment.id, reminder.id)}
                    iconColor={reminder.isActive ? theme.colors.primary : theme.colors.gray[400]}
                  />
                )}
              </View>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  titleContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.primary,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  type: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.secondary,
    color: theme.colors.gray[600],
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.primary,
    color: theme.colors.primary,
  },
  time: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.secondary,
    color: theme.colors.gray[600],
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  location: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.secondary,
    color: theme.colors.gray[700],
    marginLeft: -theme.spacing.sm,
  },
  notes: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.secondary,
    color: theme.colors.gray[700],
    marginBottom: theme.spacing.sm,
  },
  remindersContainer: {
    marginTop: theme.spacing.sm,
  },
  remindersTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.primary,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  reminder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
  },
  reminderTime: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.secondary,
    color: theme.colors.gray[700],
  },
}); 