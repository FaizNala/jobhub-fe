import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface CandidateAvatarProps {
  size?: number;
}

export function CandidateAvatar({ size = 44 }: CandidateAvatarProps) {
  return (
    <View style={[styles.avatarWrapper, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
        <Defs>
          <LinearGradient id="avatarGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <Stop stopColor="#2A2C27" />
            <Stop offset="1" stopColor="#121212" />
          </LinearGradient>
        </Defs>

        {/* Outer subtle ring */}
        <Circle cx="22" cy="22" r="21" fill="url(#avatarGrad)" stroke="#E5E8DE" strokeWidth="1.5" />

        {/* Head */}
        <Circle cx="22" cy="16" r="6" fill="#F4F6F0" />

        {/* Shoulders / Torso */}
        <Path
          d="M11 34C11 28.5 15.5 25 22 25C28.5 25 33 28.5 33 34"
          stroke="#F4F6F0"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Small active status dot */}
        <Circle cx="34" cy="10" r="3.5" fill="#B8F23E" stroke="#121212" strokeWidth="1.5" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
