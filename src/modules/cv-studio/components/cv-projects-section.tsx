import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { FolderGit2, ExternalLink } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { Heading, Body, Label } from '@/components/atoms/typography';
import { ProjectItem } from '../cv.types';

export interface CvProjectsSectionProps {
  projects: ProjectItem[];
}

export const CvProjectsSection: React.FC<CvProjectsSectionProps> = ({ projects }) => {
  if (!projects || projects.length === 0) return null;

  const handleOpenLink = (url?: string) => {
    if (!url) return;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <FolderGit2 size={15} color="#121212" />
          <Heading style={styles.sectionTitle}>Featured Projects</Heading>
        </View>
        <Label style={styles.countBadge}>{projects.length} PROJECTS</Label>
      </View>

      <View style={styles.list}>
        {projects.map(proj => (
          <View key={proj.id} style={styles.card}>
            <View style={styles.cardTopRow}>
              <View style={styles.titleBlock}>
                <Heading style={styles.projectName}>{proj.name}</Heading>
                <Body style={styles.projectRole}>{proj.role}</Body>
              </View>
              <View style={styles.periodPill}>
                <Label style={styles.periodText}>{proj.period}</Label>
              </View>
            </View>

            {proj.overview ? (
              <Body style={styles.overviewText}>{proj.overview}</Body>
            ) : null}

            {/* Tech Stack Chips */}
            {proj.techStack && proj.techStack.length > 0 ? (
              <View style={styles.techStackRow}>
                {proj.techStack.map(tech => (
                  <View key={tech} style={styles.techChip}>
                    <Body style={styles.techChipText}>{tech}</Body>
                  </View>
                ))}
              </View>
            ) : null}

            {/* Bullet Highlights */}
            {proj.highlights && proj.highlights.length > 0 ? (
              <View style={styles.highlightsContainer}>
                {proj.highlights.map((h, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <View style={styles.bulletDot} />
                    <Body style={styles.bulletText}>{h}</Body>
                  </View>
                ))}
              </View>
            ) : null}

            {/* Optional URL */}
            {proj.url ? (
              <TouchableOpacity
                onPress={() => handleOpenLink(proj.url)}
                style={styles.linkButton}
                activeOpacity={0.8}
                accessibilityRole="link"
                accessibilityLabel={`Open repository for ${proj.name}`}>
                <ExternalLink size={12} color="#2F4F00" />
                <Label style={styles.linkText} numberOfLines={1}>
                  {proj.url.replace(/^https?:\/\//, '')}
                </Label>
              </TouchableOpacity>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.2,
  },
  countBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#73786B',
    letterSpacing: 0.5,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    gap: 10,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  projectName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#121212',
  },
  projectRole: {
    fontSize: 12,
    color: '#5A5D54',
  },
  periodPill: {
    backgroundColor: '#F4F6F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  periodText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#5A5D54',
  },
  overviewText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#3A3D34',
  },
  techStackRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  techChip: {
    backgroundColor: '#F9FAF7',
    borderWidth: 1,
    borderColor: '#E8ECDF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  techChipText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#4A4D44',
  },
  highlightsContainer: {
    gap: 6,
    paddingTop: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2F4F00',
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#343830',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  linkText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2F4F00',
  },
});
