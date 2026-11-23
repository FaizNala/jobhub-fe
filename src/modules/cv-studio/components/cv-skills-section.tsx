import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Cpu } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { Heading, Body, Label } from '@/components/atoms/typography';

export interface CvSkillsSectionProps {
  skills: string[];
}

export const CvSkillsSection: React.FC<CvSkillsSectionProps> = ({ skills }) => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.iconCircle}>
            <Cpu size={14} color="#121212" />
          </View>
          <Heading style={styles.sectionTitle}>TECHNICAL INVENTORY</Heading>
        </View>
        <Label style={styles.countBadge}>{skills.length} VERIFIED</Label>
      </View>

      <View style={styles.card}>
        <View style={styles.skillsWrapper}>
          {skills.map((skill, index) => {
            const isPrimary = index < 3;
            return (
              <View
                key={skill}
                style={[
                  styles.skillPill,
                  isPrimary ? styles.primaryPill : styles.neutralPill,
                ]}>
                <Body
                  style={[
                    styles.skillText,
                    isPrimary ? styles.primaryText : styles.neutralText,
                  ]}>
                  {skill}
                </Body>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 9999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.5,
  },
  countBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5A5D54',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  primaryPill: {
    backgroundColor: '#EFFCD3',
    borderColor: '#B8F23E',
  },
  neutralPill: {
    backgroundColor: '#F4F6F0',
    borderColor: '#E8ECDF',
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  primaryText: {
    color: '#2F4F00',
  },
  neutralText: {
    color: '#343830',
  },
});
