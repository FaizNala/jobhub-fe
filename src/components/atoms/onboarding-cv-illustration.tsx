import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, {
  G,
  Path,
  Rect,
  Circle,
  Ellipse,
} from 'react-native-svg';

interface Props {
  width?: number | string;
  height?: number | string;
  style?: ViewStyle;
}

/**
 * OnboardingCvIllustration (Slide 3: ATS-Ready CV Studio)
 * 
 * unDraw / Storyset style:
 * - Pure white skin (#FFFFFF) with dark charcoal outline (#121212)
 * - Tailored resume document with verified green checkmark badge
 * - ATS Score badge: "98% ATS MATCH"
 * - Instant export PDF / Markdown pill
 */
export function OnboardingCvIllustration({
  width = 280,
  height = 200,
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <Svg viewBox="0 0 320 230" width={width} height={height} fill="none">
        {/* Ground Shadow */}
        <Ellipse cx="160" cy="205" rx="110" ry="8" fill="#EEF3E8" />

        {/* Floating Large Resume Document (Center-Right) */}
        <G id="ResumeDoc">
          {/* Document Sheet with dog-ear fold */}
          <Path
            d="M175 32 H255 L285 62 V165 C285 172 279 178 272 178 H175 C168 178 162 172 162 165 V45 C162 38 168 32 175 32 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2"
          />
          {/* Dog-ear corner */}
          <Path d="M255 32 V62 H285" stroke="#121212" strokeWidth="2" fill="#FAFCF8" />

          {/* Profile Avatar placeholder */}
          <Circle cx="186" cy="56" r="12" fill="#B8F23E" />
          <Rect x="206" y="50" width="40" height="6" rx="3" fill="#1E293B" />
          <Rect x="206" y="60" width="30" height="4" rx="2" fill="#94A3B8" />

          {/* Section Divider */}
          <Path d="M176 76 H272" stroke="#E2E7DB" strokeWidth="1.5" />

          {/* Experience bullets with lime checkmarks */}
          <Circle cx="182" cy="90" r="4" fill="#B8F23E" />
          <Rect x="192" y="88" width="75" height="5" rx="2.5" fill="#1E293B" />
          <Rect x="192" y="97" width="55" height="4" rx="2" fill="#94A3B8" />

          <Circle cx="182" cy="115" r="4" fill="#B8F23E" />
          <Rect x="192" y="113" width="70" height="5" rx="2.5" fill="#1E293B" />
          <Rect x="192" y="122" width="60" height="4" rx="2" fill="#94A3B8" />

          <Circle cx="182" cy="140" r="4" fill="#B8F23E" />
          <Rect x="192" y="138" width="65" height="5" rx="2.5" fill="#1E293B" />

          {/* Verified ATS Seal Badge */}
          <Circle cx="262" cy="148" r="16" fill="#22C55E" stroke="#121212" strokeWidth="1.8" />
          <Path
            d="M256 148 L260 152 L268 144"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Floating ATS Score Card (Top Left) */}
        <G id="AtsScoreCard">
          <Rect
            x="30"
            y="40"
            width="105"
            height="46"
            rx="10"
            fill="#FAFCF8"
            stroke="#121212"
            strokeWidth="1.8"
          />
          <Rect x="42" y="50" width="48" height="12" rx="6" fill="#B8F23E" />
          <Rect x="42" y="68" width="80" height="6" rx="3" fill="#1E293B" />
        </G>

        {/* Floating PDF Export Badge (Mid Left) */}
        <G id="PdfExportBadge">
          <Rect
            x="45"
            y="105"
            width="85"
            height="34"
            rx="8"
            fill="#FFFFFF"
            stroke="#E2E7DB"
            strokeWidth="1.5"
          />
          <Rect x="55" y="115" width="22" height="14" rx="4" fill="#1E293B" />
          <Path d="M90 116 V126 M86 122 L90 126 L94 122" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" />
        </G>

        {/* Developer Character (Standing & Confidently Holding Document) */}
        <G id="Developer">
          {/* Legs & Pants */}
          <Path
            d="M102 142 L98 202 H110 L112 150 L114 150 L116 202 H128 L124 142 Z"
            fill="#1E293B"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Shoes */}
          <Path
            d="M92 198 C92 193 104 191 112 196 L110 204 H92 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="1.8"
          />
          <Path
            d="M116 198 C116 193 128 191 136 196 L134 204 H116 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="1.8"
          />

          {/* Torso & Lime T-shirt */}
          <Path
            d="M98 88 C98 82 106 79 114 79 C122 79 130 82 130 88 L134 144 H94 Z"
            fill="#B8F23E"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Sleeves */}
          <Path
            d="M99 86 L84 104 L93 111 L103 95 Z"
            fill="#B8F23E"
            stroke="#121212"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <Path
            d="M129 86 L144 104 L135 111 L125 95 Z"
            fill="#B8F23E"
            stroke="#121212"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <Path d="M109 79 C109 83 119 83 119 79" stroke="#121212" strokeWidth="2" strokeLinecap="round" />

          {/* Arms holding the document presentation */}
          <Path
            d="M88 106 L94 130 L102 128 L98 108 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <Path
            d="M140 106 L154 118 L158 112 L144 102 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <Circle cx="160" cy="116" r="3.5" fill="#FFFFFF" stroke="#121212" strokeWidth="1.6" />

          {/* Head & Neck */}
          <Path d="M110 70 V81 H118 V70 Z" fill="#FFFFFF" stroke="#121212" strokeWidth="2" />
          <Path
            d="M100 50 C100 34 128 34 128 50 C128 64 123 72 114 72 C105 72 100 64 100 50 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Ears */}
          <Circle cx="99" cy="54" r="3" fill="#FFFFFF" stroke="#121212" strokeWidth="1.8" />
          <Circle cx="129" cy="54" r="3" fill="#FFFFFF" stroke="#121212" strokeWidth="1.8" />
          {/* Eyes & Smile */}
          <Circle cx="109" cy="51" r="1.5" fill="#121212" />
          <Circle cx="119" cy="51" r="1.5" fill="#121212" />
          <Path d="M111 60 Q114 63 117 60" stroke="#121212" strokeWidth="1.6" strokeLinecap="round" />

          {/* Hair */}
          <Path
            d="M97 48 C96 32 105 22 114 22 C125 22 132 32 131 48 C128 48 124 43 120 44 C116 45 114 42 111 43 C106 44 101 48 97 48 Z"
            fill="#1E293B"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </G>

        {/* Sparkle Stars */}
        <Path
          d="M295 125 C295 122 292 119 289 119 C292 119 295 116 295 113 C295 116 298 119 301 119 C298 119 295 122 295 125 Z"
          fill="#B8F23E"
        />
        <Path
          d="M32 170 C32 167 30 165 27 165 C30 165 32 163 32 160 C32 163 34 165 37 165 C34 165 32 167 32 170 Z"
          fill="#1E293B"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
