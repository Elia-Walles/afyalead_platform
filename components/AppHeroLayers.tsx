import { APP_HERO_BACKGROUND_URI, APP_HERO_GRADIENT_COLORS } from '@/constants/app-background';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

/**
 * Shared full-bleed photo + green gradient — use on every major screen for one AfyaLead look.
 */
export function AppHeroLayers() {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Image
        source={{ uri: APP_HERO_BACKGROUND_URI }}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        transition={200}
      />
      <LinearGradient
        colors={[...APP_HERO_GRADIENT_COLORS]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
    </View>
  );
}
