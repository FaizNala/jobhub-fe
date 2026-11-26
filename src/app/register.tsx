import React, { ComponentRef, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Eye, EyeOff } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { AuthLayout } from '@/components/templates/auth-layout';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const passwordInputRef = useRef<ComponentRef<typeof TextInput>>(null);

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.replace('/setup-profile');
    }, 350);
  };

  const handleGoToLogin = () => {
    Haptics.selectionAsync().catch(() => {});
    router.replace('/login');
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Get started with clean, noise-free professional job hunting."
      errorMessage={errorMessage}
      switcherText="Already have an account?"
      switcherActionLabel="Sign in"
      onSwitcherPress={handleGoToLogin}>
      <View style={styles.fields}>
        <View style={styles.field}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={text => {
              setEmail(text);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="you@example.com"
            placeholderTextColor="#5A5D54"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current?.focus()}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              ref={passwordInputRef}
              style={styles.passwordInput}
              value={password}
              onChangeText={text => {
                setPassword(text);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Create password"
              placeholderTextColor="#5A5D54"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="go"
              onSubmitEditing={handleSubmit}
            />
            <Pressable
              onPress={() => setShowPassword(prev => !prev)}
              style={state => [
                styles.eyeButton,
                state.pressed && styles.pressedFade,
                Platform.OS === 'web' && (state as { focused?: boolean }).focused
                  ? styles.webFocusRing
                  : null,
              ]}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? (
                <EyeOff size={18} color="#5A5D54" />
              ) : (
                <Eye size={18} color="#5A5D54" />
              )}
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={isLoading}
          style={state => [
            styles.submitButton,
            isLoading && styles.disabledButton,
            state.pressed && !isLoading && styles.pressedFade,
            Platform.OS === 'web' && (state as { focused?: boolean }).focused
              ? styles.webFocusRing
              : null,
          ]}
          accessibilityRole="button"
          accessibilityState={{ busy: isLoading, disabled: isLoading }}
          accessibilityLabel="Sign up">
          {isLoading ? (
            <ActivityIndicator size="small" color="#121212" />
          ) : (
            <Text style={styles.submitButtonText}>Sign up</Text>
          )}
        </Pressable>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: 15,
    marginTop: 4,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#121212',
  },
  input: {
    minHeight: 46,
    backgroundColor: '#F9FAF7',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: Radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: '#121212',
  },
  passwordWrapper: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAF7',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: Radius.sm,
    paddingLeft: 14,
    paddingRight: 4,
  },
  passwordInput: {
    flex: 1,
    minHeight: 44,
    paddingVertical: 10,
    fontSize: 15,
    color: '#121212',
  },
  eyeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  submitButton: {
    minHeight: 48,
    backgroundColor: '#B8F23E',
    borderRadius: Radius.full,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  disabledButton: {
    opacity: 0.65,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.2,
  },
  pressedFade: {
    opacity: 0.8,
  },
  webFocusRing: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#121212',
    outlineOffset: 2,
  } as any,
});
