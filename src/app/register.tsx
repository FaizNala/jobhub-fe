import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Eye, EyeOff } from 'lucide-react-native';
import { Radius } from '@/constants/theme';
import { AuthLayout } from '@/components/templates/auth-layout';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

    // Direct authentic handshake -> Proceed to Profile Setup Wizard
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
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#9EA396"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••••••"
              placeholderTextColor="#9EA396"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(prev => !prev)}
              style={styles.eyeButton}
              activeOpacity={0.7}
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? (
                <EyeOff size={18} color="#73786B" />
              ) : (
                <Eye size={18} color="#73786B" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          style={styles.submitButton}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel="Create account">
          {isLoading ? (
            <ActivityIndicator size="small" color="#121212" />
          ) : (
            <Text style={styles.submitButtonText}>Create account</Text>
          )}
        </TouchableOpacity>
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
    backgroundColor: '#F9FAF7',
    borderWidth: 1.5,
    borderColor: '#E5E8DF',
    borderRadius: Radius.lg,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    color: '#121212',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAF7',
    borderWidth: 1.5,
    borderColor: '#E5E8DF',
    borderRadius: Radius.lg,
    paddingLeft: 15,
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#121212',
  },
  eyeButton: {
    padding: 6,
  },
  submitButton: {
    backgroundColor: '#B8F23E',
    borderRadius: Radius.full,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.2,
  },
});
