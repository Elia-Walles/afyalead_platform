import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppToast } from '@/components/app-toast';
import { APP_HERO_BACKGROUND_URI, APP_HERO_GRADIENT_COLORS } from '@/constants/app-background';
import { useMockApp } from '@/context/mock-app-context';

/** AfyaLead green + white theme (replaces former blue). */
const GREEN = '#059669';
const GREEN_DEEP = '#047857';
const ORANGE = '#f97316';

export default function LoginScreen() {
  const { width: SW, height: SH } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { memberPin } = useMockApp();
  const toast = useAppToast();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const busy = useRef(false);

  /** Safe viewport height; bottom panel gets a bit more than top so everything fits without scroll. */
  const safeH = SH - insets.top - insets.bottom;
  const cardPadX = 20;
  const colGap = 12;
  const rowGap = 10;
  const innerW = SW - cardPadX * 2;
  /** PIN panel height (flex 5 of 9). Keypad+register share one centered block below the header. */
  const pinPanelH = (safeH * 5) / 9;
  const reservedTop = 76;
  const reservedForRegisterBlock = 72;
  const availKeypadH = Math.max(104, pinPanelH - reservedTop - reservedForRegisterBlock);
  const keyFromH = Math.floor((availKeypadH - 3 * rowGap) / 4);
  /** Three equal columns across full width; keys sized to cell minus padding. */
  const cellMax = Math.floor((innerW - 2 * colGap) / 3);
  const keySize = Math.max(38, Math.min(56, Math.min(keyFromH, cellMax - 10)));

  const append = useCallback(
    (d: string) => {
      if (verifying || pin.length >= 4) return;
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPin((p) => (p.length >= 4 ? p : p + d));
    },
    [pin.length, verifying]
  );

  const backspace = useCallback(() => {
    if (verifying) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPin((p) => p.slice(0, -1));
  }, [verifying]);

  const toggleShowPin = useCallback(() => {
    if (verifying) return;
    void Haptics.selectionAsync();
    setShowPin((v) => !v);
  }, [verifying]);

  useEffect(() => {
    if (pin.length !== 4 || busy.current) return;
    busy.current = true;
    setVerifying(true);
    const t = setTimeout(() => {
      if (pin === memberPin) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        toast({ type: 'success', message: 'Signed in', durationMs: 1400 });
        setVerifying(false);
        busy.current = false;
        setTimeout(() => router.replace('/home'), 320);
      } else {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        toast({ type: 'error', message: 'Wrong PIN' });
        setPin('');
        setVerifying(false);
        busy.current = false;
      }
    }, 420);
    return () => clearTimeout(t);
  }, [pin, memberPin, router, toast]);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <Image
        source={{ uri: APP_HERO_BACKGROUND_URI }}
        style={styles.fullBg}
        contentFit="cover"
        transition={200}
      />
      <LinearGradient
        colors={[...APP_HERO_GRADIENT_COLORS]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <View style={[styles.screenColumn, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {/* Top spacer — full-bleed photo continues behind the white card */}
        <View style={styles.heroHalf}>
          <View style={styles.heroNotch} />
        </View>

        {/* Bottom: PIN card (flex 5) — all content visible, no scroll */}
        <View style={styles.pinHalf}>
          <View style={styles.patternLayer} pointerEvents="none">
            {(
              [
                ['bank-outline', 48, 8, 16],
                ['shield-check', 52, 36, 96],
                ['cellphone', 44, 72, 180],
                ['calculator-variant', 50, 100, 24],
              ] as const
            ).map(([icon, size, top, left], i) => (
              <MaterialCommunityIcons
                key={i}
                name={icon}
                size={size}
                color="#cbd5e1"
                style={[styles.patternIcon, { top, left, opacity: 0.04 }]}
              />
            ))}
          </View>

          <View style={styles.pinInner}>
            <View style={styles.pinTopSection}>
              <View style={styles.greetingBlock}>
                <Text style={styles.hi}>Hi member,</Text>
                <Text style={styles.sub}>PIN</Text>
              </View>

              <View style={[styles.pinRowFull, { gap: colGap }]} accessibilityRole="none">
                {[0, 1, 2, 3].map((i) => {
                  const has = i < pin.length;
                  const char = has ? (showPin ? pin[i] : '•') : '';
                  return (
                    <View key={i} style={styles.pinSlotFlex}>
                      <View style={styles.pinSlotInner}>
                        <Text
                          style={[styles.pinChar, has && styles.pinCharActive]}
                          accessibilityLabel={has ? (showPin ? `Digit ${pin[i]}` : 'Entered') : 'Empty'}
                        >
                          {char}
                        </Text>
                        <View style={[styles.pinUnderline, has && styles.pinUnderlineFilled]} />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Keypad + register: one block, vertically centered in remaining space (no stray gap above Register) */}
            <View style={styles.bottomSplit}>
              <View style={[styles.keypadBlock, { gap: rowGap }]}>
                {(
                  [
                    ['1', '2', '3'],
                    ['4', '5', '6'],
                    ['7', '8', '9'],
                  ] as const
                ).map((row) => (
                  <View key={row.join('')} style={[styles.keypadRowFull, { gap: colGap }]}>
                    {row.map((n) => (
                      <View key={n} style={styles.keypadCell}>
                        <Pressable
                          style={({ pressed }) => [
                            styles.keyCircle,
                            {
                              width: keySize,
                              height: keySize,
                              borderRadius: keySize / 2,
                            },
                            pressed && styles.keyPressed,
                          ]}
                          onPress={() => append(n)}
                        >
                          <Text style={[styles.keyNum, keySize < 48 && styles.keyNumMd]}>{n}</Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                ))}

                <View style={[styles.keypadRowFull, { gap: colGap }]}>
                  <View style={styles.keypadCell}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.keyEye,
                        {
                          width: keySize,
                          height: keySize,
                          borderRadius: Math.round(keySize * 0.2),
                          borderColor: GREEN_DEEP,
                        },
                        pressed && styles.keyPressed,
                      ]}
                      onPress={toggleShowPin}
                      accessibilityLabel={showPin ? 'Hide PIN' : 'Show PIN'}
                      accessibilityRole="button"
                    >
                      <MaterialCommunityIcons
                        name={showPin ? 'eye-off-outline' : 'eye-outline'}
                        size={Math.min(28, keySize * 0.48)}
                        color={GREEN_DEEP}
                      />
                    </Pressable>
                  </View>
                  <View style={styles.keypadCell}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.keyCircle,
                        {
                          width: keySize,
                          height: keySize,
                          borderRadius: keySize / 2,
                        },
                        pressed && styles.keyPressed,
                      ]}
                      onPress={() => append('0')}
                    >
                      <Text style={[styles.keyNum, keySize < 48 && styles.keyNumMd]}>0</Text>
                    </Pressable>
                  </View>
                  <View style={styles.keypadCell}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.keyDelete,
                        {
                          width: keySize,
                          height: Math.round(keySize * 0.78),
                          borderRadius: 12,
                        },
                        pressed && styles.keyPressed,
                      ]}
                      onPress={backspace}
                    >
                      <MaterialCommunityIcons name="backspace-outline" size={Math.min(24, keySize * 0.38)} color="#fff" />
                    </Pressable>
                  </View>
                </View>
              </View>

              <View style={styles.registerSection}>
                <Text style={styles.registerHint}>Don&apos;t have an account?</Text>
                <Pressable
                  style={({ pressed }) => [styles.registerBtn, pressed && { opacity: 0.92 }]}
                  disabled={verifying}
                  onPress={() => {
                    if (verifying) return;
                    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push('/register');
                  }}
                >
                  <MaterialCommunityIcons name="account-plus-outline" size={20} color="#fff" />
                  <Text style={styles.registerBtnText}>Register</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
      {verifying ? (
        <View style={styles.loadingOverlay} pointerEvents="auto">
          <ActivityIndicator size="large" color={GREEN} />
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: GREEN_DEEP,
  },
  fullBg: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  screenColumn: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  heroHalf: {
    flex: 4,
    width: '100%',
    minHeight: 0,
    overflow: 'visible',
    backgroundColor: 'transparent',
  },
  heroNotch: {
    position: 'absolute',
    bottom: -1,
    alignSelf: 'center',
    width: 48,
    height: 14,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#ffffff',
  },
  pinHalf: {
    flex: 5,
    minHeight: 0,
    width: '100%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    marginTop: -12,
    paddingHorizontal: 0,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: { elevation: 6 },
      default: {},
    }),
  },
  patternLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  patternIcon: {
    position: 'absolute',
  },
  pinInner: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 8,
    justifyContent: 'flex-start',
    zIndex: 2,
  },
  pinTopSection: {
    backgroundColor: '#ffffff',
    flexShrink: 0,
    zIndex: 2,
    paddingBottom: 4,
    width: '100%',
  },
  /** Fills space below greeting + PIN row; keypad + register centered together (no huge gap). */
  bottomSplit: {
    flex: 1,
    minHeight: 0,
    width: '100%',
    justifyContent: 'center',
    gap: 14,
    zIndex: 2,
  },
  greetingBlock: {
    zIndex: 2,
    marginBottom: 2,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  hi: {
    fontSize: 18,
    fontWeight: '800',
    color: '#14532d',
    zIndex: 1,
    textAlign: 'center',
  },
  sub: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    zIndex: 1,
    lineHeight: 18,
    textAlign: 'center',
  },
  pinRowFull: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    marginTop: 10,
    zIndex: 2,
  },
  pinSlotFlex: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
  },
  pinSlotInner: {
    width: '100%',
    maxWidth: 72,
    minHeight: 44,
    paddingBottom: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  pinChar: {
    fontSize: 20,
    fontWeight: '800',
    color: 'transparent',
    minHeight: 26,
    lineHeight: 26,
    textAlign: 'center',
  },
  pinCharActive: {
    color: '#14532d',
  },
  pinUnderline: {
    height: 3,
    width: '100%',
    minWidth: 40,
    borderRadius: 2,
    backgroundColor: '#e2e8f0',
  },
  pinUnderlineFilled: {
    backgroundColor: GREEN_DEEP,
  },
  keypadBlock: {
    flexShrink: 0,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    zIndex: 2,
    backgroundColor: '#ffffff',
  },
  keypadRowFull: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  keypadCell: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyCircle: {
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
  keyNum: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  keyNumMd: {
    fontSize: 17,
  },
  /** Show/hide PIN — eye icon, green outline + white fill */
  keyEye: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
  },
  keyDelete: {
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerSection: {
    flexShrink: 0,
    paddingTop: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 2,
    backgroundColor: '#ffffff',
  },
  registerHint: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    backgroundColor: GREEN_DEEP,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
      default: {},
    }),
  },
  registerBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
