import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { SlidersHorizontal, Search } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Radius } from '@/constants/theme';
import { Display, Body, Label } from '@/components/atoms/typography';

interface ExploreHeaderProps {
  onPressFilter?: () => void;
  onPressSearch?: () => void;
}

export function ExploreHeader({ onPressFilter, onPressSearch }: ExploreHeaderProps) {
  const handleFilterPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (onPressFilter) onPressFilter();
  };

  const handleSearchPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (onPressSearch) onPressSearch();
  };

  return (
    <View style={styles.container}>
      {/* Top Profile / Action Row */}
      <View style={styles.userRow}>
        <View style={styles.avatar}>
          <Label style={styles.avatarText}>MC</Label>
        </View>
        <View style={styles.userInfo}>
          <Label style={styles.userName}>Michel Clark</Label>
          <Body style={styles.userRole}>Software Engineer</Body>
        </View>

        <Pressable
          onPress={handleSearchPress}
          accessibilityRole="button"
          accessibilityLabel="Search positions"
          style={styles.searchIconButton}>
          <Search size={18} color="#121212" />
        </Pressable>
      </View>

      {/* Main Title & Filter Pill */}
      <View style={styles.titleRow}>
        <Display style={styles.heroText}>
          EXPLORE{'\n'}VACANCIES
        </Display>

        <Pressable
          onPress={handleFilterPress}
          accessibilityRole="button"
          accessibilityLabel="Open filters"
          style={styles.filterButton}>
          <SlidersHorizontal size={14} color="#121212" />
          <Label style={styles.filterText}>Filters</Label>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#121212',
  },
  avatarText: {
    fontSize: 14,
    color: '#121212',
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    color: '#121212',
    fontWeight: '700',
  },
  userRole: {
    fontSize: 12,
    color: '#6B6D66',
  },
  searchIconButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  heroText: {
    fontSize: 28,
    lineHeight: 32,
    color: '#121212',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 38,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  filterText: {
    fontSize: 13,
    color: '#121212',
    fontWeight: '600',
  },
});
