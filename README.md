# Event Counter - Event Tracker App

A React Native mobile application built with Expo for tracking and counting personal events. Users can create custom events with icons and colors, record occurrences with timestamps, view analytics with charts and heatmaps, and manage their event history.

**App Store**: https://apps.apple.com/us/app/id6755982968

## Features

- Create and manage custom events with personalized icons and colors
- Track event occurrences with timestamps and optional comments
- View event history in chronological timeline
- Analytics dashboard with monthly bar charts and activity heatmaps
- Favorite events for quick access
- Data export/import functionality
- Dark mode support
- Persistent data storage using AsyncStorage

## Tech Stack

- **React Native** (0.81.5) with **Expo** (~54.0)
- **TypeScript** for type safety
- **Expo Router** for file-based navigation
- **Zustand** for state management
- **React Native Reanimated** for animations
- **React Native Gifted Charts** for data visualization

## Project Structure

```
├── app/              # Expo Router screens and modals
├── components/       # Reusable React components
├── zustand/          # Zustand store for state management
├── utils/            # Utility functions
├── interfaces/       # TypeScript type definitions
└── constants/        # Theme constants and styling
```

## Getting Started

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
