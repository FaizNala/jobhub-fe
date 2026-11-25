import React from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { Image } from 'expo-image';

interface Props {
  width?: DimensionValue;
  height?: DimensionValue;
  style?: ViewStyle;
}

const AUTH_HERO_ASSET = require('../../../assets/images/auth-hero.jpg');

/**
 * AuthStorysetIllustration
 *
 * Renders the bespoke editorial desk workspace illustration for Login & Register
 * in JobHub's signature palette (#FFFFFF, #121212, #1E293B, #B8F23E).
 */
export function AuthStorysetIllustration({
  width = 420,
  height = 360,
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={AUTH_HERO_ASSET}
        style={{ width, height }}
        contentFit="contain"
        transition={180}
        accessibilityLabel="Professional working at desk with checklist and career growth chart"
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
