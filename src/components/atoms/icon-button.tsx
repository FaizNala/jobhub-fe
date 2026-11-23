import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Radius } from '@/constants/theme';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  backgroundColor?: string;
  accessibilityLabel: string;
  style?: ViewStyle;
}

export function IconButton({
  icon,
  onPress,
  size = 44,
  backgroundColor = '#FFFFFF',
  accessibilityLabel,
  style,
}: IconButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 350 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 350 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress();
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={[
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: Radius.full,
            backgroundColor,
          },
        ]}>
        {icon}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
});
