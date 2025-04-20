import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as StoreProvider } from 'react-redux';
import { store } from '@store/store';
import { ThemeProvider } from '@providers/ThemeProvider';
import { RootNavigator } from '@navigation';
import { useAutoBackup } from '@hooks/useAutoBackup';
import { initializeBackup } from '@services/backup';

const AppContent = () => {
  useAutoBackup();
  
  useEffect(() => {
    initializeBackup();
  }, []);
  
  return <RootNavigator />;
};

const App = () => {
  return (
    <StoreProvider store={store}>
      <ThemeProvider>
        <PaperProvider>
          <NavigationContainer>
            <AppContent />
          </NavigationContainer>
        </PaperProvider>
      </ThemeProvider>
    </StoreProvider>
  );
};

export default App; 