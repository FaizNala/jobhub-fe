import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Check, ArrowRight, ArrowLeft, Sparkles, Globe, Building2, MapPin } from 'lucide-react-native';
import { Radius } from '@/constants/theme';
import { useOnboardingStore, CandidateProfile } from '@/modules/onboarding';

export default function SetupProfileScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [currentStep, setCurrentStep] = useState(1);
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
      if (selectedStack.length > 1) {
        setSelectedStack(selectedStack.filter((t) => t !== tech));
      }
    } else {
      setSelectedStack([...selectedStack, tech]);
    }
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final submission
      const profileData: Partial<CandidateProfile> = {
        role: selectedRole,
        seniority: selectedSeniority,
        techStack: selectedStack,
        workMode: selectedWorkMode,
        targetSalary: selectedSalary,
      };
      saveProfileSetup(profileData);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.replace('/');
    }
  };

  const handleBack = () => {
    Haptics.selectionAsync().catch(() => {});
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        <View style={[styles.card, isDesktop && styles.desktopCard]}>
          {/* Progress Header */}
          <View style={styles.header}>
            <View style={styles.headerTopRow}>
              {currentStep > 1 ? (
                <TouchableOpacity
                  onPress={handleBack}
                  style={styles.backButton}
                  accessibilityRole="button"
                  accessibilityLabel="Go to previous setup step">
                  <ArrowLeft size={18} color="#121212" />
                </TouchableOpacity>
              ) : (
                <View style={{ width: 32 }} />
              )}
              <View style={styles.stepBadge}>
                <Sparkles size={13} color="#3F6212" />
                <Text style={styles.stepBadgeText}>Step {currentStep} of 3</Text>
              </View>
              <View style={{ width: 32 }} />
            </View>

            {/* Segmented Progress Bar */}
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${(currentStep / 3) * 100}%` },
                ]}
              />
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
                <View style={styles.chipGrid}>
                  {roles.map((role) => {
                    const isSelected = selectedRole === role;
                    return (
                      <TouchableOpacity
                        key={role}
                        onPress={() => {
                          Haptics.selectionAsync().catch(() => {});
                          setSelectedRole(role);
                        }}
                        style={[
                          styles.chip,
                          isSelected ? styles.chipSelected : styles.chipUnselected,
                        ]}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel={role}>
                        {isSelected && <Check size={14} color="#B8F23E" strokeWidth={2.6} />}
                        <Text
                          style={[
                            styles.chipText,
                            isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                          ]}>
                          {role}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={[styles.groupLabel, { marginTop: 20 }]}>SENIORITY LEVEL</Text>
                <View style={styles.chipGrid}>
                  {seniorities.map((level) => {
                    const isSelected = selectedSeniority === level;
                    return (
                      <TouchableOpacity
                        key={level}
                        onPress={() => {
                          Haptics.selectionAsync().catch(() => {});
                          setSelectedSeniority(level);
                        }}
                        style={[
                          styles.chip,
                          isSelected ? styles.chipSelected : styles.chipUnselected,
                        ]}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel={level}>
                        {isSelected && <Check size={14} color="#B8F23E" strokeWidth={2.6} />}
                        <Text
                          style={[
                            styles.chipText,
                            isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                          ]}>
                          {level}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
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

                <View style={styles.chipGrid}>
                  {skillOptions.map((skill) => {
                    const isSelected = selectedStack.includes(skill);
                    return (
                      <TouchableOpacity
                        key={skill}
                        onPress={() => toggleStack(skill)}
                        style={[
                          styles.chip,
                          isSelected ? styles.chipSelected : styles.chipUnselected,
                        ]}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel={skill}>
                        {isSelected && <Check size={14} color="#B8F23E" strokeWidth={2.6} />}
                        <Text
                          style={[
                            styles.chipText,
                            isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                          ]}>
                          {skill}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
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
                <View style={styles.cardOptionGroup}>
                  {workModes.map((mode) => {
                    const isSelected = selectedWorkMode === mode.id;
                    const IconComp = mode.icon;
                    return (
                      <TouchableOpacity
                        key={mode.id}
                        onPress={() => {
                          Haptics.selectionAsync().catch(() => {});
                          setSelectedWorkMode(mode.id as any);
                        }}
                        style={[
                          styles.modeCard,
                          isSelected ? styles.modeCardSelected : styles.modeCardUnselected,
                        ]}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel={mode.label}>
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
                          <View>
                            <Text
                              style={[
                                styles.modeCardTitle,
                                isSelected && styles.modeCardTitleSelected,
                              ]}>
                              {mode.label}
                            </Text>
                            <Text style={styles.modeCardDesc}>{mode.desc}</Text>
                          </View>
                        </View>
                        {isSelected && (
                          <View style={styles.checkCircle}>
                            <Check size={14} color="#121212" strokeWidth={2.6} />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={[styles.groupLabel, { marginTop: 20 }]}>TARGET ANNUAL BASE</Text>
                <View style={styles.chipGrid}>
                  {salaryRanges.map((sal) => {
                    const isSelected = selectedSalary === sal;
                    return (
                      <TouchableOpacity
                        key={sal}
                        onPress={() => {
                          Haptics.selectionAsync().catch(() => {});
                          setSelectedSalary(sal);
                        }}
                        style={[
                          styles.chip,
                          isSelected ? styles.chipSelected : styles.chipUnselected,
                        ]}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel={sal}>
                        {isSelected && <Check size={14} color="#B8F23E" strokeWidth={2.6} />}
                        <Text
                          style={[
                            styles.chipText,
                            isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                          ]}>
                          {sal}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Bottom Action Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleNext}
              style={[
                styles.primaryButton,
                Platform.OS === 'web' && ({ outline: 'none' } as any),
              ]}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel={
                currentStep === 3 ? 'Finish and launch career gateway' : 'Continue to next step'
              }>
              <Text style={styles.primaryButtonText}>
                {currentStep === 3 ? 'Launch my career gateway' : 'Continue'}
              </Text>
              <ArrowRight size={18} color="#121212" strokeWidth={2.4} />
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
    maxWidth: 580,
    maxHeight: 780,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2E6DC',
    paddingVertical: 32,
    paddingHorizontal: 40,
  },

  /* Header */
  header: {
    paddingBottom: 16,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3F6212',
    letterSpacing: 0.4,
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#E2E6DC',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#B8F23E',
  },

  /* Scrollable Form Content */
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 8,
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
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 20,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1.5,
  },
  chipSelected: {
    backgroundColor: '#121212',
    borderColor: '#121212',
  },
  chipUnselected: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  chipTextUnselected: {
    color: '#1E293B',
  },

  /* Mode Cards */
  cardOptionGroup: {
    gap: 10,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  modeCardSelected: {
    backgroundColor: '#121212',
    borderColor: '#121212',
  },
  modeCardUnselected: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  modeCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modeIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeIconWrapSelected: {
    backgroundColor: '#1E293B',
  },
  modeIconWrapUnselected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    color: '#94A3B8',
    marginTop: 2,
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
    paddingTop: 16,
    paddingBottom: 8,
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
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: -0.2,
  },
});
