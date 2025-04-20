import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Switch, Divider, Text, useTheme as usePaperTheme } from 'react-native-paper';
import { useTheme } from '@/providers/ThemeProvider';
import { theme } from '@/constants/theme';

const SettingsScreen = () => {
  const { theme: appTheme, isDark, setThemeMode } = useTheme();
  const paperTheme = usePaperTheme();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [shoppingListUpdates, setShoppingListUpdates] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: appTheme.colors.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: appTheme.colors.text }]}>Appearance</Text>
        <List.Section>
          <List.Item
            title="Theme"
            description="Choose your preferred theme"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={props => (
              <View style={styles.themeSelector}>
                <Text
                  style={[
                    styles.themeOption,
                    { color: isDark ? appTheme.colors.primary : appTheme.colors.text }
                  ]}
                  onPress={() => handleThemeChange('light')}
                >
                  Light
                </Text>
                <Text
                  style={[
                    styles.themeOption,
                    { color: isDark ? appTheme.colors.primary : appTheme.colors.text }
                  ]}
                  onPress={() => handleThemeChange('dark')}
                >
                  Dark
                </Text>
                <Text
                  style={[
                    styles.themeOption,
                    { color: isDark ? appTheme.colors.primary : appTheme.colors.text }
                  ]}
                  onPress={() => handleThemeChange('system')}
                >
                  System
                </Text>
              </View>
            )}
          />
        </List.Section>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: appTheme.colors.text }]}>Notifications</Text>
        <List.Section>
          <List.Item
            title="Enable Notifications"
            left={props => <List.Icon {...props} icon="bell" />}
            right={props => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color={appTheme.colors.primary}
              />
            )}
          />
          <List.Item
            title="Shopping List Updates"
            description="Get notified when items are added or updated"
            left={props => <List.Icon {...props} icon="cart" />}
            right={props => (
              <Switch
                value={shoppingListUpdates}
                onValueChange={setShoppingListUpdates}
                color={appTheme.colors.primary}
                disabled={!notificationsEnabled}
              />
            )}
          />
          <List.Item
            title="Appointment Reminders"
            description="Get reminded about upcoming appointments"
            left={props => <List.Icon {...props} icon="calendar" />}
            right={props => (
              <Switch
                value={appointmentReminders}
                onValueChange={setAppointmentReminders}
                color={appTheme.colors.primary}
                disabled={!notificationsEnabled}
              />
            )}
          />
        </List.Section>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: appTheme.colors.text }]}>About</Text>
        <List.Section>
          <List.Item
            title="Version"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information" />}
          />
          <List.Item
            title="Privacy Policy"
            left={props => <List.Icon {...props} icon="shield-account" />}
            onPress={() => {/* Navigate to Privacy Policy */}}
          />
          <List.Item
            title="Terms of Service"
            left={props => <List.Icon {...props} icon="file-document" />}
            onPress={() => {/* Navigate to Terms of Service */}}
          />
        </List.Section>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginVertical: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  divider: {
    marginVertical: theme.spacing.sm,
  },
  themeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeOption: {
    marginHorizontal: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
  },
});

export default SettingsScreen; 