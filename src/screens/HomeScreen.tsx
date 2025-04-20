import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, useTheme as usePaperTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '@/store';
import { useTheme } from '@/providers/ThemeProvider';
import { theme } from '@/constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { theme: appTheme } = useTheme();
  const paperTheme = usePaperTheme();
  
  // Get shopping items from Redux store
  const shoppingItems = useAppSelector((state) => state.shoppingList.items);
  const starredItems = shoppingItems.filter((item) => 
    item.priceOptions.some((po) => po.isStarred)
  );
  
  // Get appointments from Redux store
  const appointments = useAppSelector((state) => state.appointments.items);
  
  // Sort appointments by date and get the next 3 upcoming appointments
  const upcomingAppointments = [...appointments]
    .filter(apt => new Date(apt.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const handleAddItem = () => {
    navigation.navigate('ShoppingItemDetail', { itemId: 'new' });
  };

  const handleViewShoppingList = () => {
    navigation.navigate('ShoppingList');
  };

  const handleViewAppointments = () => {
    navigation.navigate('Appointments');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: appTheme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={[styles.welcomeText, { color: appTheme.colors.text }]}>
          Welcome to Pregnancy Tracker
        </Text>
        <Text style={[styles.subtitle, { color: appTheme.colors.gray[600] }]}>
          Track your pregnancy journey with ease
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: appTheme.colors.primary }]}
          onPress={handleAddItem}
        >
          <Icon name="plus" size={24} color="white" />
          <Text style={styles.actionText}>Add Item</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: appTheme.colors.secondary }]}
          onPress={handleViewShoppingList}
        >
          <Icon name="cart" size={24} color="white" />
          <Text style={styles.actionText}>Shopping List</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: appTheme.colors.accent }]}
          onPress={handleViewAppointments}
        >
          <Icon name="calendar" size={24} color="white" />
          <Text style={styles.actionText}>Appointments</Text>
        </TouchableOpacity>
      </View>

      {/* Shopping Summary */}
      <Card style={[styles.card, { backgroundColor: appTheme.colors.surface }]}>
        <Card.Title 
          title="Shopping List" 
          right={(props) => (
            <Button 
              mode="text" 
              onPress={handleViewShoppingList}
              textColor={appTheme.colors.primary}
            >
              View All
            </Button>
          )}
        />
        <Card.Content>
          <Text style={[styles.summaryText, { color: appTheme.colors.text }]}>
            {shoppingItems.length} items in your shopping list
          </Text>
          <Text style={[styles.summaryText, { color: appTheme.colors.text }]}>
            {starredItems.length} items with preferred prices
          </Text>
        </Card.Content>
      </Card>

      {/* Upcoming Appointments */}
      <Card style={[styles.card, { backgroundColor: appTheme.colors.surface }]}>
        <Card.Title 
          title="Upcoming Appointments" 
          right={(props) => (
            <Button 
              mode="text" 
              onPress={handleViewAppointments}
              textColor={appTheme.colors.primary}
            >
              View All
            </Button>
          )}
        />
        <Card.Content>
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentItem}>
                <View>
                  <Text style={[styles.appointmentTitle, { color: appTheme.colors.text }]}>
                    {appointment.title}
                  </Text>
                  <Text style={[styles.appointmentDetails, { color: appTheme.colors.gray[600] }]}>
                    {new Date(appointment.date).toLocaleDateString()} at {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <Text style={[styles.appointmentDetails, { color: appTheme.colors.gray[600] }]}>
                    {appointment.doctor}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: appTheme.colors.gray[500] }]}>
              No upcoming appointments
            </Text>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  welcomeSection: {
    marginBottom: theme.spacing.lg,
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xs,
  },
  actionText: {
    color: 'white',
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  card: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  summaryText: {
    fontSize: theme.typography.fontSize.md,
    marginBottom: theme.spacing.xs,
  },
  appointmentItem: {
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  appointmentTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing.xs,
  },
  appointmentDetails: {
    fontSize: theme.typography.fontSize.sm,
    marginBottom: theme.spacing.xs,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: theme.spacing.md,
  },
});

export default HomeScreen; 