import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Sparkles } from 'lucide-react-native';
import { Radius } from '@/constants/theme';
import { AuthStorysetIllustration } from '@/components/atoms/auth-storyset-illustration';

export interface AuthLayoutProps {
  title: string;
  subtitle: string;
  errorMessage?: string | null;
  children: React.ReactNode;
  switcherText: string;
  switcherActionLabel: string;
  onSwitcherPress: () => void;
}

export function AuthLayout({
  title,
  subtitle,
  errorMessage,
  children,
  switcherText,
  switcherActionLabel,
  onSwitcherPress,
}: AuthLayoutProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const renderFormContent = () => (
    <View style={styles.formContainer}>
      {/* Brand Header */}
      <View style={styles.brandRow}>
        <View style={styles.brandDot} />
        <Text style={styles.brandName}>JobHub</Text>
      </View>

      {/* Title & Subtitle */}
      <View style={styles.headerBlock}>
        <Text style={[styles.pageTitle, !isWide && styles.pageTitleMobile]}>
          {title}
        </Text>
        <Text style={styles.pageSubtitle}>{subtitle}</Text>
      </View>

      {/* Error Message */}
      {errorMessage ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      {/* Form Fields & Submit Button */}
      {children}

      {/* Switcher */}
      <View style={styles.switchRow}>
        <Text style={styles.switchText}>{switcherText}</Text>
        <TouchableOpacity
          onPress={onSwitcherPress}
          activeOpacity={0.7}
          style={styles.switchAction}>
          <Text style={styles.switchLink}>{switcherActionLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}>
        {isWide ? (
          /* Wide Desktop/Tablet Split Layout */
          <View style={styles.wideContainer}>
            <View style={styles.wideFormSide}>{renderFormContent()}</View>

            <View style={styles.wideIllustrationSide}>
              <View style={styles.illustrationFrame}>
                <AuthStorysetIllustration width={440} height={390} />
                <View style={styles.illustrationTextGroup}>
                  <View style={styles.illustrationBadge}>
                    <Sparkles size={14} color="#121212" />
                    <Text style={styles.illustrationBadgeText}>Built for tech engineers</Text>
                  </View>
                  <Text style={styles.illustrationTitle}>Your developer career, organized.</Text>
                  <Text style={styles.illustrationSubtitle}>
                    Track applications, tailor CVs, and bypass recruiter noise.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          /* Mobile Layout (Airy, vertical flow) */
          <ScrollView
            style={styles.mobileScrollView}
            contentContainerStyle={styles.mobileScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {/* Mobile Illustration */}
            <View style={styles.mobileIllustrationWrapper}>
              <AuthStorysetIllustration width={220} height={195} />
            </View>

            {/* Mobile Open Form */}
            {renderFormContent()}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardContainer: {
    flex: 1,
  },

  /* Wide Split Layout */
  wideContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: '100%',
  },
  wideFormSide: {
    flex: 1,
    maxWidth: 560,
    paddingHorizontal: 64,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  wideIllustrationSide: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
    backgroundColor: '#FCFDFB',
    borderLeftWidth: 1,
    borderColor: '#F0F2EB',
  },
  illustrationFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    width: '100%',
    maxWidth: 480,
  },
  illustrationTextGroup: {
    alignItems: 'center',
    gap: 8,
  },
  illustrationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#B8F23E',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: Radius.full,
  },
  illustrationBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.2,
  },
  illustrationTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#121212',
    marginTop: 4,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  illustrationSubtitle: {
    fontSize: 13,
    color: '#656A5E',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 340,
  },

  /* Mobile Layout */
  mobileScrollView: {
    flex: 1,
  },
  mobileScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  mobileIllustrationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  /* Form Container */
  formContainer: {
    width: '100%',
    gap: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: '#B8F23E',
  },
  brandName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#73786B',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  headerBlock: {
    gap: 6,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#121212',
    letterSpacing: -0.5,
  },
  pageTitleMobile: {
    fontSize: 26,
    letterSpacing: -0.4,
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: '#656A5E',
    fontWeight: '500',
  },
  errorBanner: {
    backgroundColor: '#FDE8E8',
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#F8B4B4',
  },
  errorText: {
    fontSize: 13,
    color: '#9B1C1C',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  switchText: {
    fontSize: 13,
    color: '#656A5E',
    fontWeight: '500',
  },
  switchAction: {
    paddingVertical: 4,
  },
  switchLink: {
    fontSize: 13,
    fontWeight: '800',
    color: '#121212',
    textDecorationLine: 'underline',
  },
});
