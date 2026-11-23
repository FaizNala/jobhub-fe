import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Radius } from '@/constants/theme';

interface PillButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'dark' | 'primary' | 'outline';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  disabled?: boolean;
}

export function PillButton({
  label,
  onPress,
  variant = 'dark',
  icon,
  iconPosition = 'left',
  style,
  disabled = false,
}: PillButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress();
  };

  const getContainerStyle = () => {
    switch (variant) {
      case 'primary':
        return [styles.container, styles.primaryBg];
      case 'outline':
        return [styles.container, styles.outlineBg];
      case 'dark':
      default:
        return [styles.container, styles.darkBg];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'outline':
        return styles.outlineText;
      case 'dark':
      default:
        return styles.darkText;
    }
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={getContainerStyle()}>
        {icon && iconPosition === 'left' ? icon : null}
        <Text style={[styles.textBase, getTextStyle()]}>{label}</Text>
        {icon && iconPosition === 'right' ? icon : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: Radius.full,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minWidth: 100,
  },
  darkBg: {
    backgroundColor: Colors.light.darkAnchor,
  },
  primaryBg: {
    backgroundColor: Colors.light.primary,
  },
  outlineBg: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  textBase: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  darkText: {
    color: '#FFFFFF',
  },
  primaryText: {
    color: '#121212',
  },
  outlineText: {
    color: '#121212',
  },
});
