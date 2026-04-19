import { Stack } from 'expo-router';

export default function PamojaBimaLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="provider/[id]" />
      <Stack.Screen name="quote/new" />
      <Stack.Screen name="quote/payment" />
      <Stack.Screen name="kyc" />
      <Stack.Screen name="virtual-card" />
      <Stack.Screen name="policies" />
      <Stack.Screen name="quotes" />
      <Stack.Screen name="payments" />
      <Stack.Screen name="claims" />
      <Stack.Screen name="documents" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
