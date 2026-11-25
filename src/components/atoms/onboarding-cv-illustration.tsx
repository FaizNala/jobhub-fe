import React from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { Image } from 'expo-image';

interface Props {
  width?: DimensionValue;
  height?: DimensionValue;
  style?: ViewStyle;
}

const ONBOARDING_CV_ASSET = require('../../../assets/images/onboarding-cv.jpg');

/**
 * OnboardingCvIllustration (Slide 3: ATS-Ready CV Studio)
 *
 * Renders the bespoke editorial spot illustration generated in JobHub's palette
 * (#FFFFFF, #121212, #1E293B, #B8F23E).
 */
export function OnboardingCvIllustration({
  width = 320,
  height = 240,
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={ONBOARDING_CV_ASSET}
        style={{ width, height }}
        contentFit="contain"
        transition={180}
        accessibilityLabel="Professional holding oversized lime pencil presenting verified resume"
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
