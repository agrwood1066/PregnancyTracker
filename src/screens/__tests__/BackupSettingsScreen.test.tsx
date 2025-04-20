import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import BackupSettingsScreen from '../BackupSettingsScreen';
import {
  isBackupEnabled,
  setBackupEnabled,
  getLastBackupTime,
  backupData,
  restoreData,
  shareBackup,
} from '@services/backup';

// Mock the backup service
jest.mock('@services/backup', () => ({
  isBackupEnabled: jest.fn(),
  setBackupEnabled: jest.fn(),
  getLastBackupTime: jest.fn(),
  backupData: jest.fn(),
  restoreData: jest.fn(),
  shareBackup: jest.fn(),
}));

// Mock the theme provider
jest.mock('@providers/ThemeProvider', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        background: '#ffffff',
        text: '#000000',
        primary: '#007AFF',
      },
    },
  }),
}));

describe('BackupSettingsScreen', () => {
  const mockStore = configureStore({
    reducer: {
      appointments: (state = { items: [] }) => state,
      shoppingList: (state = { items: [] }) => state,
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (isBackupEnabled as jest.Mock).mockResolvedValue(false);
    (getLastBackupTime as jest.Mock).mockResolvedValue(null);
  });

  const renderScreen = () => {
    return render(
      <Provider store={mockStore}>
        <BackupSettingsScreen />
      </Provider>
    );
  };

  it('should render correctly', async () => {
    const { getByText } = renderScreen();

    await waitFor(() => {
      expect(getByText('iCloud Backup')).toBeTruthy();
      expect(getByText('Enable iCloud Backup')).toBeTruthy();
      expect(getByText('Backup Now')).toBeTruthy();
      expect(getByText('Restore from Backup')).toBeTruthy();
      expect(getByText('Share Backup')).toBeTruthy();
    });
  });

  it('should toggle backup enabled status', async () => {
    const { getByText } = renderScreen();
    const switchComponent = getByText('Enable iCloud Backup').parent?.parent;

    await waitFor(() => {
      expect(switchComponent).toBeTruthy();
    });

    fireEvent(switchComponent, 'valueChange', true);

    expect(setBackupEnabled).toHaveBeenCalledWith(true);
  });

  it('should show last backup time when available', async () => {
    const mockDate = new Date('2024-01-01T12:00:00Z');
    (getLastBackupTime as jest.Mock).mockResolvedValue(mockDate);

    const { getByText } = renderScreen();

    await waitFor(() => {
      expect(getByText(/Last backup:/)).toBeTruthy();
    });
  });

  it('should handle backup now action', async () => {
    (backupData as jest.Mock).mockResolvedValue(true);

    const { getByText } = renderScreen();

    await waitFor(() => {
      expect(getByText('Backup Now')).toBeTruthy();
    });

    fireEvent.press(getByText('Backup Now'));

    await waitFor(() => {
      expect(backupData).toHaveBeenCalled();
    });
  });

  it('should handle restore action', async () => {
    const mockData = {
      appointments: { items: [] },
      shoppingList: { items: [] },
    };
    (restoreData as jest.Mock).mockResolvedValue(mockData);

    const { getByText } = renderScreen();

    await waitFor(() => {
      expect(getByText('Restore from Backup')).toBeTruthy();
    });

    fireEvent.press(getByText('Restore from Backup'));

    await waitFor(() => {
      expect(restoreData).toHaveBeenCalled();
    });
  });

  it('should handle share backup action', async () => {
    (shareBackup as jest.Mock).mockResolvedValue('mock-backup-path');

    const { getByText } = renderScreen();

    await waitFor(() => {
      expect(getByText('Share Backup')).toBeTruthy();
    });

    fireEvent.press(getByText('Share Backup'));

    await waitFor(() => {
      expect(shareBackup).toHaveBeenCalled();
    });
  });

  it('should handle backup failure', async () => {
    (backupData as jest.Mock).mockResolvedValue(false);

    const { getByText } = renderScreen();

    await waitFor(() => {
      expect(getByText('Backup Now')).toBeTruthy();
    });

    fireEvent.press(getByText('Backup Now'));

    await waitFor(() => {
      expect(getByText('Failed to backup data. Please try again.')).toBeTruthy();
    });
  });

  it('should handle restore failure', async () => {
    (restoreData as jest.Mock).mockResolvedValue(null);

    const { getByText } = renderScreen();

    await waitFor(() => {
      expect(getByText('Restore from Backup')).toBeTruthy();
    });

    fireEvent.press(getByText('Restore from Backup'));

    await waitFor(() => {
      expect(getByText('No backup data found.')).toBeTruthy();
    });
  });
}); 