import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { useOnboardingStore } from '@/modules/onboarding';
import { OnboardingJobsIllustration } from '@/components/atoms/onboarding-jobs-illustration';
import { OnboardingHunterIllustration } from '@/components/atoms/onboarding-hunter-illustration';
import { OnboardingCvIllustration } from '@/components/atoms/onboarding-cv-illustration';

interface SlideItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  illustration: React.ReactNode;
}

export default function OnboardingScreen() {
  const { width, height } = useWindowDimensions();
  const isDesktop = width >= 768;
  const illustWidth = isDesktop ? 340 : Math.min(300, Math.max(200, width - 96));
  const illustHeight = isDesktop
    ? Math.min(230, Math.max(160, Math.round(height * 0.28)))
    : Math.min(210, Math.max(148, Math.round(height * 0.26)));
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const completeWalkthrough = useOnboardingStore((state) => state.completeWalkthrough);

  const slides: SlideItem[] = [
    {
      id: 'jobs',
      tag: 'VERIFIED OPPORTUNITIES',
      title: 'Zero noise. Only verified roles.',
      subtitle:
        'Bypass spam and agency recruiters. Direct access to high-signal professional positions matching your experience and goals.',
      illustration: (
        <OnboardingJobsIllustration
          width={illustWidth}
          height={illustHeight}
        />
      ),
    },
    {
      id: 'hunter',
      tag: 'AUTONOMOUS AI HUNTER',
      title: 'Your personal 24/7 career agent.',
      subtitle:
        'The agent monitors market openings around the clock, tracks application pipelines, and prepares you for upcoming interviews.',
      illustration: (
        <OnboardingHunterIllustration
          width={illustWidth}
          height={illustHeight}
        />
      ),
    },
    {
      id: 'cv',
      tag: 'ATS-READY CV STUDIO',
      title: 'Tailored resumes built to get you hired.',
      subtitle:
        'Generate clean, ATS-compliant CVs tailored for each opportunity in one tap with instant Markdown and PDF export.',
      illustration: (
        <OnboardingCvIllustration
          width={illustWidth}
          height={illustHeight}
        />
      ),
    },
  ];

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else {
      completeWalkthrough();
      router.replace('/register');
    }
  };

  const handleBack = () => {
    Haptics.selectionAsync().catch(() => {});
    setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
  };

  const handleJumpToSlide = (index: number) => {
    Haptics.selectionAsync().catch(() => {});
    setCurrentSlideIndex(index);
  };

  const handleSkip = () => {
    Haptics.selectionAsync().catch(() => {});
    completeWalkthrough();
    router.replace('/login');
  };

  const handleSignIn = () => {
    Haptics.selectionAsync().catch(() => {});
    completeWalkthrough();
    router.replace('/login');
  };

  const currentSlide = slides[currentSlideIndex];
  const isLastSlide = currentSlideIndex === slides.length - 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        <View style={[styles.card, isDesktop && styles.desktopCard]}>
          {/* Header Bar */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {currentSlideIndex > 0 ? (
                <Pressable
                  onPress={handleBack}
                  style={({ pressed, focused }: any) => [
                    styles.backButton,
                    Platform.OS === 'web' && focused && styles.webFocusRing,
                    pressed && styles.buttonPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Previous slide">
                  <ArrowLeft size={18} color="#121212" />
                </Pressable>
              ) : null}
              <View style={styles.brandRow}>
                <Text style={styles.brandText}>jobhub</Text>
                <View style={styles.brandDot} />
              </View>
            </View>
            <Pressable
              onPress={handleSkip}
              style={({ pressed, focused }: any) => [
                styles.skipButton,
                Platform.OS === 'web' && focused && styles.webFocusRing,
                pressed && styles.buttonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Skip onboarding walkthrough">
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          </View>

          {/* Slide Content Area */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {/* Vector Illustration */}
            <View style={[styles.illustrationWrap, { minHeight: illustHeight }]}>
              {currentSlide.illustration}
            </View>

            {/* Slide Text Group */}
            <View style={styles.textGroup}>
              <View style={styles.tagBadge}>
                <Text style={styles.tagText}>{currentSlide.tag}</Text>
              </View>
              <Text style={styles.title}>{currentSlide.title}</Text>
              <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>
            </View>
          </ScrollView>

          {/* Bottom Action Footer */}
          <View style={styles.footer}>
            {/* Interactive Pagination Dots */}
            <View style={styles.paginationRow} accessibilityRole="tablist">
              {slides.map((slide, idx) => {
                const isActive = idx === currentSlideIndex;
                return (
                  <Pressable
                    key={slide.id}
                    onPress={() => handleJumpToSlide(idx)}
                    style={({ pressed, focused }: any) => [
                      styles.dotButton,
                      Platform.OS === 'web' && focused && styles.webFocusRing,
                      pressed && styles.buttonPressed,
                    ]}
                    accessibilityRole="tab"
                    accessibilityLabel={`Slide ${idx + 1} of ${slides.length}: ${slide.tag}`}
                    accessibilityState={{ selected: isActive }}>
                    <View
                      style={[
                        styles.dot,
                        isActive ? styles.dotActive : styles.dotInactive,
                      ]}
                    />
                  </Pressable>
                );
              })}
            </View>

            {/* Primary Action Button */}
            <Pressable
              onPress={handleNext}
              style={({ pressed, focused }: any) => [
                styles.primaryButton,
                Platform.OS === 'web' && focused && styles.webFocusRing,
                pressed && styles.primaryButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={isLastSlide ? 'Continue to sign up' : 'Continue to next slide'}>
              <Text style={styles.primaryButtonText}>
                {isLastSlide ? 'Continue to sign up' : 'Continue'}
              </Text>
              <ArrowRight size={18} color="#121212" strokeWidth={2.4} />
            </Pressable>

            {/* Secondary Sign In Link */}
            <Pressable
              onPress={handleSignIn}
              style={({ pressed, focused }: any) => [
                styles.signInButton,
                Platform.OS === 'web' && focused && styles.webFocusRing,
                pressed && styles.buttonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Sign in with existing account">
              <Text style={styles.signInText}>
                Already have an account?{' '}
                <Text style={styles.signInTextBold}>Sign in</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  root: {
    flex: 1,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.light.card,
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  desktopCard: {
    maxWidth: 520,
    maxHeight: 740,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    paddingVertical: 28,
    paddingHorizontal: 36,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({ web: { cursor: 'pointer' } as any, default: {} }),
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  brandText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#121212',
    letterSpacing: -0.8,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#B8F23E',
    marginLeft: 2,
    marginBottom: 2,
  },
  skipButton: {
    minHeight: 44,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({ web: { cursor: 'pointer' } as any, default: {} }),
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5A5D54',
  },

  /* Content */
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  illustrationWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  textGroup: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  tagBadge: {
    backgroundColor: '#EFFCD3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#B8F23E',
    marginBottom: 10,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2F4F00',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#121212',
    textAlign: 'center',
    letterSpacing: -0.4,
    lineHeight: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#5A5D54',
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 380,
  },

  /* Footer */
  footer: {
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: 'center',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 14,
  },
  dotButton: {
    minWidth: 36,
    minHeight: 44,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
    ...Platform.select({ web: { cursor: 'pointer' } as any, default: {} }),
  },
  dot: {
    height: 7,
    borderRadius: 3.5,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#B8F23E',
  },
  dotInactive: {
    width: 7,
    backgroundColor: Colors.light.border,
  },
  primaryButton: {
    width: '100%',
    minHeight: 52,
    backgroundColor: '#B8F23E',
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 0,
    borderColor: 'transparent',
    marginBottom: 8,
    ...Platform.select({ web: { cursor: 'pointer' } as any, default: {} }),
  },
  primaryButtonPressed: {
    opacity: 0.88,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: -0.2,
  },
  signInButton: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({ web: { cursor: 'pointer' } as any, default: {} }),
  },
  buttonPressed: {
    opacity: 0.72,
  },
  signInText: {
    fontSize: 14,
    color: '#5A5D54',
  },
  signInTextBold: {
    fontWeight: '700',
    color: '#121212',
    textDecorationLine: 'underline',
  },
  webFocusRing: Platform.select({
    web: {
      outlineWidth: 2,
      outlineColor: '#121212',
      outlineStyle: 'solid',
      outlineOffset: 2,
    } as any,
    default: {},
  }),
});
