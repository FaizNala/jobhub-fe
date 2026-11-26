import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, usePathname } from 'expo-router';
import { Bot, Briefcase, Compass, FileText, User } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Radius } from '@/constants/theme';

export type DockIconComponent = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

export interface DockTabItem {
  id: string;
  route: string;
  label: string;
  icon: DockIconComponent;
  isHero?: boolean;
}

export const DOCK_TABS: DockTabItem[] = [
  { id: 'explore', route: '/', label: 'Explore', icon: Compass },
  { id: 'tracker', route: '/jobs', label: 'Tracker', icon: Briefcase },
  { id: 'hunter', route: '/agent', label: 'Hunter', icon: Bot, isHero: true },
  { id: 'cv', route: '/cv', label: 'CV Studio', icon: FileText },
  { id: 'profile', route: '/profile', label: 'Profile', icon: User },
];

export function FloatingDock() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, () => setIsKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setIsKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (isKeyboardVisible) {
    return null;
  }

  const isTabActive = (route: string) => {
    if (route === '/') {
      return (
        pathname === '/' ||
        pathname === '' ||
        pathname === '/index' ||
        pathname === '/explore'
      );
    }
    return pathname === route || pathname.startsWith(`${route}/`);
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
      <View style={styles.dockContainer} accessibilityRole="tablist">
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

  // Center Hero Tab (Unified >= 44px Pressable covering both icon & label)
  if (tab.isHero) {
    return (
      <View style={styles.heroSlot}>
        <Pressable
          onPress={onPress}
          accessibilityRole="tab"
          accessibilityState={{ selected: isActive }}
          accessibilityLabel={`AI ${tab.label} Agent`}
          style={state => [
            styles.heroTabButton,
            state.pressed && styles.pressedState,
            Platform.OS === 'web' && (state as { focused?: boolean }).focused
              ? styles.webFocusRing
              : null,
          ]}>
          <View
            style={[
              styles.heroCircle,
              isActive ? styles.heroCircleActive : styles.heroCircleInactive,
            ]}>
            <IconComponent
              size={20}
              color={isActive ? '#121212' : '#D1D5DB'}
              strokeWidth={isActive ? 2.5 : 2}
            />
          </View>
          <Text
            numberOfLines={1}
            style={[styles.heroText, isActive ? styles.heroTextActive : styles.labelInactive]}>
            {tab.label}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.tabSlot}>
      <Pressable
        onPress={onPress}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
        accessibilityLabel={tab.label}
        style={state => [
          styles.tabButton,
          state.pressed && styles.pressedState,
          Platform.OS === 'web' && (state as { focused?: boolean }).focused
            ? styles.webFocusRing
            : null,
        ]}>
        <IconComponent
          size={19}
          color={isActive ? '#FFFFFF' : '#9CA3AF'}
          strokeWidth={isActive ? 2.4 : 1.9}
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
    paddingHorizontal: 16,
    alignItems: 'center',
    zIndex: 9999,
  },
  dockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121212',
    width: '100%',
    maxWidth: 380,
    height: 68,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#2A2D26',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 6,
  },
  tabSlot: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButton: {
    width: '100%',
    minHeight: 52,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: Radius.lg,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  pressedState: {
    opacity: 0.72,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: -0.1,
  },
  labelInactive: {
    color: '#9CA3AF',
    fontWeight: '500',
  },
  labelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  heroSlot: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTabButton: {
    width: '100%',
    minHeight: 52,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    borderRadius: Radius.lg,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  heroCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCircleActive: {
    backgroundColor: '#B8F23E',
  },
  heroCircleInactive: {
    backgroundColor: '#1C1E1A',
    borderWidth: 1,
    borderColor: '#2A2D26',
  },
  heroText: {
    fontSize: 10,
    letterSpacing: 0.1,
  },
  heroTextActive: {
    color: '#B8F23E',
    fontWeight: '800',
  },
  webFocusRing: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#B8F23E',
    outlineOffset: -3,
  } as any,
});
