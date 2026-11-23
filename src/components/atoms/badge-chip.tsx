import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

export type BadgeVariant = 'neutral' | 'lime' | 'purple' | 'yellow' | 'coral' | 'dark';

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
          bg: '#EAF9CE',
          text: '#2F4F00',
          border: 'transparent',
        };
      case 'purple':
        return {
          bg: '#F0EEFF',
          text: '#4C40EB',
          border: 'transparent',
        };
      case 'yellow':
        return {
          bg: '#FFF8E6',
          text: '#92400E',
          border: 'transparent',
        };
      case 'coral':
        return {
          bg: '#FFF0EE',
          text: '#C22A1A',
          border: 'transparent',
        };
      case 'dark':
        return {
          bg: Colors.light.darkAnchor,
          text: '#FFFFFF',
          border: 'transparent',
        };
      case 'neutral':
      default:
        return {
          bg: '#FFFFFF',
          text: Colors.light.text,
          border: Colors.light.border,
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
      {icon ? <View style={styles.iconWrapper}>{icon}</View> : null}
      <Text style={[styles.label, { color: current.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  iconWrapper: {
    marginRight: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
