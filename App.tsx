import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { store } from '@/store';
import { Navigation } from '@/navigation';
import { theme } from '@/constants/theme';
import { useAppSelector } from '@/store';

const AppContent = () => {
  const { theme: themePreference } = useAppSelector((state) => state.preferences);

  return (
    <PaperProvider theme={theme.paperTheme}>
      <SafeAreaProvider>
        <StatusBar style={themePreference === 'dark' ? 'light' : 'dark'} />
        <Navigation />
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default function App() {
  return (
    <StoreProvider store={store}>
      <AppContent />
    </StoreProvider>
  );
} 