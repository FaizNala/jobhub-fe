import React from 'react';
import { Platform, View, StyleSheet, Pressable, Linking } from 'react-native';
import { Award, ExternalLink } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { Heading, Body, Label } from '@/components/atoms/typography';
import { CertificationItem } from '../cv.types';

export interface CvCertificationsSectionProps {
  certifications: CertificationItem[];
}

export const CvCertificationsSection: React.FC<CvCertificationsSectionProps> = ({
  certifications,
}) => {
  if (!certifications || certifications.length === 0) return null;

  const handleOpenCert = (url?: string) => {
    if (!url) return;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <Award size={15} color="#121212" />
          <Heading style={styles.sectionTitle}>Certifications & Licenses</Heading>
        </View>
        <Label style={styles.countBadge}>{certifications.length} CREDENTIALS</Label>
      </View>

      <View style={styles.list}>
        {certifications.map(cert => (
          <View key={cert.id} style={styles.card}>
            <View style={styles.cardTopRow}>
              <View style={styles.titleBlock}>
                <Heading style={styles.certName}>{cert.name}</Heading>
                <Body style={styles.issuerName}>{cert.issuer}</Body>
              </View>
              <View style={styles.periodPill}>
                <Label style={styles.periodText}>{cert.issueDate}</Label>
              </View>
            </View>

            {cert.credentialUrl ? (
              <Pressable
                onPress={() => handleOpenCert(cert.credentialUrl)}
                style={state => [
                  styles.verifyLink,
                  state.pressed && styles.pressedFade,
                  Platform.OS === 'web' && (state as { focused?: boolean }).focused
                    ? styles.webFocusRing
                    : null,
                  Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null,
                ]}
                accessibilityRole="link"
                accessibilityLabel={`Verify credential for ${cert.name}`}>
                <ExternalLink size={13} color="#2F4F00" />
                <Label style={styles.verifyText}>Verify Credential</Label>
              </Pressable>
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
  certName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#121212',
  },
  issuerName: {
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
  verifyLink: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: Radius.sm,
  },
  verifyText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2F4F00',
  },
  pressedFade: {
    opacity: 0.78,
  },
  webFocusRing: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#121212',
    outlineOffset: 2,
  } as any,
});
