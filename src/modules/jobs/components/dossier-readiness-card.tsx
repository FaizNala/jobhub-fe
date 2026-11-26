import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowRight, FileCheck } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

interface DossierReadinessCardProps {
  candidateName?: string;
  atsScore?: number;
  summaryText?: string;
}

export function DossierReadinessCard({
  candidateName,
  atsScore,
  summaryText,
}: DossierReadinessCardProps) {
  const handleOpenCv = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push('/cv');
  };

  const headline =
    candidateName && typeof atsScore === 'number'
      ? `${candidateName} · ${atsScore}% CV Readiness`
      : candidateName
        ? `${candidateName} · Career Dossier`
        : 'Master Career Dossier';

  const subtitle =
    summaryText ||
    'Master resume formatted for ATS readability across target roles. Open CV Studio to review or export.';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.iconCircle}>
            <FileCheck size={19} color="#15803D" strokeWidth={2.2} />
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.categoryLabel}>RESUME & DOSSIER</Text>
            <Text style={styles.title}>{headline}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        <Pressable
          onPress={handleOpenCv}
          style={state => [
            styles.actionBtn,
            state.pressed && styles.pressedFade,
            Platform.OS === 'web' && (state as { focused?: boolean }).focused
              ? styles.webFocusRing
              : null,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Open CV Studio and export PDF">
          <Text style={styles.actionBtnText}>Open CV Studio & Export PDF</Text>
          <ArrowRight size={14} color="#121212" strokeWidth={2.4} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    padding: 16,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: '#F4FDE8',
    borderWidth: 1,
    borderColor: '#C5E88B',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  headerInfo: {
    flex: 1,
    gap: 3,
  },
  categoryLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#5A5D54',
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 11.5,
    color: '#5A5D54',
    lineHeight: 16,
  },
  actionBtn: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F6F0',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 2,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#121212',
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
