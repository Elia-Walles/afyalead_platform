import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette } from '@/constants/design-tokens';

export type AppToastType = 'success' | 'error' | 'info';

type ToastPayload = {
  message: string;
  type?: AppToastType;
  durationMs?: number;
};

type Ctx = (p: ToastPayload) => void;

const ToastContext = createContext<Ctx>(() => {});

export function useAppToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [kind, setKind] = useState<AppToastType>('info');
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -8, duration: 180, useNativeDriver: true }),
    ]).start(() => setVisible(false));
  }, [opacity, translateY]);

  const show = useCallback(
    (p: ToastPayload) => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setMessage(p.message);
      setKind(p.type ?? 'info');
      setVisible(true);
      opacity.setValue(0);
      translateY.setValue(-12);
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, friction: 8, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
      const ms = p.durationMs ?? 3200;
      hideTimer.current = setTimeout(() => {
        hide();
      }, ms);
    },
    [hide, opacity, translateY]
  );

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const iconName = useMemo(() => {
    if (kind === 'success') return 'check-circle';
    if (kind === 'error') return 'alert-circle';
    return 'information-outline';
  }, [kind]);

  const iconColor = useMemo(() => {
    if (kind === 'success') return '#10b981';
    if (kind === 'error') return '#f87171';
    return '#38bdf8';
  }, [kind]);

  const value = useMemo(() => show, [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {visible ? (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.wrap,
            {
              paddingTop: insets.top + 8,
              opacity,
              transform: [{ translateY }],
            },
          ]}
        >
          <Pressable style={styles.card} onPress={hide}>
            <MaterialCommunityIcons name={iconName} size={22} color={iconColor} />
            <Text style={styles.msg}>{message}</Text>
          </Pressable>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 9999,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    maxWidth: 400,
    width: '100%',
    backgroundColor: 'rgba(15,23,42,0.92)',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: { elevation: 12 },
      default: {},
    }),
  },
  msg: {
    flex: 1,
    color: palette.surface,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});
