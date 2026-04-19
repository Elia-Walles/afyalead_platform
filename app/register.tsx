import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppToast } from '@/components/app-toast';
import { APP_HERO_BACKGROUND_URI } from '@/constants/app-background';
import { useMockApp } from '@/context/mock-app-context';

const GREEN_DEEP = '#047857';
const GREEN = '#059669';
const ORANGE = '#f97316';
const PIN_LEN = 4;

export default function RegisterScreen() {
  const { width: winW } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setMemberPin } = useMockApp();
  const toast = useAppToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const name = fullName.trim();
    const em = email.trim();
    const phone = mobile.trim();

    if (!name || !em || !phone || !password) {
      toast({ type: 'error', message: 'Fill all fields' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      toast({ type: 'error', message: 'Invalid email' });
      return;
    }
    if (password.length !== PIN_LEN || !/^\d+$/.test(password)) {
      toast({ type: 'error', message: `PIN: ${PIN_LEN} digits` });
      return;
    }
    if (password !== confirm) {
      toast({ type: 'error', message: 'PINs do not match' });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setMemberPin(password);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast({ type: 'success', message: 'Account created' });
      setTimeout(() => router.replace('/'), 900);
    }, 700);
  };

  const contactSideBySide = winW >= 400;

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="light" />
      <Image source={{ uri: APP_HERO_BACKGROUND_URI }} style={styles.fullBg} contentFit="cover" transition={200} />
      <LinearGradient
        colors={['rgba(6,30,24,0.5)', 'rgba(4,72,56,0.78)', 'rgba(4,48,40,0.92)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + 10,
            paddingBottom: insets.bottom + 28,
            flexGrow: 1,
            justifyContent: 'center',
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sheet}>
          <Pressable style={styles.backRow} onPress={() => router.back()} hitSlop={12} disabled={submitting}>
            <View style={styles.backPill}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
            </View>
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <Text style={styles.title}>Create account</Text>

          <View style={styles.card}>
            <Field label="Name" value={fullName} onChangeText={setFullName} placeholder="Full name" autoCapitalize="words" />
            {contactSideBySide ? (
              <View style={styles.rowPair}>
                <View style={styles.halfCol}>
                  <Field label="Email" value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" autoCapitalize="none" />
                </View>
                <View style={styles.halfCol}>
                  <Field label="Mobile" value={mobile} onChangeText={setMobile} placeholder="Phone" keyboardType="phone-pad" />
                </View>
              </View>
            ) : (
              <>
                <Field label="Email" value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" autoCapitalize="none" />
                <Field label="Mobile" value={mobile} onChangeText={setMobile} placeholder="Phone" keyboardType="phone-pad" />
              </>
            )}

            <View style={styles.divider} />

            <Field
              label="PIN"
              value={password}
              onChangeText={setPassword}
              placeholder="4 digits"
              pinDigits
            />
            <Field label="Confirm PIN" value={confirm} onChangeText={setConfirm} placeholder="4 digits" pinDigits />

            <Pressable
              style={({ pressed }) => [styles.primaryBtn, (pressed || submitting) && { opacity: 0.9 }]}
              onPress={submit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.primaryBtnText}>Register</Text>
                  <MaterialCommunityIcons name="check-circle-outline" size={22} color="#fff" />
                </>
              )}
            </Pressable>

            <Pressable onPress={() => router.replace('/')} disabled={submitting} style={styles.footerPress}>
              <Text style={styles.footerLinkBold}>Sign in</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secure,
  pinDigits,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  secure?: boolean;
  pinDigits?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'words' | 'sentences';
}) {
  const handleChange = (t: string) => {
    if (pinDigits) {
      onChangeText(t.replace(/\D/g, '').slice(0, PIN_LEN));
    } else {
      onChangeText(t);
    }
  };

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        secureTextEntry={pinDigits || secure}
        keyboardType={pinDigits ? 'number-pad' : keyboardType ?? 'default'}
        maxLength={pinDigits ? PIN_LEN : undefined}
        autoCapitalize={pinDigits ? 'none' : autoCapitalize ?? 'sentences'}
        autoCorrect={false}
        style={styles.input}
      />
    </View>
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
  scroll: {
    paddingHorizontal: 18,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  sheet: {
    width: '100%',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  backPill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 15,
    fontWeight: '700',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.4,
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingVertical: 22,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.95)',
    ...Platform.select({
      ios: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.1, shadowRadius: 24 },
      android: { elevation: 10 },
      default: {},
    }),
  },
  rowPair: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  halfCol: {
    flex: 1,
    minWidth: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 16,
  },
  fieldWrap: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 6,
    letterSpacing: 0.15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 11,
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  primaryBtn: {
    marginTop: 18,
    minHeight: 52,
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  footerPress: {
    marginTop: 16,
    paddingVertical: 4,
    alignItems: 'center',
  },
  footerLinkBold: {
    color: ORANGE,
    fontWeight: '800',
    fontSize: 15,
  },
});
