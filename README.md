# Pregnancy Management App

A comprehensive React Native application for pregnancy management, featuring a clean, minimalist interface with pastel colors and elegant typography.

## Features

- 📝 Dynamic Shopping List with price tracking
- 📅 Appointment Tracker with notifications
- 🎨 Beautiful, accessible UI with pastel colors
- ☁️ iCloud backup with sharing capabilities
- 📱 iOS TestFlight distribution ready

## Technical Stack

- React Native with Expo
- Redux for state management
- AsyncStorage for local data
- Expo FileSystem for iCloud backup
- React Navigation v6
- React Native Paper components
- Jest and React Native Testing Library for testing

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS development environment (for TestFlight distribution)
- Apple Developer Account (for TestFlight distribution)

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd PregnancyTracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on iOS simulator:
```bash
npm run ios
```

## Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use ESLint for code linting
- Follow React Native best practices

### Project Structure
```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── navigation/     # Navigation configuration
├── store/         # Redux store and slices
├── services/      # Business logic and API calls
├── hooks/         # Custom React hooks
├── providers/     # Context providers
└── test/          # Test setup and utilities
```

### State Management
- Redux for global state
- Context API for theme
- Local state for component-specific data

### Testing
Run tests using:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Deployment

### TestFlight Distribution
1. Update `eas.json` with your Apple Developer credentials:
   - `appleId`: Your Apple ID email
   - `ascAppId`: Your App Store Connect App ID
   - `appleTeamId`: Your Apple Team ID

2. Build for TestFlight:
```bash
npm run build:ios:testflight
```

3. Submit to TestFlight:
```bash
npm run submit:testflight
```

### iCloud Backup
The app uses iCloud for backup and restore functionality:
- Automatic backup to iCloud
- Manual backup and restore options
- Share backup files for safekeeping
- Backup settings in the app

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Fonts: Poppins and Lato (properly licensed)
- Icons: Material Design Icons
- Color palette inspired by Headspace and Headway apps