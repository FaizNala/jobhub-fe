import React from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { Image } from 'expo-image';

interface Props {
  width?: DimensionValue;
  height?: DimensionValue;
  style?: ViewStyle;
}

const ONBOARDING_JOBS_ASSET = require('../../../assets/images/onboarding-jobs.jpg');

/**
 * OnboardingJobsIllustration (Slide 1: Verified Opportunities)
 *
 * Renders the bespoke editorial spot illustration generated in JobHub's palette
 * (#FFFFFF, #121212, #1E293B, #B8F23E).
 */
export function OnboardingJobsIllustration({
  width = 320,
  height = 240,
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={ONBOARDING_JOBS_ASSET}
        style={{ width, height }}
        contentFit="contain"
        transition={180}
        accessibilityLabel="Professional looking through lime binoculars toward verified role card"
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
