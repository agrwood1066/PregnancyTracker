import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@/providers/ThemeProvider';
import MainTabNavigator from './MainTabNavigator';
import ShoppingItemDetailScreen from '@/screens/ShoppingItemDetailScreen';
import AppointmentDetailScreen from '@/screens/AppointmentDetailScreen';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          cardStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ShoppingItemDetail"
          component={ShoppingItemDetailScreen}
          options={{ title: 'Shopping Item' }}
        />
        <Stack.Screen
          name="AppointmentDetail"
          component={AppointmentDetailScreen}
          options={{ title: 'Appointment' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator; 