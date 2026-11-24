import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { FileCheck, ArrowRight } from 'lucide-react-native';
import { Radius } from '@/constants/theme';
import { Label } from '@/components/atoms/typography';

export function DossierReadinessCard() {
  const handleOpenCv = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push('/cv');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.iconCircle}>
            <FileCheck size={19} color="#15803D" strokeWidth={2.2} />
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.categoryLabel}>Resume & Profile</Text>
            <Text style={styles.title}>Michel Clark • 94% ATS Strength</Text>
            <Text style={styles.subtitle}>
              Profile formatted and tailored for senior mobile roles. Ready to export or update.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleOpenCv}
          activeOpacity={0.8}
          style={styles.actionBtn}
          accessibilityRole="button"
          accessibilityLabel="Open CV Studio and export PDF">
          <Text style={styles.actionBtnText}>Open CV Studio & Export PDF</Text>
          <ArrowRight size={13} color="#121212" strokeWidth={2.4} />
        </TouchableOpacity>
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
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: '#E2E6DC',
    padding: 16,
    gap: 12,
    shadowColor: '#121212',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4FDE8',
    borderWidth: 1,
    borderColor: '#D9F99D',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F6F0',
    borderWidth: 1,
    borderColor: '#E2E6DC',
    borderRadius: Radius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 2,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#121212',
  },
});
