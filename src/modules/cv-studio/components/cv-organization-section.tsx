import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Users2 } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { Heading, Body, Label } from '@/components/atoms/typography';
import { OrganizationItem } from '../cv.types';

export interface CvOrganizationSectionProps {
  organizations: OrganizationItem[];
}

export const CvOrganizationSection: React.FC<CvOrganizationSectionProps> = ({
  organizations,
}) => {
  if (!organizations || organizations.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <Users2 size={15} color="#121212" />
          <Heading style={styles.sectionTitle}>Leadership & Community</Heading>
        </View>
        <Label style={styles.countBadge}>{organizations.length} ACTIVITIES</Label>
      </View>

      <View style={styles.list}>
        {organizations.map(org => (
          <View key={org.id} style={styles.card}>
            <View style={styles.cardTopRow}>
              <View style={styles.titleBlock}>
                <Heading style={styles.orgRole}>{org.role}</Heading>
                <Body style={styles.orgName}>{org.organization}</Body>
              </View>
              <View style={styles.periodPill}>
                <Label style={styles.periodText}>{org.period}</Label>
              </View>
            </View>

            {org.description ? (
              <Body style={styles.descriptionText}>{org.description}</Body>
            ) : null}

            {org.highlights && org.highlights.length > 0 ? (
              <View style={styles.highlightsContainer}>
                {org.highlights.map((h, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <View style={styles.bulletDot} />
                    <Body style={styles.bulletText}>{h}</Body>
                  </View>
                ))}
              </View>
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
    color: '#5A5D54',
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
    gap: 8,
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
  orgRole: {
    fontSize: 14,
    fontWeight: '800',
    color: '#121212',
  },
  orgName: {
    fontSize: 12,
    color: '#5A5D54',
  },
  periodPill: {
    backgroundColor: '#F4F6F0',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#E2E6DC',
  },
  periodText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#5A5D54',
  },
  descriptionText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#3A3D34',
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
});
