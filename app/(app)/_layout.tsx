import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ScoopedTabBar } from '@/components/banking/ScoopedTabBar';
import { palette } from '@/constants/design-tokens';

export default function AppShellLayout() {
  return (
    <View style={styles.root}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: palette.bg },
        }}
      >
        <Stack.Screen name="home" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="transactions" />
        <Stack.Screen name="cards" />
        <Stack.Screen name="favourites" />
        <Stack.Screen name="qr" />
      </Stack>
      <ScoopedTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
