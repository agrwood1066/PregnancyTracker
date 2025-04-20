import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Text, FAB, Card, IconButton, Button, useTheme as usePaperTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/providers/ThemeProvider';
import { theme } from '@/constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppDispatch, useAppSelector } from '@/store';
import { deleteAppointment } from '@/store/slices/appointmentsSlice';

const AppointmentsScreen = () => {
  const navigation = useNavigation();
  const { theme: appTheme } = useTheme();
  const paperTheme = usePaperTheme();
  const dispatch = useAppDispatch();
  
  // Get appointments from Redux store
  const appointments = useAppSelector((state) => state.appointments.items);
  const [filter, setFilter] = useState<string | null>(null);
  
  // Filter appointments by type
  const filteredAppointments = filter 
    ? appointments.filter(apt => apt.type === filter)
    : appointments;
  
  // Get unique appointment types for filter chips
  const appointmentTypes = Array.from(new Set(appointments.map(apt => apt.type)));
  
  const handleAddAppointment = () => {
    navigation.navigate('AppointmentDetail', { appointmentId: 'new' });
  };
  
  const handleEditAppointment = (appointmentId: string) => {
    navigation.navigate('AppointmentDetail', { appointmentId });
  };
  
  const handleDeleteAppointment = (appointmentId: string) => {
    dispatch(deleteAppointment(appointmentId));
  };
  
  const renderAppointmentCard = useCallback(({ item }) => (
    <Card 
      style={[styles.appointmentCard, { backgroundColor: appTheme.colors.surface }]}
      onPress={() => handleEditAppointment(item.id)}
    >
      <Card.Content>
        <View style={styles.appointmentHeader}>
          <View style={styles.appointmentTitleContainer}>
            <Text style={[styles.appointmentTitle, { color: appTheme.colors.text }]}>
              {item.title}
            </Text>
            <View style={[styles.typeBadge, { backgroundColor: appTheme.colors.primary + '20' }]}>
              <Text style={[styles.typeText, { color: appTheme.colors.primary }]}>
                {item.type}
              </Text>
            </View>
          </View>
          <IconButton
            icon="delete"
            size={20}
            onPress={() => handleDeleteAppointment(item.id)}
            iconColor={appTheme.colors.error}
          />
        </View>
        
        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={16} color={appTheme.colors.gray[500]} />
            <Text style={[styles.detailText, { color: appTheme.colors.text }]}>
              {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="doctor" size={16} color={appTheme.colors.gray[500]} />
            <Text style={[styles.detailText, { color: appTheme.colors.text }]}>
              {item.doctor}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="map-marker" size={16} color={appTheme.colors.gray[500]} />
            <Text style={[styles.detailText, { color: appTheme.colors.text }]}>
              {item.location}
            </Text>
          </View>
        </View>
        
        {item.notes && (
          <View style={styles.notesContainer}>
            <Text style={[styles.notesLabel, { color: appTheme.colors.gray[600] }]}>
              Notes:
            </Text>
            <Text style={[styles.notesText, { color: appTheme.colors.text }]}>
              {item.notes}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  ), [appTheme, handleEditAppointment, handleDeleteAppointment]);

  return (
    <View style={[styles.container, { backgroundColor: appTheme.colors.background }]}>
      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              !filter && { backgroundColor: appTheme.colors.primary }
            ]}
            onPress={() => setFilter(null)}
          >
            <Text
              style={[
                styles.filterText,
                !filter && { color: 'white' }
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          {appointmentTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterChip,
                filter === type && { backgroundColor: appTheme.colors.primary }
              ]}
              onPress={() => setFilter(type)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === type && { color: 'white' }
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <FlatList
          data={filteredAppointments}
          renderItem={renderAppointmentCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="calendar-blank" size={64} color={appTheme.colors.gray[400]} />
          <Text style={[styles.emptyText, { color: appTheme.colors.gray[600] }]}>
            No appointments found
          </Text>
          <Button
            mode="contained"
            onPress={handleAddAppointment}
            style={styles.addButton}
          >
            Add Appointment
          </Button>
        </View>
      )}
      
      {/* FAB for adding new appointments */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: appTheme.colors.primary }]}
        onPress={handleAddAppointment}
        color="white"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.gray[200],
  },
  filterText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  appointmentCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  appointmentTitleContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  appointmentTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xs,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.sm,
  },
  typeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  appointmentDetails: {
    marginBottom: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  detailText: {
    fontSize: theme.typography.fontSize.sm,
    marginLeft: theme.spacing.sm,
  },
  notesContainer: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
  },
  notesLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing.xs,
  },
  notesText: {
    fontSize: theme.typography.fontSize.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    marginVertical: theme.spacing.md,
    textAlign: 'center',
  },
  addButton: {
    marginTop: theme.spacing.md,
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.md,
    right: 0,
    bottom: 0,
  },
});

export default AppointmentsScreen; 