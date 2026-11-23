import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

interface CompanyLogoProps {
  company: string;
  size?: number;
}

export function CompanyLogo({ company, size = 44 }: CompanyLogoProps) {
  const norm = company.toLowerCase();

  if (norm.includes('uber')) {
    return (
      <View style={[styles.container, { width: size, height: size, backgroundColor: '#000000' }]}>
        <Svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
          {/* Uber geometric "U" symbol */}
          <Path
            d="M5 4V13C5 16.866 8.134 20 12 20C15.866 20 19 16.866 19 13V4H15V13C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13V4H5Z"
            fill="#FFFFFF"
          />
        </Svg>
      </View>
    );
  }

  if (norm.includes('amazon')) {
    return (
      <View style={[styles.container, { width: size, height: size, backgroundColor: '#FFFFFF', borderColor: '#E5E8DE', borderWidth: 1 }]}>
        <Svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="none">
          {/* Amazon 'a' glyph */}
          <Path
            d="M13.8 12.8C13.8 10.9 12.5 9.7 10.4 9.7C8.7 9.7 7.4 10.6 6.8 11.5L8.1 12.4C8.6 11.8 9.3 11.3 10.3 11.3C11.5 11.3 12.1 11.9 12.1 12.9V13.1C9.6 13.2 7.2 13.8 7.2 15.6C7.2 16.8 8.1 17.8 9.6 17.8C10.9 17.8 11.8 17.1 12.2 16.4V17.6H13.8V12.8ZM12.1 14.8C11.8 15.6 10.9 16.3 9.8 16.3C8.9 16.3 8.5 15.8 8.5 15.2C8.5 14.1 9.9 13.7 12.1 13.6V14.8Z"
            fill="#121212"
          />
          {/* Signature Amazon smile curve */}
          <Path
            d="M5 19.5C8.8 21.8 14.2 21.5 18.5 18.2"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <Path
            d="M17.2 17.6L19 18.2L17.8 19.8"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    );
  }

  if (norm.includes('spotify')) {
    return (
      <View style={[styles.container, { width: size, height: size, backgroundColor: '#121212' }]}>
        <Svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="10" fill="#1DB954" />
          {/* 3 sound waves */}
          <Path
            d="M6.8 9.5C10.2 8.4 14.8 8.7 17.6 10.4"
            stroke="#121212"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <Path
            d="M7.4 12.3C10.2 11.4 14 11.7 16.5 13.1"
            stroke="#121212"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <Path
            d="M8.2 15C10.5 14.3 13.5 14.5 15.6 15.7"
            stroke="#121212"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </Svg>
      </View>
    );
  }

  if (norm.includes('google')) {
    return (
      <View style={[styles.container, { width: size, height: size, backgroundColor: '#FFFFFF', borderColor: '#E5E8DE', borderWidth: 1 }]}>
        <Svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
          {/* Clean Google 'G' geometric vector */}
          <Path
            d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.72 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z"
            fill="#4285F4"
          />
          <Path
            d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.72 17.57C14.73 18.23 13.48 18.63 12 18.63C9.13 18.63 6.7 16.69 5.83 14.09H2.15V16.94C3.96 20.53 7.69 23 12 23Z"
            fill="#34A853"
          />
          <Path
            d="M5.83 14.09C5.61 13.3 5.48 12.46 5.48 11.6C5.48 10.74 5.61 9.9 5.83 9.11V6.26H2.15C1.38 7.79 0.94 9.64 0.94 11.6C0.94 13.56 1.38 15.41 2.15 16.94L5.83 14.09Z"
            fill="#FBBC05"
          />
          <Path
            d="M12 4.58C13.62 4.58 15.07 5.14 16.21 6.23L19.36 3.08C17.45 1.3 14.96 0.2 12 0.2C7.69 0.2 3.96 2.67 2.15 6.26L5.83 9.11C6.7 6.51 9.13 4.58 12 4.58Z"
            fill="#EA4335"
          />
        </Svg>
      </View>
    );
  }

  // Default clean dark monogram container
  return (
    <View style={[styles.container, { width: size, height: size, backgroundColor: '#121212' }]}>
      <Svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="4" width="16" height="16" rx="4" stroke="#FFFFFF" strokeWidth="2" />
        <Path d="M9 12H15M12 9V15" stroke="#B8F23E" strokeWidth="2" strokeLinecap="round" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
