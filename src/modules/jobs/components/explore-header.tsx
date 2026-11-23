import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { SlidersHorizontal, Search } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Radius } from '@/constants/theme';
import { Display, Body, Label } from '@/components/atoms/typography';
import { CandidateAvatar } from '@/components/atoms/candidate-avatar';

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
      {/* Top Candidate Row with Real SVG Avatar */}
      <View style={styles.userRow}>
        <CandidateAvatar size={44} />

        <View style={styles.userInfo}>
          <Label style={styles.userName}>Michel Clark</Label>
          <Body style={styles.userRole}>Software Engineer</Body>
        </View>

        <Pressable
          onPress={handleSearchPress}
          accessibilityRole="button"
          accessibilityLabel="Search positions"
          style={styles.searchIconButton}>
          <Search size={18} color="#121212" strokeWidth={2.2} />
        </Pressable>
      </View>

      {/* Main Title & Filter Trigger */}
      <View style={styles.titleRow}>
        <Display style={styles.heroText}>
          EXPLORE{'\n'}VACANCIES
        </Display>

        <Pressable
          onPress={handleFilterPress}
          accessibilityRole="button"
          accessibilityLabel="Open filters"
          style={styles.filterButton}>
          <SlidersHorizontal size={14} color="#121212" strokeWidth={2.2} />
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
    color: '#5A5D54',
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
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
    fontWeight: '900',
    letterSpacing: -0.8,
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  filterText: {
    fontSize: 13,
    color: '#121212',
    fontWeight: '600',
  },
});
