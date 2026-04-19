import { Stack } from 'expo-router';

export default function MicrofinanceLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="apply-loan" />
      <Stack.Screen name="loans" />
      <Stack.Screen name="payments" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
