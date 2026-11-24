import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Share2, Check } from 'lucide-react-native';
import { Radius } from '@/constants/theme';
import { Heading, Body, Label } from '@/components/atoms/typography';
import { CandidateProfile } from '../cv.types';
import { shareResumePdf } from '../cv-pdf.service';

export interface CvDocumentPreviewProps {
  profile: CandidateProfile;
}

export const CvDocumentPreview: React.FC<CvDocumentPreviewProps> = ({ profile }) => {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    Haptics.selectionAsync().catch(() => {});
    const success = await shareResumePdf(profile);
    if (success) {
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  const contactItems = [
    profile.location,
    profile.contact?.phone,
    profile.contact?.email,
    profile.contact?.linkedin,
    profile.contact?.github,
  ].filter(Boolean);

  return (
    <View style={styles.container}>
      {/* Action Toolbar: Share button aligned to the right */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          onPress={handleShare}
          style={styles.btnPrimary}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Share CV as PDF">
          {shared ? (
            <Check size={13} color="#B8F23E" />
          ) : (
            <Share2 size={13} color="#FFFFFF" />
          )}
          <Label style={styles.btnPrimaryText}>{shared ? 'SHARED' : 'SHARE'}</Label>
        </TouchableOpacity>
      </View>

      {/* Realistic ATS Document Paper Sheet */}
      <View nativeID="ats-cv-paper" style={styles.paper}>
        {/* Document Header */}
        <View style={styles.docHeader}>
          <Heading style={styles.docName}>{profile.fullName}</Heading>
          <Body style={styles.docHeadline}>{profile.headline}</Body>
          <Body style={styles.docContactLine}>{contactItems.join('  |  ')}</Body>
        </View>

        {/* Section: Professional Summary */}
        {profile.summary ? (
          <View style={styles.section}>
            <Heading style={styles.sectionHeading}>PROFESSIONAL SUMMARY</Heading>
            <View style={styles.rule} />
            <Body style={styles.bodyText}>{profile.summary}</Body>
          </View>
        ) : null}

        {/* Section: Skills & Competencies */}
        {(profile.hardSkills?.length > 0 || profile.softSkills?.length > 0 || (profile.skills && profile.skills.length > 0)) ? (
          <View style={styles.section}>
            <Heading style={styles.sectionHeading}>TECHNICAL & PROFESSIONAL SKILLS</Heading>
            <View style={styles.rule} />
            {(profile.hardSkills?.length > 0 || (profile.skills && profile.skills.length > 0)) ? (
              <View style={styles.skillRow}>
                <Body style={styles.skillLabel}>Technical Skills:</Body>
                <Body style={styles.skillList}>
                  {(profile.hardSkills?.length > 0 ? profile.hardSkills : profile.skills || []).join(', ')}
                </Body>
              </View>
            ) : null}
            {profile.softSkills?.length > 0 ? (
              <View style={styles.skillRow}>
                <Body style={styles.skillLabel}>Soft Skills:</Body>
                <Body style={styles.skillList}>{profile.softSkills.join(', ')}</Body>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Section: Work Experience */}
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

        {/* Section: Featured Projects */}
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
                    Technologies: {proj.techStack.join(', ')}
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

        {/* Section: Leadership & Community */}
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

        {/* Section: Education */}
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

        {/* Section: Certifications */}
        {profile.certifications && profile.certifications.length > 0 ? (
          <View style={styles.section}>
            <Heading style={styles.sectionHeading}>CERTIFICATIONS</Heading>
            <View style={styles.rule} />
            {profile.certifications.map(cert => (
              <View key={cert.id} style={styles.certRow}>
                <Body style={styles.bulletSymbol}>•</Body>
                <Body style={styles.certText}>
                  <Body style={styles.certName}>{cert.name}</Body>, {cert.issuer} ({cert.issueDate})
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
    marginTop: 20,
    gap: 16,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },
  btnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D8DEC9',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: Radius.full,
  },
  btnOutlineText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#121212',
    letterSpacing: 0.3,
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#121212',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: Radius.full,
  },
  btnPrimaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  paper: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.sm,
    padding: 28,
    borderWidth: 1,
    borderColor: '#D8DEC9',
    gap: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
    letterSpacing: 0.5,
  },
  docHeadline: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#2F4F00',
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
    fontSize: 11.5,
    color: '#2C3028',
  },
  certName: {
    fontWeight: '700',
    color: '#121212',
  },
});
