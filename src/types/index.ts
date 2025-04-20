/**
 * Represents a price option for a shopping item
 */
export interface PriceOption {
  id: string;
  store: string;
  price: string;
  isStarred: boolean;
}

/**
 * Represents a shopping item with its details and price options
 */
export interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  notes: string;
  priceOptions: PriceOption[];
}

/**
 * Navigation types for the app
 */
export type RootStackParamList = {
  Home: undefined;
  ShoppingList: undefined;
  ShoppingItemDetail: { itemId: string };
  Settings: undefined;
};

/**
 * Theme types for consistent styling
 */
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  gray: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeTypography {
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  fontFamily: {
    primary: string;
    secondary: string;
  };
  fontWeight: {
    regular: string;
    medium: string;
    bold: string;
  };
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    round: number;
  };
  shadows: {
    sm: object;
    md: object;
    lg: object;
  };
}

export interface Appointment {
  id: string;
  title: string;
  appointmentType: string;
  location: string;
  notes?: string;
  dateTime: string;
  created: string;
  updated: string;
  reminders: Reminder[];
}

export interface Reminder {
  id: string;
  minutesBefore: number;
  notificationId: string;
  isActive: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    enabled: boolean;
    appointmentReminders: boolean;
    shoppingListUpdates: boolean;
  };
  currency: string;
  language: string;
}

export interface AppState {
  shoppingList: {
    items: ShoppingItem[];
    categories: string[];
    loading: boolean;
    error: string | null;
  };
  appointments: {
    items: Appointment[];
    categories: string[];
    loading: boolean;
    error: string | null;
  };
  preferences: UserPreferences;
}

export type TabParamList = {
  Home: undefined;
  Shopping: undefined;
  Appointments: undefined;
  Settings: undefined;
}; 