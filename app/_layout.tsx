import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modalEvent" options={{ presentation: 'modal', title: 'Event' }} />
        <Stack.Screen name="modalAddEvent" options={{ presentation: 'modal', title: 'Add event' }} />
        <Stack.Screen name="modalCreateEvent" options={{ presentation: 'modal', title: 'Create event' }} />
        <Stack.Screen name="modalSettings" options={{ presentation: 'modal', title: 'Settings' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
