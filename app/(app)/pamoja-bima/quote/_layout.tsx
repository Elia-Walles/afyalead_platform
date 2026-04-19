import { Stack } from 'expo-router';

export default function PamojaQuoteLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="new" />
      <Stack.Screen name="payment" />
    </Stack>
  );
}
