import React from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { Image } from 'expo-image';

interface Props {
  width?: DimensionValue;
  height?: DimensionValue;
  style?: ViewStyle;
}

const ONBOARDING_HUNTER_ASSET = require('../../../assets/images/onboarding-hunter.jpg');

/**
 * OnboardingHunterIllustration (Slide 2: Autonomous Career Agent)
 *
 * Renders the bespoke editorial spot illustration generated in JobHub's palette
 * (#FFFFFF, #121212, #1E293B, #B8F23E).
 */
export function OnboardingHunterIllustration({
  width = 320,
  height = 240,
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={ONBOARDING_HUNTER_ASSET}
        style={{ width, height }}
        contentFit="contain"
        transition={180}
        accessibilityLabel="Business professional running mid-stride holding coffee and checking live career radar tracker"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});
