import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, useTheme as usePaperTheme, IconButton } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@providers/ThemeProvider';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { updateAppointment, deleteAppointment, selectAppointmentById } from '@store/slices/appointmentsSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

const APPOINTMENT_TYPES = [
  { label: 'Checkup', value: 'Checkup' },
  { label: 'Ultrasound', value: 'Ultrasound' },
  { label: 'Test', value: 'Test' },
  { label: 'Class', value: 'Class' },
  { label: 'Other', value: 'Other' },
];

const EditAppointmentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme: appTheme } = useTheme();
  const paperTheme = usePaperTheme();
  const dispatch = useAppDispatch();
  
  const appointmentId = route.params?.appointmentId;
  const appointment = useAppSelector(state => selectAppointmentById(state, appointmentId));
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [doctor, setDoctor] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [type, setType] = useState('Checkup');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  useEffect(() => {
    if (appointment) {
      setTitle(appointment.title);
      setDate(new Date(appointment.date));
      setDoctor(appointment.doctor);
      setLocation(appointment.location);
      setNotes(appointment.notes || '');
      setType(appointment.type);
      
      navigation.setOptions({
        title: 'Edit Appointment',
      });
    }
  }, [appointment, navigation]);
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setDate(newDate);
    }
  };
  
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };
  
  const handleSave = () => {
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
    
    const updatedAppointment = {
      ...appointment,
      title: title.trim(),
      date: date.toISOString(),
      doctor: doctor.trim(),
      location: location.trim(),
      notes: notes.trim(),
      type,
      updatedAt: new Date().toISOString(),
    };
    
    dispatch(updateAppointment(updatedAppointment));
    navigation.goBack();
  };
  
  const handleDelete = () => {
    if (appointment) {
      dispatch(deleteAppointment(appointment.id));
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
        <View style={styles.formContainer}>
          {/* Title */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: appTheme.colors.text }]}>
              Title
            </Text>
            <TextInput
              mode="outlined"
              value={title}
              onChangeText={setTitle}
              placeholder="Enter appointment title"
              style={styles.input}
            />
          </View>
          
          {/* Date and Time */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: appTheme.colors.text }]}>
              Date & Time
            </Text>
            <View style={styles.dateTimeContainer}>
              <Button 
                mode="outlined" 
                onPress={() => setShowDatePicker(true)}
                style={styles.dateButton}
                icon="calendar"
              >
                {format(date, 'MMMM d, yyyy')}
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => setShowTimePicker(true)}
                style={styles.timeButton}
                icon="clock"
              >
                {format(date, 'h:mm a')}
              </Button>
            </View>
            
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
            
            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>
          
          {/* Doctor */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: appTheme.colors.text }]}>
              Doctor
            </Text>
            <TextInput
              mode="outlined"
              value={doctor}
              onChangeText={setDoctor}
              placeholder="Enter doctor name"
              style={styles.input}
              left={<TextInput.Icon icon="doctor" />}
            />
          </View>
          
          {/* Location */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: appTheme.colors.text }]}>
              Location
            </Text>
            <TextInput
              mode="outlined"
              value={location}
              onChangeText={setLocation}
              placeholder="Enter location"
              style={styles.input}
              left={<TextInput.Icon icon="map-marker" />}
            />
          </View>
          
          {/* Type */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: appTheme.colors.text }]}>
              Type
            </Text>
            <SegmentedButtons
              value={type}
              onValueChange={setType}
              buttons={APPOINTMENT_TYPES.map(type => ({
                value: type.value,
                label: type.label,
              }))}
              style={styles.segmentedButtons}
            />
          </View>
          
          {/* Notes */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: appTheme.colors.text }]}>
              Notes
            </Text>
            <TextInput
              mode="outlined"
              value={notes}
              onChangeText={setNotes}
              placeholder="Enter notes (optional)"
              style={styles.notesInput}
              multiline
              numberOfLines={4}
            />
          </View>
          
          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleSave}
              style={[styles.saveButton, { backgroundColor: appTheme.colors.primary }]}
            >
              Save Changes
            </Button>
            
            <Button
              mode="outlined"
              onPress={handleDelete}
              style={styles.deleteButton}
              textColor={appTheme.colors.error}
            >
              Delete Appointment
            </Button>
          </View>
        </View>
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
  formContainer: {
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'transparent',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateButton: {
    flex: 1,
    marginRight: 8,
  },
  timeButton: {
    flex: 1,
    marginLeft: 8,
  },
  segmentedButtons: {
    marginTop: 8,
  },
  notesInput: {
    backgroundColor: 'transparent',
    height: 100,
  },
  buttonContainer: {
    marginTop: 24,
  },
  saveButton: {
    marginBottom: 16,
  },
  deleteButton: {
    borderColor: 'red',
  },
});

export default EditAppointmentScreen; 