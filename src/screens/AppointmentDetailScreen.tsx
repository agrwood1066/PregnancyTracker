import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, useTheme as usePaperTheme, Chip, IconButton, Card } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/providers/ThemeProvider';
import { theme } from '@/constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppDispatch, useAppSelector } from '@/store';
import { addAppointment, updateAppointment, deleteAppointment, addReminder, deleteReminder, toggleReminderActive } from '@/store/slices/appointmentsSlice';
import { v4 as uuidv4 } from 'uuid';
import { useReminders } from '@hooks/useReminders';
import { format } from 'date-fns';

// Appointment types
const appointmentTypes = [
  { label: 'Checkup', value: 'Checkup' },
  { label: 'Ultrasound', value: 'Ultrasound' },
  { label: 'Test', value: 'Test' },
  { label: 'Class', value: 'Class' },
  { label: 'Other', value: 'Other' },
];

// Reminder options in minutes
const reminderOptions = [
  { label: '15m', value: 15 },
  { label: '30m', value: 30 },
  { label: '1h', value: 60 },
  { label: '1d', value: 1440 },
  { label: '2d', value: 2880 },
];

const REMINDER_OPTIONS = [
  { label: '15 minutes before', value: 15 },
  { label: '30 minutes before', value: 30 },
  { label: '1 hour before', value: 60 },
  { label: '1 day before', value: 1440 },
];

const AppointmentDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme: appTheme } = useTheme();
  const paperTheme = usePaperTheme();
  const dispatch = useAppDispatch();
  
  // Get appointments from Redux store
  const appointments = useAppSelector((state) => state.appointments.items);
  
  // Get appointment ID from route params, 'new' for creating a new appointment
  const appointmentId = route.params?.appointmentId || 'new';
  
  // State for form fields
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [doctor, setDoctor] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [type, setType] = useState('Checkup');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // State for reminders
  const [reminders, setReminders] = useState<Array<{ id: string; minutesBefore: number; isActive: boolean }>>([]);
  const [newReminderMinutes, setNewReminderMinutes] = useState(30);

  const appointment = useAppSelector(state => selectAppointmentById(state, appointmentId));
  const {
    addReminder: useRemindersAddReminder,
    deleteReminder: useRemindersDeleteReminder,
    toggleReminder: useRemindersToggleReminder,
    scheduleAllReminders,
    cancelAllReminders,
  } = useReminders(appointmentId);

  const [selectedReminderTime, setSelectedReminderTime] = useState(30);
  
  // Load appointment data if editing
  useEffect(() => {
    if (appointmentId !== 'new') {
      const appointment = appointments.find(apt => apt.id === appointmentId);
      if (appointment) {
        setTitle(appointment.title);
        setDate(new Date(appointment.date));
        setDoctor(appointment.doctor);
        setLocation(appointment.location);
        setNotes(appointment.notes || '');
        setType(appointment.type);
        
        // Load reminders if they exist
        if (appointment.reminders && appointment.reminders.length > 0) {
          setReminders(appointment.reminders);
        }
      }
    }
  }, [appointmentId, appointments]);
  
  useEffect(() => {
    if (appointment) {
      navigation.setOptions({
        title: appointment.title,
        headerRight: () => (
          <IconButton
            icon="pencil"
            onPress={() => navigation.navigate('EditAppointment', { appointmentId })}
          />
        ),
      });
    }
  }, [appointment, navigation]);
  
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Preserve the time when changing the date
      const newDate = new Date(date);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setDate(newDate);
    }
  };
  
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      // Preserve the date when changing the time
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };
  
  const handleAddReminder = async () => {
    await useRemindersAddReminder(selectedReminderTime);
  };
  
  const handleDeleteReminder = async (reminderId: string) => {
    await useRemindersDeleteReminder(reminderId);
  };
  
  const handleToggleReminder = async (reminderId: string) => {
    await useRemindersToggleReminder(reminderId);
  };
  
  const formatReminderTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes before`;
    } else if (minutes === 60) {
      return '1 hour before';
    } else if (minutes < 1440) {
      return `${Math.floor(minutes / 60)} hours before`;
    } else {
      return `${Math.floor(minutes / 1440)} day${Math.floor(minutes / 1440) > 1 ? 's' : ''} before`;
    }
  };
  
  const handleSave = () => {
    // Validate form
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (!doctor.trim()) {
      alert('Please enter a doctor name');
      return;
    }
    
    if (!location.trim()) {
      alert('Please enter a location');
      return;
    }
    
    const now = new Date().toISOString();
    const appointmentData = {
      id: appointmentId === 'new' ? uuidv4() : appointmentId,
      title,
      date: date.toISOString(),
      doctor,
      location,
      notes,
      type,
      reminders,
      createdAt: appointmentId === 'new' ? now : appointments.find(apt => apt.id === appointmentId)?.createdAt || now,
      updatedAt: now,
    };
    
    if (appointmentId === 'new') {
      dispatch(addAppointment(appointmentData));
    } else {
      dispatch(updateAppointment(appointmentData));
    }
    
    navigation.goBack();
  };
  
  const handleDelete = () => {
    if (appointmentId !== 'new') {
      dispatch(deleteAppointment(appointmentId));
    }
    navigation.goBack();
  };
  
  if (!appointment) {
    return (
      <View style={[styles.container, { backgroundColor: appTheme.colors.background }]}>
        <Text>Appointment not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: appTheme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: appTheme.colors.text }]}>
                Appointment Details
              </Text>
              <View style={styles.detailRow}>
                <Icon name="calendar" size={24} color={appTheme.colors.primary} />
                <Text style={[styles.detailText, { color: appTheme.colors.text }]}>
                  {format(new Date(appointment.date), 'MMMM d, yyyy')}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="clock" size={24} color={appTheme.colors.primary} />
                <Text style={[styles.detailText, { color: appTheme.colors.text }]}>
                  {format(new Date(appointment.date), 'h:mm a')}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="doctor" size={24} color={appTheme.colors.primary} />
                <Text style={[styles.detailText, { color: appTheme.colors.text }]}>
                  {appointment.doctor}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="map-marker" size={24} color={appTheme.colors.primary} />
                <Text style={[styles.detailText, { color: appTheme.colors.text }]}>
                  {appointment.location}
                </Text>
              </View>
              {appointment.notes && (
                <View style={styles.notesContainer}>
                  <Text style={[styles.notesLabel, { color: appTheme.colors.text }]}>Notes:</Text>
                  <Text style={[styles.notesText, { color: appTheme.colors.text }]}>
                    {appointment.notes}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: appTheme.colors.text }]}>
                Reminders
              </Text>
              {reminders.length > 0 ? (
                reminders.map(reminder => (
                  <View key={reminder.id} style={styles.reminderItem}>
                    <View style={styles.reminderInfo}>
                      <Icon
                        name={reminder.isActive ? 'bell' : 'bell-off'}
                        size={24}
                        color={reminder.isActive ? appTheme.colors.primary : appTheme.colors.gray[500]}
                      />
                      <Text style={[styles.reminderText, { color: appTheme.colors.text }]}>
                        {formatReminderTime(reminder.minutesBefore)}
                      </Text>
                    </View>
                    <View style={styles.reminderActions}>
                      <IconButton
                        icon={reminder.isActive ? 'bell-off' : 'bell'}
                        size={20}
                        onPress={() => handleToggleReminder(reminder.id)}
                      />
                      <IconButton
                        icon="delete"
                        size={20}
                        onPress={() => handleDeleteReminder(reminder.id)}
                      />
                    </View>
                  </View>
                ))
              ) : (
                <Text style={[styles.noRemindersText, { color: appTheme.colors.text }]}>
                  No reminders set
                </Text>
              )}

              <View style={styles.addReminderContainer}>
                <Text style={[styles.addReminderLabel, { color: appTheme.colors.text }]}>
                  Add Reminder:
                </Text>
                <View style={styles.reminderOptions}>
                  {REMINDER_OPTIONS.map(option => (
                    <Button
                      key={option.value}
                      mode={selectedReminderTime === option.value ? 'contained' : 'outlined'}
                      onPress={() => setSelectedReminderTime(option.value)}
                      style={styles.reminderOption}
                    >
                      {option.label}
                    </Button>
                  ))}
                </View>
                <Button
                  mode="contained"
                  onPress={handleAddReminder}
                  style={styles.addButton}
                >
                  Add Reminder
                </Button>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  card: {
    margin: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    marginLeft: 12,
  },
  notesContainer: {
    marginTop: 16,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 16,
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderText: {
    fontSize: 16,
    marginLeft: 12,
  },
  reminderActions: {
    flexDirection: 'row',
  },
  noRemindersText: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  addReminderContainer: {
    marginTop: 16,
  },
  addReminderLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  reminderOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  reminderOption: {
    margin: 4,
  },
  addButton: {
    marginTop: 8,
  },
});

export default AppointmentDetailScreen; 