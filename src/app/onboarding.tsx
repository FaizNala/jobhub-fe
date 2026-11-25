import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowRight } from 'lucide-react-native';
import { Radius } from '@/constants/theme';
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
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
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
          width={isDesktop ? 360 : 320}
          height={isDesktop ? 250 : 225}
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
          width={isDesktop ? 360 : 320}
          height={isDesktop ? 250 : 225}
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
          width={isDesktop ? 360 : 320}
          height={isDesktop ? 250 : 225}
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
            <View style={styles.brandRow}>
              <Text style={styles.brandText}>jobhub</Text>
              <View style={styles.brandDot} />
            </View>
            <TouchableOpacity
              onPress={handleSkip}
              style={styles.skipButton}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Skip onboarding walkthrough">
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Slide Content Area */}
          <View style={styles.contentArea}>
            {/* Vector Illustration */}
            <View style={styles.illustrationWrap}>{currentSlide.illustration}</View>

            {/* Slide Text Group */}
            <View style={styles.textGroup}>
              <View style={styles.tagBadge}>
                <Text style={styles.tagText}>{currentSlide.tag}</Text>
              </View>
              <Text style={styles.title}>{currentSlide.title}</Text>
              <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>
            </View>
          </View>

          {/* Bottom Action Footer */}
          <View style={styles.footer}>
            {/* Pagination Pill Dots */}
            <View style={styles.paginationRow}>
              {slides.map((_, idx) => {
                const isActive = idx === currentSlideIndex;
                return (
                  <View
                    key={idx}
                    style={[
                      styles.dot,
                      isActive ? styles.dotActive : styles.dotInactive,
                    ]}
                  />
                );
              })}
            </View>

            {/* Primary Action Button (Solid Lime, Zero Border Anti-Slop) */}
            <TouchableOpacity
              onPress={handleNext}
              style={[
                styles.primaryButton,
                Platform.OS === 'web' && ({ outline: 'none' } as any),
              ]}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel={isLastSlide ? 'Get started' : 'Continue to next slide'}>
              <Text style={styles.primaryButtonText}>
                {isLastSlide ? 'Get started' : 'Continue'}
              </Text>
              <ArrowRight size={18} color="#121212" strokeWidth={2.4} />
            </TouchableOpacity>

            {/* Secondary Sign In Link */}
            <TouchableOpacity
              onPress={handleSignIn}
              style={styles.signInButton}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Sign in with existing account">
              <Text style={styles.signInText}>
                Already have an account?{' '}
                <Text style={styles.signInTextBold}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  desktopCard: {
    maxWidth: 520,
    maxHeight: 740,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2E6DC',
    paddingVertical: 32,
    paddingHorizontal: 36,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
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
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },

  /* Content */
  contentArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
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
    backgroundColor: '#F0F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#3F6212',
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
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 380,
  },

  /* Footer */
  footer: {
    paddingBottom: 16,
    alignItems: 'center',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
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
    backgroundColor: '#E2E6DC',
  },
  primaryButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#B8F23E',
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 0,
    borderColor: 'transparent',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: -0.2,
  },
  signInButton: {
    paddingVertical: 8,
  },
  signInText: {
    fontSize: 14,
    color: '#64748B',
  },
  signInTextBold: {
    fontWeight: '700',
    color: '#121212',
    textDecorationLine: 'underline',
  },
});
