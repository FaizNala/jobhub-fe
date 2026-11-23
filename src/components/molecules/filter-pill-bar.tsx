import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Radius } from '@/constants/theme';
import { JobCategory } from '@/types/job';

interface FilterOption {
  id: JobCategory;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { id: 'all', label: 'All Jobs' },
  { id: 'remote', label: 'Remote' },
  { id: 'tech', label: 'Engineering' },
  { id: 'design', label: 'Design' },
  { id: 'finance', label: 'Business' },
];

interface FilterPillBarProps {
  selectedCategory: JobCategory;
  onSelectCategory: (category: JobCategory) => void;
}

export function FilterPillBar({ selectedCategory, onSelectCategory }: FilterPillBarProps) {
  const handleSelect = (category: JobCategory) => {
    Haptics.selectionAsync().catch(() => {});
    onSelectCategory(category);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {FILTER_OPTIONS.map(option => {
        const isSelected = selectedCategory === option.id;
        return (
          <Pressable
            key={option.id}
            onPress={() => handleSelect(option.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            style={[styles.pill, isSelected ? styles.pillSelected : styles.pillDefault]}>
            <Text style={[styles.pillText, isSelected ? styles.textSelected : styles.textDefault]}>
              {option.label}
            </Text>
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  pillDefault: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.light.border,
  },
  pillSelected: {
    backgroundColor: Colors.light.primary,
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
});
