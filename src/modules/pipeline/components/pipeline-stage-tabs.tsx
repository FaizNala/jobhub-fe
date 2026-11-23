import React from 'react';
import { ScrollView, Pressable, View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Radius } from '@/constants/theme';
import { PipelineStage } from '../pipeline.types';

interface StageOption {
  id: PipelineStage | 'all';
  label: string;
}

const STAGE_OPTIONS: StageOption[] = [
  { id: 'all', label: 'All Jobs' },
  { id: 'shortlisted', label: 'Shortlist' },
  { id: 'applied', label: 'Applied' },
  { id: 'interviewing', label: 'Interview' },
  { id: 'offered', label: 'Offer' },
  { id: 'scouted', label: 'Scouted' },
];

interface PipelineStageTabsProps {
  selectedStage: PipelineStage | 'all';
  onSelectStage: (stage: PipelineStage | 'all') => void;
  counts: Record<string, number>;
}

export function PipelineStageTabs({
  selectedStage,
  onSelectStage,
  counts,
}: PipelineStageTabsProps) {
  const handleSelect = (stage: PipelineStage | 'all') => {
    Haptics.selectionAsync().catch(() => {});
    onSelectStage(stage);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {STAGE_OPTIONS.map(tab => {
        const isSelected = selectedStage === tab.id;
        const count = counts[tab.id] ?? 0;

        return (
          <Pressable
            key={tab.id}
            onPress={() => handleSelect(tab.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${tab.label}, ${count} roles`}
            style={[styles.pill, isSelected ? styles.pillSelected : styles.pillDefault]}>
            <Text style={[styles.pillText, isSelected ? styles.textSelected : styles.textDefault]}>
              {tab.label}
            </Text>
            <View style={[styles.badge, isSelected ? styles.badgeSelected : styles.badgeDefault]}>
              <Text style={[styles.badgeText, isSelected ? styles.badgeTextSelected : styles.badgeTextDefault]}>
                {count}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 8,
    paddingVertical: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  pillDefault: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.light.border,
  },
  pillSelected: {
    backgroundColor: Colors.light.primary, // Electric Lime matching FilterPillBar
    borderColor: Colors.light.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  textDefault: {
    color: Colors.light.text,
  },
  textSelected: {
    color: '#121212',
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDefault: {
    backgroundColor: '#EFF3E8',
  },
  badgeSelected: {
    backgroundColor: '#121212',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  badgeTextDefault: {
    color: '#5A5D54',
  },
  badgeTextSelected: {
    color: Colors.light.primary,
  },
});
