import { Stack } from 'expo-router';

export default function BritamLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="quote" />
    </Stack>
  );
}
