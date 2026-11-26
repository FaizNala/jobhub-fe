import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import {
  AlertCircle,
  Code2,
  Eye,
  FileText,
  Globe,
  Link2,
  Mail,
  MapPin,
  Pencil,
  Phone,
} from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { Body, Display, Heading, Label } from '@/components/atoms/typography';
import {
  CvBuilderModal,
  CvCertificationsSection,
  CvDocumentPreview,
  CvEducationSection,
  CvExperienceList,
  CvHealthIndexCard,
  CvOrganizationSection,
  CvProjectsSection,
  CvSkillsCategorizedSection,
  HunterAuditModal,
  useCandidateProfile,
  useCvHealth,
} from '@/modules/cv-studio';

type ViewMode = 'builder' | 'preview';

export default function CvStudioScreen() {
  const { profile, isLoading, error, getProfile, updateProfile } = useCandidateProfile();
  const cvHealth = useCvHealth(profile);

  const [viewMode, setViewMode] = useState<ViewMode>('builder');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isHunterAuditVisible, setIsHunterAuditVisible] = useState(false);

  const handleToggleViewMode = (mode: ViewMode) => {
    if (mode === viewMode) return;
    Haptics.selectionAsync().catch(() => {});
    setViewMode(mode);
  };

  const displayName = profile?.fullName || 'Your Name';
  const displayRole = profile?.headline || 'Add your professional headline';
  const displayLocation = profile?.location || 'Set location';
  const displaySummary = profile?.summary || '';
  const displayContact = profile?.contact;
  const hardSkills = profile?.hardSkills || profile?.skills || [];
  const softSkills = profile?.softSkills || [];
  const experiences = profile?.experiences || [];
  const projects = profile?.projects || [];
  const organizations = profile?.organizations || [];
  const education = profile?.education || [];
  const certifications = profile?.certifications || [];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.pageColumn}>
          {/* Screen Header */}
          <View style={styles.header}>
            <View style={styles.badgeRow}>
              <View style={styles.iconCircle}>
                <FileText size={13} color="#121212" />
              </View>
              <Label style={styles.badgeText}>CAREER DOSSIER STUDIO</Label>
            </View>

            <View style={styles.titleRow}>
              <Display style={styles.title}>
                CV STUDIO &{'\n'}BUILDER
              </Display>

              <Pressable
                onPress={() => setIsEditModalVisible(true)}
                style={state => [
                  styles.editHeaderButton,
                  state.pressed && styles.pressedFade,
                  Platform.OS === 'web' && (state as { focused?: boolean }).focused
                    ? styles.webFocusRing
                    : null,
                  Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Edit master dossier">
                <Pencil size={13} color="#121212" />
                <Label style={styles.editHeaderText}>BUILD CV</Label>
              </Pressable>
            </View>

            {/* Segmented View Mode Toggle */}
            <View style={styles.toggleRow}>
              <Pressable
                onPress={() => handleToggleViewMode('builder')}
                style={state => [
                  styles.togglePill,
                  viewMode === 'builder' && styles.togglePillActive,
                  state.pressed && styles.pressedFade,
                  Platform.OS === 'web' && (state as { focused?: boolean }).focused
                    ? styles.webFocusRing
                    : null,
                  Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null,
                ]}
                accessibilityRole="tab"
                accessibilityState={{ selected: viewMode === 'builder' }}>
                <FileText
                  size={14}
                  color={viewMode === 'builder' ? '#121212' : '#5A5D54'}
                />
                <Label
                  style={[
                    styles.toggleText,
                    viewMode === 'builder' && styles.toggleTextActive,
                  ]}>
                  MODULAR BUILDER
                </Label>
              </Pressable>

              <Pressable
                onPress={() => handleToggleViewMode('preview')}
                style={state => [
                  styles.togglePill,
                  viewMode === 'preview' && styles.togglePillActive,
                  state.pressed && styles.pressedFade,
                  Platform.OS === 'web' && (state as { focused?: boolean }).focused
                    ? styles.webFocusRing
                    : null,
                  Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null,
                ]}
                accessibilityRole="tab"
                accessibilityState={{ selected: viewMode === 'preview' }}>
                <Eye
                  size={14}
                  color={viewMode === 'preview' ? '#121212' : '#5A5D54'}
                />
                <Label
                  style={[
                    styles.toggleText,
                    viewMode === 'preview' && styles.toggleTextActive,
                  ]}>
                  ATS PREVIEW & EXPORT
                </Label>
              </Pressable>
            </View>
          </View>

          {/* Loading, Error, Empty, or Data Views */}
          {isLoading && !profile ? (
            <View style={styles.stateBox} accessibilityLiveRegion="polite">
              <ActivityIndicator size="small" color="#121212" />
              <Body style={styles.stateBody}>Loading your CV dossier...</Body>
            </View>
          ) : error && !profile ? (
            <View style={styles.stateBox} accessibilityLiveRegion="polite">
              <AlertCircle size={22} color="#991B1B" />
              <Heading style={styles.stateTitle}>Unable to load CV studio</Heading>
              <Body style={styles.stateBody}>{error}</Body>
              <Pressable
                onPress={() => getProfile()}
                style={state => [
                  styles.retryButton,
                  state.pressed && styles.pressedFade,
                  Platform.OS === 'web' && (state as { focused?: boolean }).focused
                    ? styles.webFocusRing
                    : null,
                  Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Retry loading CV dossier">
                <Label style={styles.retryButtonText}>RETRY</Label>
              </Pressable>
            </View>
          ) : !profile ? (
            <View style={styles.stateBox}>
              <Heading style={styles.stateTitle}>Start building your CV</Heading>
              <Body style={styles.stateBody}>
                Open the builder to add your contact profile, experience, skills, and education.
              </Body>
            </View>
          ) : viewMode === 'builder' ? (
            <>
              <CvHealthIndexCard
                metrics={cvHealth}
                onAuditPress={() => setIsHunterAuditVisible(true)}
              />

              {/* Candidate Identity & Contact Summary */}
              <View style={styles.identityCard}>
                <View style={styles.identityTop}>
                  <View style={styles.identityTitleBlock}>
                    <Heading style={styles.identityName}>{displayName}</Heading>
                    <Body style={styles.identityRole}>{displayRole}</Body>
                  </View>
                  <View style={styles.locationTag}>
                    <MapPin size={11} color="#2F4F00" />
                    <Body style={styles.locationTagText}>{displayLocation}</Body>
                  </View>
                </View>

                <View style={styles.contactsRow}>
                  {displayContact?.email ? (
                    <View style={styles.contactItem}>
                      <Mail size={12} color="#5A5D54" />
                      <Body style={styles.contactItemText}>{displayContact.email}</Body>
                    </View>
                  ) : null}
                  {displayContact?.phone ? (
                    <View style={styles.contactItem}>
                      <Phone size={12} color="#5A5D54" />
                      <Body style={styles.contactItemText}>{displayContact.phone}</Body>
                    </View>
                  ) : null}
                  {displayContact?.portfolio ? (
                    <View style={styles.contactItem}>
                      <Globe size={12} color="#5A5D54" />
                      <Body style={styles.contactItemText}>
                        {displayContact.portfolio.replace(/^https?:\/\//, '')}
                      </Body>
                    </View>
                  ) : null}
                  {displayContact?.github ? (
                    <View style={styles.contactItem}>
                      <Code2 size={12} color="#5A5D54" />
                      <Body style={styles.contactItemText}>{displayContact.github}</Body>
                    </View>
                  ) : null}
                  {displayContact?.linkedin ? (
                    <View style={styles.contactItem}>
                      <Link2 size={12} color="#5A5D54" />
                      <Body style={styles.contactItemText}>{displayContact.linkedin}</Body>
                    </View>
                  ) : null}
                </View>

                {displaySummary ? (
                  <View style={styles.summaryContainer}>
                    <Body style={styles.summaryText}>{displaySummary}</Body>
                  </View>
                ) : null}
              </View>

              <CvSkillsCategorizedSection
                hardSkills={hardSkills}
                softSkills={softSkills}
              />
              <CvExperienceList experiences={experiences} />
              <CvProjectsSection projects={projects} />
              <CvOrganizationSection organizations={organizations} />
              <CvEducationSection education={education} />
              <CvCertificationsSection certifications={certifications} />
            </>
          ) : (
            <CvDocumentPreview profile={profile} />
          )}
        </View>
      </ScrollView>

      <HunterAuditModal
        visible={isHunterAuditVisible}
        metrics={cvHealth}
        onClose={() => setIsHunterAuditVisible(false)}
      />

      <CvBuilderModal
        visible={isEditModalVisible}
        profile={profile}
        onClose={() => setIsEditModalVisible(false)}
        onSave={async dto => {
          await updateProfile(dto);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  pageColumn: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    gap: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.5,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
  },
  title: {
    fontSize: 26,
    lineHeight: 30,
    color: '#121212',
    fontWeight: '900',
  },
  editHeaderButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  editHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#121212',
    letterSpacing: 0.5,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#EAEFE2',
    borderRadius: Radius.full,
    padding: 4,
    marginTop: 4,
    gap: 4,
  },
  togglePill: {
    flex: 1,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
  },
  togglePillActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  toggleText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#5A5D54',
    letterSpacing: 0.4,
  },
  toggleTextActive: {
    color: '#121212',
    fontWeight: '800',
  },
  stateBox: {
    paddingHorizontal: 24,
    paddingVertical: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#121212',
    textAlign: 'center',
  },
  stateBody: {
    fontSize: 13,
    lineHeight: 19,
    color: '#5A5D54',
    textAlign: 'center',
    maxWidth: 300,
  },
  retryButton: {
    minHeight: 44,
    paddingHorizontal: 20,
    borderRadius: Radius.full,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  retryButtonText: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#FFFFFF',
  },
  identityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 18,
    marginHorizontal: 20,
    marginTop: 18,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    gap: 12,
  },
  identityTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  identityTitleBlock: {
    flex: 1,
    gap: 2,
  },
  identityName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#121212',
  },
  identityRole: {
    fontSize: 13,
    color: '#5A5D54',
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFFCD3',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#B8F23E',
  },
  locationTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2F4F00',
  },
  contactsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
    paddingTop: 2,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  contactItemText: {
    fontSize: 11.5,
    color: '#5A5D54',
  },
  summaryContainer: {
    backgroundColor: '#F9FAF7',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#E2E6DC',
    marginTop: 6,
  },
  summaryText: {
    fontSize: 12,
    lineHeight: 20,
    color: '#343830',
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
