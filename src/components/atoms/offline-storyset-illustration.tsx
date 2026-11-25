import React from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { Image } from 'expo-image';

interface Props {
  width?: DimensionValue;
  height?: DimensionValue;
  style?: ViewStyle;
}

const OFFLINE_ERROR_ASSET = require('../../../assets/images/offline-error.jpg');

/**
 * OfflineStorysetIllustration
 *
 * Renders the bespoke editorial spot illustration for the offline/connection
 * error bottom sheet & dialog in JobHub's signature palette.
 */
export function OfflineStorysetIllustration({
  width = 220,
  height = 155,
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={OFFLINE_ERROR_ASSET}
        style={{ width, height }}
        contentFit="contain"
        transition={180}
        accessibilityLabel="Puzzled professional holding phone beside unplugged router and disconnected Wi-Fi icon"
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
