import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: undefined;
  ShoppingItemDetail: { itemId: string };
  AppointmentDetail: { appointmentId: string };
};

export type MainTabParamList = {
  Home: undefined;
  ShoppingList: undefined;
  Appointments: undefined;
  Settings: undefined;
}; 