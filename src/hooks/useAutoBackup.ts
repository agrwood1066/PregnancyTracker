import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppSelector } from '@store/hooks';
import { isBackupEnabled, backupData } from '@services/backup';

export const useAutoBackup = () => {
  const state = useAppSelector(state => state);
  
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        const enabled = await isBackupEnabled();
        if (enabled) {
          try {
            await backupData(state);
          } catch (error) {
            console.error('Auto backup failed:', error);
          }
        }
      }
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, [state]);
}; 