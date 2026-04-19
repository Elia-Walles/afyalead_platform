import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Pressable, StyleSheet, View } from 'react-native';

import { HOME_SLIDE_URIS } from '@/constants/home-slides';

const { width: SCREEN_W } = Dimensions.get('window');
const SLIDE_INTERVAL_MS = 4500;

type Props = {
  height: number;
};

export function HeaderSlideshow({ height }: Props) {
  const [index, setIndex] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const t = setInterval(() => {
      Animated.timing(fade, {
        toValue: 0.35,
        duration: 280,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        setIndex((i) => (i + 1) % HOME_SLIDE_URIS.length);
        Animated.timing(fade, {
          toValue: 1,
          duration: 420,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }).start();
      });
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(t);
  }, [fade]);

  return (
    <View style={[styles.wrap, { height }]}>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fade }]}>
        <Image
          source={{ uri: HOME_SLIDE_URIS[index] }}
          style={styles.img}
          contentFit="cover"
          transition={300}
        />
      </Animated.View>
      <View style={styles.dots}>
        {HOME_SLIDE_URIS.map((_, i) => (
          <Pressable key={String(i)} onPress={() => setIndex(i)} hitSlop={8}>
            <View style={[styles.dot, i === index && styles.dotActive]} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: SCREEN_W,
    alignSelf: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  dots: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 20,
  },
});
