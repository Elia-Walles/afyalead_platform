import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ToastProvider } from '@/components/app-toast';
import { palette } from '@/constants/design-tokens';
import { MockAppProvider } from '@/context/mock-app-context';

export default function RootLayout() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: palette.bg,
      primary: '#1B8D4A',
      card: '#FFFFFF',
      text: '#0E2A1A',
      border: '#C8E4D2',
    },
  };

  return (
    <MockAppProvider>
      <ThemeProvider value={theme}>
        <ToastProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: palette.bg },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="register" />
            <Stack.Screen name="(app)" />
            <Stack.Screen name="microfinance" />
            <Stack.Screen name="pamoja-bima" />
            <Stack.Screen
              name="modal"
              options={{ presentation: 'modal', title: 'Modal', animation: 'slide_from_bottom' }}
            />
          </Stack>
          <StatusBar style="dark" />
        </ToastProvider>
      </ThemeProvider>
    </MockAppProvider>
  );
}
