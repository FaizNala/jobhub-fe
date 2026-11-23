import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

export type BadgeVariant = 'neutral' | 'lime' | 'dark' | 'outline' | 'purple' | 'yellow' | 'coral';

interface BadgeChipProps {
  label: string;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function BadgeChip({ label, variant = 'neutral', icon, style }: BadgeChipProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'lime':
        return {
          bg: Colors.light.primary,
          text: '#121212',
          border: 'transparent',
          fontWeight: '700' as const,
        };
      case 'dark':
        return {
          bg: Colors.light.darkAnchor,
          text: '#FFFFFF',
          border: 'transparent',
          fontWeight: '600' as const,
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: Colors.light.text,
          border: Colors.light.border,
          fontWeight: '500' as const,
        };
      case 'neutral':
      case 'purple':
      case 'yellow':
      case 'coral':
      default:
        return {
          bg: Colors.light.tagBackground,
          text: Colors.light.tagText,
          border: 'transparent',
          fontWeight: '500' as const,
        };
    }
  };

  const current = getVariantStyles();

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: current.bg,
          borderColor: current.border,
          borderWidth: current.border !== 'transparent' ? 1 : 0,
        },
        style,
      ]}>
      {icon ? <View style={styles.iconBox}>{icon}</View> : null}
      <Text style={[styles.label, { color: current.text, fontWeight: current.fontWeight }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm, // Clean 8px soft-rect, NOT pill shape (R-11)
    alignSelf: 'flex-start',
  },
  iconBox: {
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    letterSpacing: -0.1,
  },
});
