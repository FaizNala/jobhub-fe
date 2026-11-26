import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Briefcase } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
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
        <View style={styles.errorBanner} accessibilityLiveRegion="polite">
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      {/* Form Fields & Submit Button */}
      {children}

      {/* Switcher */}
      <View style={styles.switchRow}>
        <Text style={styles.switchText}>{switcherText}</Text>
        <Pressable
          onPress={onSwitcherPress}
          style={state => [
            styles.switchAction,
            state.pressed && styles.pressedFade,
            Platform.OS === 'web' && (state as { focused?: boolean }).focused
              ? styles.webFocusRing
              : null,
          ]}
          accessibilityRole="button"
          accessibilityLabel={switcherActionLabel}>
          <Text style={styles.switchLink}>{switcherActionLabel}</Text>
        </Pressable>
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
                    <Briefcase size={14} color="#121212" />
                    <Text style={styles.illustrationBadgeText}>
                      Built for modern professionals
                    </Text>
                  </View>
                  <Text style={styles.illustrationTitle}>
                    Your next career leap, organized.
                  </Text>
                  <Text style={styles.illustrationSubtitle}>
                    Track applications, tailor CVs, and bypass recruiter noise.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          /* Mobile Layout */
          <ScrollView
            style={styles.mobileScrollView}
            contentContainerStyle={styles.mobileScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.mobileIllustrationWrapper}>
              <AuthStorysetIllustration width={220} height={195} />
            </View>

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
    backgroundColor: '#F4F6F0',
    borderLeftWidth: 1,
    borderColor: Colors.light.border,
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
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.sm,
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
    color: '#5A5D54',
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 340,
  },
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
    color: '#121212',
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
    fontSize: 13.5,
    lineHeight: 19,
    color: '#5A5D54',
    fontWeight: '500',
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderRadius: Radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    fontSize: 13,
    color: '#991B1B',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 4,
  },
  switchText: {
    fontSize: 13,
    color: '#5A5D54',
    fontWeight: '500',
  },
  switchAction: {
    minHeight: 44,
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderRadius: Radius.sm,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  switchLink: {
    fontSize: 13,
    fontWeight: '800',
    color: '#121212',
    textDecorationLine: 'underline',
  },
  pressedFade: {
    opacity: 0.78,
  },
  webFocusRing: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#121212',
    outlineOffset: 2,
  } as any,
});
