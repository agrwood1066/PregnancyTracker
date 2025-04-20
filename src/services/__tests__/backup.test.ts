import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {
  initializeBackup,
  isBackupEnabled,
  setBackupEnabled,
  getLastBackupTime,
  backupData,
  restoreData,
  shareBackup,
} from '../backup';

describe('Backup Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  describe('initializeBackup', () => {
    it('should create backup directory if it does not exist', async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValueOnce({ exists: false });
      
      await initializeBackup();
      
      expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith(
        `${FileSystem.documentDirectory}backups/`,
        { intermediates: true }
      );
    });

    it('should not create directory if it already exists', async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValueOnce({ exists: true });
      
      await initializeBackup();
      
      expect(FileSystem.makeDirectoryAsync).not.toHaveBeenCalled();
    });
  });

  describe('isBackupEnabled', () => {
    it('should return true when backup is enabled', async () => {
      await AsyncStorage.setItem('@backup_enabled', 'true');
      
      const result = await isBackupEnabled();
      
      expect(result).toBe(true);
    });

    it('should return false when backup is disabled', async () => {
      await AsyncStorage.setItem('@backup_enabled', 'false');
      
      const result = await isBackupEnabled();
      
      expect(result).toBe(false);
    });
  });

  describe('setBackupEnabled', () => {
    it('should set backup enabled status', async () => {
      await setBackupEnabled(true);
      
      const result = await AsyncStorage.getItem('@backup_enabled');
      expect(result).toBe('true');
    });
  });

  describe('getLastBackupTime', () => {
    it('should return null when no backup time is set', async () => {
      const result = await getLastBackupTime();
      
      expect(result).toBeNull();
    });

    it('should return the last backup time', async () => {
      const date = new Date();
      await AsyncStorage.setItem('@last_backup_time', date.toISOString());
      
      const result = await getLastBackupTime();
      
      expect(result).toEqual(date);
    });
  });

  describe('backupData', () => {
    const mockState = {
      appointments: {
        items: [{ id: 1, title: 'Test Appointment' }],
        loading: false,
        error: null,
      },
      shoppingList: {
        items: [{ id: 1, name: 'Test Item' }],
        loading: false,
        error: null,
      },
    };

    it('should create a backup file with the current state', async () => {
      (FileSystem.writeAsStringAsync as jest.Mock).mockResolvedValueOnce(undefined);
      
      const result = await backupData(mockState);
      
      expect(result).toBe(true);
      expect(FileSystem.writeAsStringAsync).toHaveBeenCalled();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@last_backup_time',
        expect.any(String)
      );
    });
  });

  describe('restoreData', () => {
    const mockBackupData = {
      appointments: [{ id: 1, title: 'Test Appointment' }],
      shoppingList: [{ id: 1, name: 'Test Item' }],
    };

    it('should restore data from the most recent backup', async () => {
      (FileSystem.readDirectoryAsync as jest.Mock).mockResolvedValueOnce(['backup-1.json']);
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockBackupData)
      );
      
      const result = await restoreData();
      
      expect(result).toEqual({
        appointments: {
          items: mockBackupData.appointments,
          loading: false,
          error: null,
        },
        shoppingList: {
          items: mockBackupData.shoppingList,
          loading: false,
          error: null,
        },
      });
    });

    it('should return null when no backup files exist', async () => {
      (FileSystem.readDirectoryAsync as jest.Mock).mockResolvedValueOnce([]);
      
      const result = await restoreData();
      
      expect(result).toBeNull();
    });
  });

  describe('shareBackup', () => {
    it('should share the most recent backup file', async () => {
      (FileSystem.readDirectoryAsync as jest.Mock).mockResolvedValueOnce(['backup-1.json']);
      (Sharing.isAvailableAsync as jest.Mock).mockResolvedValueOnce(true);
      (Sharing.shareAsync as jest.Mock).mockResolvedValueOnce(undefined);
      
      const result = await shareBackup();
      
      expect(result).toBe(`${FileSystem.documentDirectory}backups/backup-1.json`);
      expect(Sharing.shareAsync).toHaveBeenCalled();
    });

    it('should return null when sharing is not available', async () => {
      (FileSystem.readDirectoryAsync as jest.Mock).mockResolvedValueOnce(['backup-1.json']);
      (Sharing.isAvailableAsync as jest.Mock).mockResolvedValueOnce(false);
      
      const result = await shareBackup();
      
      expect(result).toBeNull();
      expect(Sharing.shareAsync).not.toHaveBeenCalled();
    });
  });
}); 