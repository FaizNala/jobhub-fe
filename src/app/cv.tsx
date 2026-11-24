import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import {
  FileText,
  Eye,
  Pencil,
  MapPin,
  Mail,
  Phone,
  Globe,
  Code2,
  Link2,
} from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { Display, Heading, Body, Label } from '@/components/atoms/typography';
import {
  useCandidateProfile,
  useCvHealth,
  CvExperienceList,
  CvProjectsSection,
  CvOrganizationSection,
  CvEducationSection,
  CvSkillsCategorizedSection,
  CvCertificationsSection,
  CvHealthIndexCard,
  CvDocumentPreview,
  HunterAuditModal,
  CvBuilderModal,
} from '@/modules/cv-studio';

type ViewMode = 'builder' | 'preview';

export default function CvStudioScreen() {
  const { profile, updateProfile } = useCandidateProfile();
  const cvHealth = useCvHealth(profile);

  const [viewMode, setViewMode] = useState<ViewMode>('builder');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isHunterAuditVisible, setIsHunterAuditVisible] = useState(false);

  const handleToggleViewMode = (mode: ViewMode) => {
    if (mode === viewMode) return;
    Haptics.selectionAsync().catch(() => {});
    setViewMode(mode);
  };

  const displayName = profile?.fullName || 'Alex Vance';
  const displayRole = profile?.headline || 'Senior Mobile Engineer';
  const displayLocation = profile?.location || 'San Francisco, CA';
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

            <TouchableOpacity
              onPress={() => setIsEditModalVisible(true)}
              style={styles.editHeaderButton}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Edit master dossier">
              <Pencil size={13} color="#121212" />
              <Label style={styles.editHeaderText}>BUILD CV</Label>
            </TouchableOpacity>
          </View>

          {/* Segmented View Mode Toggle: Builder vs. Document Preview */}
          <View style={styles.toggleRow}>
            <TouchableOpacity
              onPress={() => handleToggleViewMode('builder')}
              style={[
                styles.togglePill,
                viewMode === 'builder' && styles.togglePillActive,
              ]}
              activeOpacity={0.85}
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
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleToggleViewMode('preview')}
              style={[
                styles.togglePill,
                viewMode === 'preview' && styles.togglePillActive,
              ]}
              activeOpacity={0.85}
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
            </TouchableOpacity>
          </View>
        </View>

        {viewMode === 'builder' ? (
          <>
            {/* CV Health & Completeness Benchmark */}
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

              {/* Contact Links */}
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

              {/* Summary Paragraph */}
              {displaySummary ? (
                <View style={styles.summaryContainer}>
                  <Body style={styles.summaryText}>{displaySummary}</Body>
                </View>
              ) : null}
            </View>

            {/* 1. Technical & Soft Skills Inventory */}
            <CvSkillsCategorizedSection
              hardSkills={hardSkills}
              softSkills={softSkills}
            />

            {/* 2. Work Experience (Google XYZ Highlights) */}
            <CvExperienceList experiences={experiences} />

            {/* 3. Featured Projects */}
            <CvProjectsSection projects={projects} />

            {/* 4. Leadership & Organizations */}
            <CvOrganizationSection organizations={organizations} />

            {/* 5. Education Credentials */}
            <CvEducationSection education={education} />

            {/* 6. Certifications & Licenses */}
            <CvCertificationsSection certifications={certifications} />
          </>
        ) : (
          /* Document Sheet View: ATS-formatted printable resume */
          profile && <CvDocumentPreview profile={profile} />
        )}
      </ScrollView>

      {/* Hunter AI Audit Modal */}
      <HunterAuditModal
        visible={isHunterAuditVisible}
        metrics={cvHealth}
        onClose={() => setIsHunterAuditVisible(false)}
      />

      {/* Comprehensive CV Dossier Builder Modal */}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.5,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 26,
    lineHeight: 30,
    color: '#121212',
    fontWeight: '900',
  },
  editHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
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
    padding: 3,
    marginTop: 4,
    gap: 4,
  },
  togglePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  togglePillActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
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
    borderColor: '#E8ECDF',
    marginTop: 10,
  },
  summaryText: {
    fontSize: 12,
    lineHeight: 20,
    color: '#343830',
  },
});
