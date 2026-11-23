import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname, router } from 'expo-router';
import { Compass, Briefcase, Bot, FileText, User } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export interface DockTabItem {
  id: string;
  route: string;
  label: string;
  icon: any;
  isHero?: boolean;
}

export const DOCK_TABS: DockTabItem[] = [
  { id: 'explore', route: '/', label: 'Explore', icon: Compass },
  { id: 'tracker', route: '/jobs', label: 'Tracker', icon: Briefcase },
  { id: 'hunter', route: '/agent', label: 'Hunter', icon: Bot, isHero: true }, // The Star: AI Bot
  { id: 'cv', route: '/cv', label: 'CV Studio', icon: FileText },
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
  const IconComponent = tab.icon;

  // Center Hero Button for Hunter AI (No rubber bounce, no dot pips)
  if (tab.isHero) {
    return (
      <View style={styles.heroSlot}>
        <Pressable
          onPress={onPress}
          accessibilityRole="tab"
          accessibilityState={{ selected: isActive }}
          accessibilityLabel="AI Hunter Agent"
          style={({ pressed }) => [
            styles.heroButton,
            isActive ? styles.heroActive : styles.heroInactive,
            pressed && styles.pressedState,
          ]}>
          <IconComponent
            size={22}
            color={isActive ? '#121212' : '#B8F23E'}
            strokeWidth={isActive ? 2.6 : 2.1}
          />
        </Pressable>
        <Text
          numberOfLines={1}
          style={[styles.heroText, isActive ? styles.heroTextActive : styles.heroTextInactive]}>
          Hunter
        </Text>
      </View>
    );
  }

  // Pure & Mature Standard Tabs (No blunt blocks, no extra dot accents)
  return (
    <View style={styles.tabSlot}>
      <Pressable
        onPress={onPress}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
        accessibilityLabel={tab.label}
        style={({ pressed }) => [styles.tabButton, pressed && styles.pressedState]}>
        <IconComponent
          size={19}
          color={isActive ? '#FFFFFF' : '#73786B'}
          strokeWidth={isActive ? 2.4 : 1.8}
        />
        <Text
          numberOfLines={1}
          style={[styles.tabLabel, isActive ? styles.labelActive : styles.labelInactive]}>
          {tab.label}
        </Text>
      </Pressable>
    </View>
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
    backgroundColor: '#121411', // Deep Obsidian Glass
    width: 348,
    height: 64,
    borderRadius: 32, // Perfect pill capsule
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
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
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  pressedState: {
    opacity: 0.65, // Crisp, instant native touch feedback (zero rubber bounce)
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: -0.1,
  },
  labelInactive: {
    color: '#73786B',
    fontWeight: '500',
  },
  labelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* Center Hunter Hero Button */
  heroSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    gap: 3,
  },
  heroButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroActive: {
    backgroundColor: '#B8F23E', // Radiant Electric Lime
    shadowColor: '#B8F23E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  heroInactive: {
    backgroundColor: '#1A1D16', // Deep Obsidian-Olive
    borderWidth: 1.5,
    borderColor: 'rgba(184, 242, 62, 0.4)',
    shadowColor: '#B8F23E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  heroText: {
    fontSize: 9.5,
    letterSpacing: 0.2,
  },
  heroTextActive: {
    color: '#B8F23E',
    fontWeight: '800',
  },
  heroTextInactive: {
    color: '#B8F23E',
    fontWeight: '600',
  },
});
