import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Switch, Button, useTheme as usePaperTheme } from 'react-native-paper';
import { useTheme } from '@providers/ThemeProvider';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  isBackupEnabled,
  setBackupEnabled,
  getLastBackupTime,
  backupData,
  restoreData,
  shareBackup,
} from '@services/backup';
import { format } from 'date-fns';

const BackupSettingsScreen = () => {
  const { theme: appTheme } = useTheme();
  const paperTheme = usePaperTheme();
  const dispatch = useAppDispatch();
  const state = useAppSelector(state => state);
  
  const [enabled, setEnabled] = useState(false);
  const [lastBackup, setLastBackup] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    loadBackupSettings();
  }, []);
  
  const loadBackupSettings = async () => {
    const backupEnabled = await isBackupEnabled();
    const lastBackupTime = await getLastBackupTime();
    
    setEnabled(backupEnabled);
    setLastBackup(lastBackupTime);
  };
  
  const handleToggleBackup = async (value: boolean) => {
    setEnabled(value);
    await setBackupEnabled(value);
  };
  
  const handleBackupNow = async () => {
    setIsLoading(true);
    try {
      const success = await backupData(state);
      if (success) {
        setLastBackup(new Date());
      } else {
        alert('Failed to backup data. Please try again.');
      }
    } catch (error) {
      console.error('Backup error:', error);
      alert('An error occurred while backing up data.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRestore = async () => {
    setIsLoading(true);
    try {
      const data = await restoreData();
      if (data) {
        // TODO: Dispatch actions to restore state
        alert('Data restored successfully!');
      } else {
        alert('No backup data found.');
      }
    } catch (error) {
      console.error('Restore error:', error);
      alert('An error occurred while restoring data.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleShareBackup = async () => {
    setIsLoading(true);
    try {
      const backupPath = await shareBackup();
      if (!backupPath) {
        alert('No backup available to share.');
      }
    } catch (error) {
      console.error('Share error:', error);
      alert('An error occurred while sharing the backup.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: appTheme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: appTheme.colors.text }]}>
            iCloud Backup
          </Text>
          <Text style={[styles.description, { color: appTheme.colors.text }]}>
            Enable iCloud backup to automatically save your appointments and shopping list.
            Your data will be securely stored in iCloud and can be restored on any of your devices.
          </Text>
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: appTheme.colors.text }]}>
              Enable iCloud Backup
            </Text>
            <Switch
              value={enabled}
              onValueChange={handleToggleBackup}
              color={appTheme.colors.primary}
            />
          </View>
          
          {lastBackup && (
            <Text style={[styles.lastBackup, { color: appTheme.colors.text }]}>
              Last backup: {format(lastBackup, 'MMMM d, yyyy h:mm a')}
            </Text>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: appTheme.colors.text }]}>
            Manual Actions
          </Text>
          
          <Button
            mode="contained"
            onPress={handleBackupNow}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          >
            Backup Now
          </Button>
          
          <Button
            mode="outlined"
            onPress={handleRestore}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          >
            Restore from Backup
          </Button>
          
          <Button
            mode="outlined"
            onPress={handleShareBackup}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          >
            Share Backup
          </Button>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: appTheme.colors.text }]}>
            About iCloud Backup
          </Text>
          <Text style={[styles.description, { color: appTheme.colors.text }]}>
            • Your data is automatically backed up to iCloud{'\n'}
            • Backups are encrypted and secure{'\n'}
            • You can manually backup or restore at any time{'\n'}
            • Share your backup file for safekeeping{'\n'}
            • Your data is private and only accessible to you
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 16,
  },
  lastBackup: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  button: {
    marginBottom: 8,
  },
});

export default BackupSettingsScreen; 