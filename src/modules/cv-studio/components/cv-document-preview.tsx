import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Check, Printer, Share2 } from 'lucide-react-native';
import { Radius } from '@/constants/theme';
import { Body, Heading, Label } from '@/components/atoms/typography';
import { CandidateProfile } from '../cv.types';
import { exportResumePdf, shareResumePdf } from '../cv-pdf.service';

export interface CvDocumentPreviewProps {
  profile: CandidateProfile;
}

export const CvDocumentPreview: React.FC<CvDocumentPreviewProps> = ({ profile }) => {
  const [exported, setExported] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExport = async () => {
    Haptics.selectionAsync().catch(() => {});
    setExportError(null);
    const success =
      Platform.OS === 'web'
        ? await exportResumePdf(profile)
        : await shareResumePdf(profile);
    if (success) {
      setExported(true);
      setTimeout(() => setExported(false), 2400);
    } else {
      setExportError('Unable to export PDF on this device right now.');
    }
  };

  const contactItems = [
    profile.location,
    profile.contact?.phone,
    profile.contact?.email,
    profile.contact?.linkedin,
    profile.contact?.github,
    profile.contact?.portfolio,
  ].filter(Boolean);

  const hardOrFallbackSkills =
    profile.hardSkills?.length > 0 ? profile.hardSkills : profile.skills || [];

  return (
    <View style={styles.container}>
      {/* Action Toolbar */}
      <View style={styles.toolbar}>
        <Body style={styles.toolbarHint}>A4 ATS Print Layout</Body>
        <Pressable
          onPress={handleExport}
          style={state => [
            styles.btnPrimary,
            state.pressed && styles.pressedFade,
            Platform.OS === 'web' && (state as { focused?: boolean }).focused
              ? styles.webFocusRing
              : null,
            Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null,
          ]}
          accessibilityRole="button"
          accessibilityLabel={
            Platform.OS === 'web' ? 'Print or save CV as PDF' : 'Export CV as PDF'
          }>
          {exported ? (
            <Check size={14} color="#B8F23E" strokeWidth={2.5} />
          ) : Platform.OS === 'web' ? (
            <Printer size={14} color="#FFFFFF" strokeWidth={2.2} />
          ) : (
            <Share2 size={14} color="#FFFFFF" strokeWidth={2.2} />
          )}
          <Label style={styles.btnPrimaryText}>
            {exported
              ? 'READY'
              : Platform.OS === 'web'
              ? 'PRINT / SAVE PDF'
              : 'EXPORT PDF'}
          </Label>
        </Pressable>
      </View>

      {exportError ? (
        <View style={styles.errorBanner} accessibilityLiveRegion="polite">
          <Text style={styles.errorText}>{exportError}</Text>
        </View>
      ) : null}

      {/* Realistic ATS Document Paper Sheet */}
      <View nativeID="ats-cv-paper" style={styles.paper}>
        <View style={styles.docHeader}>
          <Heading style={styles.docName}>{profile.fullName}</Heading>
          <Body style={styles.docHeadline}>{profile.headline}</Body>
          <Body style={styles.docContactLine}>{contactItems.join('  |  ')}</Body>
        </View>

        {profile.summary ? (
          <View style={styles.section}>
            <Heading style={styles.sectionHeading}>PROFESSIONAL SUMMARY</Heading>
            <View style={styles.rule} />
            <Body style={styles.bodyText}>{profile.summary}</Body>
          </View>
        ) : null}

        {(hardOrFallbackSkills.length > 0 || profile.softSkills?.length > 0) ? (
          <View style={styles.section}>
            <Heading style={styles.sectionHeading}>TECHNICAL & PROFESSIONAL SKILLS</Heading>
            <View style={styles.rule} />
            {hardOrFallbackSkills.length > 0 ? (
              <View style={styles.skillRow}>
                <Body style={styles.skillLabel}>Core & Technical Skills:</Body>
                <Body style={styles.skillList}>{hardOrFallbackSkills.join(', ')}</Body>
              </View>
            ) : null}
            {profile.softSkills?.length > 0 ? (
              <View style={styles.skillRow}>
                <Body style={styles.skillLabel}>Leadership & Soft Skills:</Body>
                <Body style={styles.skillList}>{profile.softSkills.join(', ')}</Body>
              </View>
            ) : null}
          </View>
        ) : null}

        {profile.experiences && profile.experiences.length > 0 ? (
          <View style={styles.section}>
            <Heading style={styles.sectionHeading}>WORK EXPERIENCE</Heading>
            <View style={styles.rule} />
            {profile.experiences.map(exp => (
              <View key={exp.id} style={styles.entryBlock}>
                <View style={styles.entryHeaderRow}>
                  <View style={styles.entryTitleColumn}>
                    <Heading style={styles.entryRole}>{exp.role}</Heading>
                    <Body style={styles.entryCompany}>{exp.company}</Body>
                  </View>
                  <View style={styles.entryMetaColumn}>
                    <Body style={styles.entryPeriod}>{exp.period}</Body>
                    {exp.location ? (
                      <Body style={styles.entryLocation}>{exp.location}</Body>
                    ) : null}
                  </View>
                </View>

                <View style={styles.bulletsWrap}>
                  {exp.highlights.map((h, i) => (
                    <View key={i} style={styles.bulletRow}>
                      <Body style={styles.bulletSymbol}>•</Body>
                      <Body style={styles.bulletText}>{h}</Body>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {profile.projects && profile.projects.length > 0 ? (
          <View style={styles.section}>
            <Heading style={styles.sectionHeading}>PROJECTS</Heading>
            <View style={styles.rule} />
            {profile.projects.map(proj => (
              <View key={proj.id} style={styles.entryBlock}>
                <View style={styles.entryHeaderRow}>
                  <View style={styles.entryTitleColumn}>
                    <Heading style={styles.entryRole}>{proj.name}</Heading>
                    <Body style={styles.entryCompany}>{proj.role}</Body>
                  </View>
                  <Body style={styles.entryPeriod}>{proj.period}</Body>
                </View>

                {proj.techStack?.length > 0 ? (
                  <Body style={styles.projectStack}>
                    Tools & Stack: {proj.techStack.join(', ')}
                  </Body>
                ) : null}

                {proj.highlights?.length > 0 ? (
                  <View style={styles.bulletsWrap}>
                    {proj.highlights.map((h, i) => (
                      <View key={i} style={styles.bulletRow}>
                        <Body style={styles.bulletSymbol}>•</Body>
                        <Body style={styles.bulletText}>{h}</Body>
                      </View>
                    ))}
                  </View>
                ) : proj.overview || proj.description ? (
                  <Body style={styles.bodyText}>
                    {proj.overview || proj.description}
                  </Body>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {profile.organizations && profile.organizations.length > 0 ? (
          <View style={styles.section}>
            <Heading style={styles.sectionHeading}>LEADERSHIP & ORGANIZATIONS</Heading>
            <View style={styles.rule} />
            {profile.organizations.map(org => (
              <View key={org.id} style={styles.entryBlock}>
                <View style={styles.entryHeaderRow}>
                  <Heading style={styles.entryRole}>{org.role}</Heading>
                  <Body style={styles.entryPeriod}>{org.period}</Body>
                </View>
                <Body style={styles.entryCompany}>{org.organization}</Body>
                {org.highlights && org.highlights.length > 0 ? (
                  <View style={styles.bulletsWrap}>
                    {org.highlights.map((h, i) => (
                      <View key={i} style={styles.bulletRow}>
                        <Body style={styles.bulletSymbol}>•</Body>
                        <Body style={styles.bulletText}>{h}</Body>
                      </View>
                    ))}
                  </View>
                ) : org.description ? (
                  <Body style={styles.bodyText}>{org.description}</Body>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {profile.education && profile.education.length > 0 ? (
          <View style={styles.section}>
            <Heading style={styles.sectionHeading}>EDUCATION</Heading>
            <View style={styles.rule} />
            {profile.education.map(edu => (
              <View key={edu.id} style={styles.entryBlock}>
                <View style={styles.entryHeaderRow}>
                  <Heading style={styles.entryRole}>{edu.degree}</Heading>
                  <Body style={styles.entryPeriod}>{edu.year}</Body>
                </View>
                <Body style={styles.entryCompany}>
                  {edu.school}{edu.field ? `, ${edu.field}` : ''}
                </Body>
                {edu.gpa ? <Body style={styles.metaHonors}>{edu.gpa}</Body> : null}
                {edu.highlights && edu.highlights.length > 0 ? (
                  <View style={styles.bulletsWrap}>
                    {edu.highlights.map((h, i) => (
                      <View key={i} style={styles.bulletRow}>
                        <Body style={styles.bulletSymbol}>•</Body>
                        <Body style={styles.bulletText}>{h}</Body>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {profile.certifications && profile.certifications.length > 0 ? (
          <View style={styles.section}>
            <Heading style={styles.sectionHeading}>CERTIFICATIONS</Heading>
            <View style={styles.rule} />
            {profile.certifications.map(cert => (
              <View key={cert.id} style={styles.certRow}>
                <Body style={styles.bulletSymbol}>•</Body>
                <Body style={styles.certText}>
                  <Body style={styles.certName}>{cert.name}</Body> - {cert.issuer} ({cert.issueDate})
                </Body>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 18,
    gap: 14,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  toolbarHint: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5A5D54',
  },
  btnPrimary: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    borderRadius: Radius.full,
  },
  btnPrimaryText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: Radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#991B1B',
  },
  paper: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.sm,
    padding: 26,
    borderWidth: 1.5,
    borderColor: '#E2E6DC',
    gap: 16,
  },
  docHeader: {
    alignItems: 'center',
    gap: 4,
    paddingBottom: 4,
  },
  docName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  docHeadline: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#2F4F00',
    textAlign: 'center',
  },
  docContactLine: {
    fontSize: 11,
    color: '#5A5D54',
    textAlign: 'center',
    marginTop: 2,
  },
  section: {
    gap: 4,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.8,
  },
  rule: {
    height: 1,
    backgroundColor: '#121212',
    marginBottom: 6,
  },
  bodyText: {
    fontSize: 11.5,
    lineHeight: 17,
    color: '#2C3028',
  },
  skillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  skillLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#121212',
  },
  skillList: {
    fontSize: 11.5,
    color: '#2C3028',
    flex: 1,
  },
  entryBlock: {
    gap: 2,
    marginTop: 6,
  },
  entryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 8,
  },
  entryTitleColumn: {
    flex: 1,
  },
  entryRole: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#121212',
  },
  entryCompany: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#2F4F00',
  },
  entryMetaColumn: {
    alignItems: 'flex-end',
  },
  entryPeriod: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5A5D54',
  },
  entryLocation: {
    fontSize: 10.5,
    color: '#5A5D54',
  },
  projectStack: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5A5D54',
    marginVertical: 2,
  },
  metaHonors: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#5A5D54',
  },
  bulletsWrap: {
    gap: 3,
    marginTop: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  bulletSymbol: {
    fontSize: 11,
    color: '#121212',
    marginTop: 1,
  },
  bulletText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16.5,
    color: '#2C3028',
  },
  certRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 3,
  },
  certText: {
    flex: 1,
    fontSize: 11.5,
    color: '#2C3028',
  },
  certName: {
    fontWeight: '700',
    color: '#121212',
  },
  pressedFade: {
    opacity: 0.82,
  },
  webFocusRing: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#121212',
    outlineOffset: 2,
  } as any,
});
