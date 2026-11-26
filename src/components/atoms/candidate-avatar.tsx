import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

interface CandidateAvatarProps {
  size?: number;
  name?: string;
  tone?: 'light' | 'dark';
}

function getInitials(name?: string): string {
  if (!name) return '';
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function CandidateAvatar({
  size = 44,
  name,
  tone = 'light',
}: CandidateAvatarProps) {
  const initials = getInitials(name);
  const dotSize = Math.max(10, Math.round(size * 0.22));
  const isDarkSurface = tone === 'dark';

  return (
    <View
      style={[
        styles.avatarWrapper,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isDarkSurface ? '#1C1E1A' : '#121212',
          borderColor: isDarkSurface ? '#B8F23E' : '#E2E6DC',
        },
      ]}
      accessibilityLabel={name ? `${name} avatar` : 'Candidate avatar'}>
      {initials ? (
        <Text
          style={[
            styles.initialsText,
            {
              fontSize: Math.round(size * 0.36),
              color: isDarkSurface ? '#B8F23E' : '#FFFFFF',
            },
          ]}>
          {initials}
        </Text>
      ) : (
        <Svg width={size * 0.68} height={size * 0.68} viewBox="0 0 32 32" fill="none">
          <Circle cx="16" cy="11.5" r="4.5" fill="#F4F6F0" />
          <Path
            d="M8 25C8 20.8 11.4 18 16 18C20.6 18 24 20.8 24 25"
            stroke="#F4F6F0"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </Svg>
      )}

      <View
        style={[
          styles.activeDot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            borderColor: isDarkSurface ? '#121212' : '#FFFFFF',
          },
        ]}
        accessibilityElementsHidden
      />
    </View>
  );
}

const styles = StyleSheet.create({
  avatarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    position: 'relative',
  },
  initialsText: {
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  activeDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#B8F23E',
    borderWidth: 2,
  },
});
