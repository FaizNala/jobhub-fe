import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { Heading, Body, Label } from '@/components/atoms/typography';

export interface CvSkillsCategorizedSectionProps {
  hardSkills: string[];
  softSkills: string[];
}

export const CvSkillsCategorizedSection: React.FC<CvSkillsCategorizedSectionProps> = ({
  hardSkills,
  softSkills,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Heading style={styles.sectionTitle}>Skills & Competencies</Heading>
        <Label style={styles.totalBadge}>
          {hardSkills.length + softSkills.length} Skills
        </Label>
      </View>

      <View style={styles.card}>
        {/* Technical Skills */}
        <View style={styles.skillBlock}>
          <Label style={styles.blockLabel}>Technical Skills</Label>
          <View style={styles.chipsRow}>
            {hardSkills.map(skill => (
              <View key={skill} style={styles.hardChip}>
                <Body style={styles.hardChipText}>{skill}</Body>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Soft Skills */}
        <View style={styles.skillBlock}>
          <Label style={styles.blockLabel}>Soft Skills</Label>
          <View style={styles.chipsRow}>
            {softSkills.map(skill => (
              <View key={skill} style={styles.softChip}>
                <Body style={styles.softChipText}>{skill}</Body>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.2,
  },
  totalBadge: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#5A5D54',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: 18,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    gap: 14,
  },
  skillBlock: {
    gap: 8,
  },
  blockLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.3,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  hardChip: {
    backgroundColor: '#EFFCD3',
    borderWidth: 1,
    borderColor: '#B8F23E',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
  },
  hardChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2F4F00',
  },
  softChip: {
    backgroundColor: '#F4F6F0',
    borderWidth: 1,
    borderColor: '#E2E6DC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
  },
  softChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3A3D34',
  },
  divider: {
    height: 1,
    backgroundColor: '#F4F6F0',
  },
});
