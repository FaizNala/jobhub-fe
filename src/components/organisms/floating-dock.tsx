import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname, router } from 'expo-router';
import { Compass, Bookmark, Target, User } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';

export interface DockTabItem {
  id: string;
  route: string;
  label: string;
  icon: typeof Compass;
}

export const DOCK_TABS: DockTabItem[] = [
  { id: 'explore', route: '/', label: 'Explore', icon: Compass },
  { id: 'jobs', route: '/jobs', label: 'Saved', icon: Bookmark },
  { id: 'agent', route: '/agent', label: 'Prep', icon: Target },
  { id: 'profile', route: '/profile', label: 'Profile', icon: User },
];

export function FloatingDock() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const isTabActive = (route: string) => {
    if (route === '/') {
      return pathname === '/' || pathname === '' || pathname === '/index';
    }
    return pathname.startsWith(route);
  };

  const handleTabPress = (route: string) => {
    Haptics.selectionAsync().catch(() => {});
    if (!isTabActive(route)) {
      router.replace(route as any);
    }
  };

  const bottomInset = Math.max(insets.bottom + 8, 20);

  return (
    <View style={[styles.dockWrapper, { bottom: bottomInset }]} pointerEvents="box-none">
      <View style={styles.dockContainer}>
        {DOCK_TABS.map(tab => {
          const isActive = isTabActive(tab.route);

          return (
            <DockButton
              key={tab.id}
              tab={tab}
              isActive={isActive}
              onPress={() => handleTabPress(tab.route)}
            />
          );
        })}
      </View>
    </View>
  );
}

interface DockButtonProps {
  tab: DockTabItem;
  isActive: boolean;
  onPress: () => void;
}

function DockButton({ tab, isActive, onPress }: DockButtonProps) {
  const scale = useSharedValue(1);
  const IconComponent = tab.icon;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 350 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 350 });
  };

  return (
    <Animated.View style={[animatedStyle, styles.tabSlot]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
        accessibilityLabel={tab.label}
        style={[styles.tabButton, isActive && styles.tabButtonActive]}>
        <IconComponent
          size={19}
          color={isActive ? '#121212' : '#8A8D84'}
          strokeWidth={isActive ? 2.4 : 1.9}
        />
        <Text style={[styles.tabLabel, isActive ? styles.labelActive : styles.labelInactive]}>
          {tab.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  dockWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  dockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121212',
    width: 320,
    height: 60,
    borderRadius: 30, // Perfectly rounded capsule
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 12,
  },
  tabSlot: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButton: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: Colors.light.primary, // Symmetrical Electric Lime active capsule
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: -0.1,
  },
  labelInactive: {
    color: '#8A8D84',
    fontWeight: '500',
  },
  labelActive: {
    color: '#121212',
    fontWeight: '800',
  },
});
