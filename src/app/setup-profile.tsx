import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { Check, ArrowRight, ArrowLeft, Globe, Building2, MapPin } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import {
  buildCvProfileUpdateFromOnboarding,
  CandidateProfile,
  useOnboardingStore,
} from '@/modules/onboarding';
import { cvService } from '@/modules/cv-studio';

interface ChipOptionProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  variant?: 'single' | 'multi';
}

function ChipOption({
  label,
  selected,
  onPress,
  variant = 'single',
}: ChipOptionProps) {
  const isMulti = variant === 'multi';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed, focused }: any) => [
        styles.chip,
        selected
          ? isMulti
            ? styles.chipMultiSelected
            : styles.chipSelected
          : styles.chipUnselected,
        Platform.OS === 'web' && focused && styles.webFocusRing,
        pressed && styles.pressedSoft,
      ]}
      accessibilityRole={isMulti ? 'checkbox' : 'radio'}
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}>
      {selected && (
        <Check
          size={14}
          color={isMulti ? '#2F4F00' : '#B8F23E'}
          strokeWidth={2.6}
        />
      )}
      <Text
        style={[
          styles.chipText,
          selected
            ? isMulti
              ? styles.chipMultiTextSelected
              : styles.chipTextSelected
            : styles.chipTextUnselected,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function SetupProfileScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [currentStep, setCurrentStep] = useState(1);
  const [skillLimitHint, setSkillLimitHint] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const saveProfileSetup = useOnboardingStore((state) => state.saveProfileSetup);
  const existingProfile = useOnboardingStore((state) => state.candidateProfile);

  // Form selections
  const [selectedRole, setSelectedRole] = useState(existingProfile.role || 'Product & Project Management');
  const [selectedSeniority, setSelectedSeniority] = useState(existingProfile.seniority || 'Senior (5-8 yrs)');
  const [selectedStack, setSelectedStack] = useState<string[]>(
    existingProfile.techStack.length > 0
      ? existingProfile.techStack
      : ['Project Management', 'Product Strategy', 'Data Analysis']
  );
  const [selectedWorkMode, setSelectedWorkMode] = useState<'remote' | 'hybrid' | 'onsite'>(
    existingProfile.workMode || 'remote'
  );
  const [selectedSalary, setSelectedSalary] = useState(existingProfile.targetSalary || '$145k - $175k / yr');

  const roles = [
    'Product & Project Management',
    'Marketing, Brand & Growth',
    'UI/UX & Creative Design',
    'Sales & Business Development',
    'Finance, Accounting & Legal',
    'Human Resources & Operations',
    'Software & Technology',
    'Content & Communications',
  ];

  const seniorities = [
    'Junior (1-2 yrs)',
    'Mid-level (3-5 yrs)',
    'Senior (5-8 yrs)',
    'Lead / Staff (8+ yrs)',
  ];

  const skillOptions = [
    'Project Management',
    'Product Strategy',
    'Digital Marketing',
    'Data Analysis',
    'UI/UX Design',
    'Financial Modeling',
    'CRM & Sales Pipeline',
    'Brand & Creative Strategy',
    'Content Strategy',
    'People Operations & HR',
    'SEO & Growth Analytics',
    'Leadership & Strategy',
    'Business Development',
    'Python / SQL Data',
    'React / Mobile Tech',
  ];

  const workModes = [
    { id: 'remote', label: 'Full Remote', icon: Globe, desc: 'Anywhere in your timezone' },
    { id: 'hybrid', label: 'Hybrid Office', icon: Building2, desc: '1-3 days in office' },
    { id: 'onsite', label: 'On-site Office', icon: MapPin, desc: 'Dedicated HQ environment' },
  ];

  const salaryRanges = [
    '$90k - $120k / yr',
    '$120k - $145k / yr',
    '$145k - $175k / yr',
    '$175k - $220k+ / yr',
  ];

  const toggleStack = (tech: string) => {
    Haptics.selectionAsync().catch(() => {});
    if (selectedStack.includes(tech)) {
      if (selectedStack.length <= 1) {
        setSkillLimitHint('Select at least 1 core skill so Hunter can tailor job matches.');
        return;
      }
      setSkillLimitHint(null);
      setSelectedStack(selectedStack.filter((t) => t !== tech));
    } else {
      setSkillLimitHint(null);
      setSelectedStack([...selectedStack, tech]);
    }
  };

  const handleNext = async () => {
    if (isSaving) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    setIsSaving(true);
    const profileData: Partial<CandidateProfile> = {
      role: selectedRole,
      seniority: selectedSeniority,
      techStack: selectedStack,
      workMode: selectedWorkMode,
      targetSalary: selectedSalary,
    };

    try {
      saveProfileSetup(profileData);
      const mergedProfile: CandidateProfile = {
        ...existingProfile,
        ...profileData,
      };
      const existingCvRes = await cvService.getProfile();
      const dto = buildCvProfileUpdateFromOnboarding(
        mergedProfile,
        existingCvRes.data
      );
      await cvService.updateProfile(dto);
    } catch {
      // Local onboarding store already persisted; avoid blocking workspace entry when offline
    } finally {
      setIsSaving(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.replace('/');
    }
  };

  const handleBack = () => {
    if (isSaving) return;
    Haptics.selectionAsync().catch(() => {});
    setSkillLimitHint(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkipSetup = () => {
    if (isSaving) return;
    Haptics.selectionAsync().catch(() => {});
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        <View style={[styles.card, isDesktop && styles.desktopCard]}>
          {/* Stepper Header (Matching Match Deck & CV Builder) */}
          <View style={styles.header}>
            <View style={styles.headerTopRow}>
              {currentStep > 1 ? (
                <Pressable
                  onPress={handleBack}
                  disabled={isSaving}
                  style={({ pressed, focused }: any) => [
                    styles.backButton,
                    Platform.OS === 'web' && focused && styles.webFocusRing,
                    pressed && styles.pressedSoft,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Go to previous setup step">
                  <ArrowLeft size={18} color="#121212" />
                </Pressable>
              ) : null}

              <View style={styles.progressTrackWrap}>
                <View
                  style={styles.segmentsRow}
                  accessibilityRole="progressbar"
                  accessibilityLabel="Profile setup progress"
                  accessibilityValue={{ min: 1, max: 3, now: currentStep }}>
                  {[1, 2, 3].map((stepNum) => {
                    const isDone = stepNum < currentStep;
                    const isCurrent = stepNum === currentStep;
                    return (
                      <View
                        key={stepNum}
                        style={[
                          styles.progressSegment,
                          isDone && styles.progressSegmentDone,
                          isCurrent && styles.progressSegmentActive,
                        ]}
                      />
                    );
                  })}
                </View>
                <Text style={styles.progressLabel}>{currentStep} / 3</Text>
              </View>

              <Pressable
                onPress={handleSkipSetup}
                disabled={isSaving}
                style={({ pressed, focused }: any) => [
                  styles.skipButton,
                  Platform.OS === 'web' && focused && styles.webFocusRing,
                  pressed && styles.pressedSoft,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Skip profile setup for now">
                <Text style={styles.skipButtonText}>Skip</Text>
              </Pressable>
            </View>
          </View>

          {/* Form Content Area */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {/* STEP 1: Target Role & Level */}
            {currentStep === 1 && (
              <View style={styles.stepSection}>
                <Text style={styles.stepTitle}>What role are you targeting?</Text>
                <Text style={styles.stepSubtitle}>
                  This calibrates your daily match radar and AI Hunter alerts.
                </Text>

                <Text style={styles.groupLabel}>PRIMARY FOCUS</Text>
                <View style={styles.chipGrid} accessibilityRole="radiogroup">
                  {roles.map((role) => (
                    <ChipOption
                      key={role}
                      label={role}
                      selected={selectedRole === role}
                      onPress={() => {
                        Haptics.selectionAsync().catch(() => {});
                        setSelectedRole(role);
                      }}
                    />
                  ))}
                </View>

                <Text style={[styles.groupLabel, { marginTop: 20 }]}>SENIORITY LEVEL</Text>
                <View style={styles.chipGrid} accessibilityRole="radiogroup">
                  {seniorities.map((level) => (
                    <ChipOption
                      key={level}
                      label={level}
                      selected={selectedSeniority === level}
                      onPress={() => {
                        Haptics.selectionAsync().catch(() => {});
                        setSelectedSeniority(level);
                      }}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* STEP 2: Core Expertise & Skills */}
            {currentStep === 2 && (
              <View style={styles.stepSection}>
                <Text style={styles.stepTitle}>Select your core expertise & skills</Text>
                <Text style={styles.stepSubtitle}>
                  Tap the key competencies and tools you want your next opportunity to prioritize.
                </Text>

                <View style={styles.groupHeaderRow}>
                  <Text style={styles.groupLabelInline}>CORE SKILLS</Text>
                  <Text style={styles.selectionCounter}>
                    {selectedStack.length} selected · Min. 1
                  </Text>
                </View>

                {skillLimitHint ? (
                  <Text style={styles.skillLimitHint} accessibilityLiveRegion="polite">
                    {skillLimitHint}
                  </Text>
                ) : null}

                <View style={styles.chipGrid}>
                  {skillOptions.map((skill) => (
                    <ChipOption
                      key={skill}
                      label={skill}
                      variant="multi"
                      selected={selectedStack.includes(skill)}
                      onPress={() => toggleStack(skill)}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* STEP 3: Work Preferences & Compensation */}
            {currentStep === 3 && (
              <View style={styles.stepSection}>
                <Text style={styles.stepTitle}>How do you prefer to work?</Text>
                <Text style={styles.stepSubtitle}>
                  JobHub automatically filters out positions that don't match your policy.
                </Text>

                <Text style={styles.groupLabel}>WORK ARRANGEMENT</Text>
                <View style={styles.cardOptionGroup} accessibilityRole="radiogroup">
                  {workModes.map((mode) => {
                    const isSelected = selectedWorkMode === mode.id;
                    const IconComp = mode.icon;
                    return (
                      <Pressable
                        key={mode.id}
                        onPress={() => {
                          Haptics.selectionAsync().catch(() => {});
                          setSelectedWorkMode(mode.id as any);
                        }}
                        style={({ pressed, focused }: any) => [
                          styles.modeCard,
                          isSelected ? styles.modeCardSelected : styles.modeCardUnselected,
                          Platform.OS === 'web' && focused && styles.webFocusRing,
                          pressed && styles.pressedSoft,
                        ]}
                        accessibilityRole="radio"
                        accessibilityLabel={mode.label}
                        accessibilityState={{ checked: isSelected }}>
                        <View style={styles.modeCardLeft}>
                          <View
                            style={[
                              styles.modeIconWrap,
                              isSelected ? styles.modeIconWrapSelected : styles.modeIconWrapUnselected,
                            ]}>
                            <IconComp
                              size={18}
                              color={isSelected ? '#B8F23E' : '#121212'}
                              strokeWidth={2}
                            />
                          </View>
                          <View style={{ flexShrink: 1 }}>
                            <Text
                              style={[
                                styles.modeCardTitle,
                                isSelected && styles.modeCardTitleSelected,
                              ]}>
                              {mode.label}
                            </Text>
                            <Text
                              style={[
                                styles.modeCardDesc,
                                isSelected && styles.modeCardDescSelected,
                              ]}>
                              {mode.desc}
                            </Text>
                          </View>
                        </View>
                        {isSelected && (
                          <View style={styles.checkCircle}>
                            <Check size={14} color="#121212" strokeWidth={2.6} />
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </View>

                <Text style={[styles.groupLabel, { marginTop: 20 }]}>TARGET ANNUAL BASE</Text>
                <View style={styles.chipGrid} accessibilityRole="radiogroup">
                  {salaryRanges.map((sal) => (
                    <ChipOption
                      key={sal}
                      label={sal}
                      selected={selectedSalary === sal}
                      onPress={() => {
                        Haptics.selectionAsync().catch(() => {});
                        setSelectedSalary(sal);
                      }}
                    />
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Bottom Action Footer */}
          <View style={styles.footer}>
            <Pressable
              onPress={handleNext}
              disabled={isSaving}
              style={({ pressed, focused }: any) => [
                styles.primaryButton,
                isSaving && styles.primaryButtonDisabled,
                Platform.OS === 'web' && focused && styles.webFocusRing,
                pressed && !isSaving && styles.primaryButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ busy: isSaving, disabled: isSaving }}
              accessibilityLabel={
                currentStep === 3 ? 'Finish and launch career gateway' : 'Continue to next step'
              }>
              {isSaving ? (
                <ActivityIndicator size="small" color="#121212" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>
                    {currentStep === 3 ? 'Launch my career gateway' : 'Continue'}
                  </Text>
                  <ArrowRight size={18} color="#121212" strokeWidth={2.4} />
                </>
              )}
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
    paddingTop: 16,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  desktopCard: {
    maxWidth: 580,
    maxHeight: 780,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    paddingTop: 28,
    paddingBottom: 20,
    paddingHorizontal: 40,
  },

  /* Header */
  header: {
    paddingBottom: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
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
  progressTrackWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  segmentsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D6DCD0',
  },
  progressSegmentDone: {
    backgroundColor: '#121212',
  },
  progressSegmentActive: {
    backgroundColor: '#2E6F00',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.textMuted,
    letterSpacing: 0.2,
    fontVariant: ['tabular-nums'],
  },
  skipButton: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: 8,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({ web: { cursor: 'pointer' } as any, default: {} }),
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textMuted,
  },

  /* Scrollable Form Content */
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  stepSection: {
    paddingVertical: 8,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#121212',
    letterSpacing: -0.6,
    lineHeight: 30,
    marginBottom: 6,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#5A5D54',
    lineHeight: 20,
    marginBottom: 20,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#5A5D54',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  groupHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  groupLabelInline: {
    fontSize: 11,
    fontWeight: '800',
    color: '#5A5D54',
    letterSpacing: 0.8,
  },
  selectionCounter: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5A5D54',
  },
  skillLimitHint: {
    fontSize: 12,
    fontWeight: '600',
    color: '#991B1B',
    marginBottom: 10,
  },

  /* Chips */
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    ...Platform.select({ web: { cursor: 'pointer' } as any, default: {} }),
  },
  chipSelected: {
    backgroundColor: '#121212',
    borderColor: '#121212',
  },
  chipMultiSelected: {
    backgroundColor: '#EFFCD3',
    borderColor: '#4D7C0F',
  },
  chipUnselected: {
    backgroundColor: '#F9FAF7',
    borderColor: Colors.light.border,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  chipMultiTextSelected: {
    color: '#121212',
  },
  chipTextUnselected: {
    color: '#121212',
  },

  /* Mode Cards */
  cardOptionGroup: {
    gap: 10,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 68,
    padding: 14,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    ...Platform.select({ web: { cursor: 'pointer' } as any, default: {} }),
  },
  modeCardSelected: {
    backgroundColor: '#121212',
    borderColor: '#121212',
  },
  modeCardUnselected: {
    backgroundColor: '#F9FAF7',
    borderColor: Colors.light.border,
  },
  modeCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  modeIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeIconWrapSelected: {
    backgroundColor: '#1C1E1A',
  },
  modeIconWrapUnselected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  modeCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#121212',
  },
  modeCardTitleSelected: {
    color: '#FFFFFF',
  },
  modeCardDesc: {
    fontSize: 12,
    color: '#5A5D54',
    marginTop: 2,
  },
  modeCardDescSelected: {
    color: '#D1D5DB',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#B8F23E',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Footer */
  footer: {
    paddingTop: 14,
    paddingBottom: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.card,
  },
  primaryButtonDisabled: {
    opacity: 0.65,
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
    ...Platform.select({ web: { cursor: 'pointer' } as any, default: {} }),
  },
  primaryButtonPressed: {
    opacity: 0.88,
  },
  pressedSoft: {
    opacity: 0.8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: -0.2,
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
