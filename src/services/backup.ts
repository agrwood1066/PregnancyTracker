import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '@store/store';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// Keys for AsyncStorage
const BACKUP_ENABLED_KEY = '@backup_enabled';
const LAST_BACKUP_TIME_KEY = '@last_backup_time';

// iCloud backup directory
const BACKUP_DIRECTORY = `${FileSystem.documentDirectory}backups/`;

export const initializeBackup = async () => {
  try {
    // Create backup directory if it doesn't exist
    const dirInfo = await FileSystem.getInfoAsync(BACKUP_DIRECTORY);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(BACKUP_DIRECTORY, { intermediates: true });
    }
    return true;
  } catch (error) {
    console.error('Failed to initialize backup:', error);
    return false;
  }
};

export const isBackupEnabled = async (): Promise<boolean> => {
  try {
    const enabled = await AsyncStorage.getItem(BACKUP_ENABLED_KEY);
    return enabled === 'true';
  } catch (error) {
    console.error('Failed to check backup status:', error);
    return false;
  }
};

export const setBackupEnabled = async (enabled: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(BACKUP_ENABLED_KEY, enabled.toString());
  } catch (error) {
    console.error('Failed to set backup status:', error);
  }
};

export const getLastBackupTime = async (): Promise<Date | null> => {
  try {
    const time = await AsyncStorage.getItem(LAST_BACKUP_TIME_KEY);
    return time ? new Date(time) : null;
  } catch (error) {
    console.error('Failed to get last backup time:', error);
    return null;
  }
};

export const backupData = async (state: RootState): Promise<boolean> => {
  try {
    // Prepare data for backup
    const backupData = {
      appointments: state.appointments.items,
      shoppingList: state.shoppingList.items,
      lastBackup: new Date().toISOString(),
    };
    
    // Create backup file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${BACKUP_DIRECTORY}backup-${timestamp}.json`;
    
    // Write backup file
    await FileSystem.writeAsStringAsync(
      backupPath,
      JSON.stringify(backupData, null, 2)
    );
    
    // Update last backup time
    await AsyncStorage.setItem(LAST_BACKUP_TIME_KEY, new Date().toISOString());
    
    return true;
  } catch (error) {
    console.error('Failed to backup data:', error);
    return false;
  }
};

export const restoreData = async (): Promise<Partial<RootState> | null> => {
  try {
    // Get the most recent backup file
    const files = await FileSystem.readDirectoryAsync(BACKUP_DIRECTORY);
    const backupFiles = files
      .filter(file => file.endsWith('.json'))
      .sort()
      .reverse();
    
    if (backupFiles.length === 0) {
      return null;
    }
    
    const latestBackup = backupFiles[0];
    const backupPath = `${BACKUP_DIRECTORY}${latestBackup}`;
    
    // Read and parse backup file
    const backupContent = await FileSystem.readAsStringAsync(backupPath);
    const data = JSON.parse(backupContent);
    
    return {
      appointments: {
        items: data.appointments || [],
        loading: false,
        error: null,
      },
      shoppingList: {
        items: data.shoppingList || [],
        loading: false,
        error: null,
      },
    };
  } catch (error) {
    console.error('Failed to restore data:', error);
    return null;
  }
};

export const shareBackup = async (): Promise<string | null> => {
  try {
    const files = await FileSystem.readDirectoryAsync(BACKUP_DIRECTORY);
    const backupFiles = files
      .filter(file => file.endsWith('.json'))
      .sort()
      .reverse();
    
    if (backupFiles.length === 0) {
      return null;
    }
    
    const latestBackup = backupFiles[0];
    const backupPath = `${BACKUP_DIRECTORY}${latestBackup}`;
    
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(backupPath);
      return backupPath;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to share backup:', error);
    return null;
  }
}; 