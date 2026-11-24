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
 * OnboardingHunterIllustration (Slide 2: Autonomous AI Hunter)
 * 
 * unDraw / Storyset style:
 * - Pure white skin (#FFFFFF) with dark charcoal outline (#121212)
 * - Intelligent scanning radar grid with concentric arcs & blip dots
 * - Floating live status badge: "AI Hunter Active" with green indicator
 * - Developer confidently reviewing live pipeline
 */
export function OnboardingHunterIllustration({
  width = 280,
  height = 200,
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <Svg viewBox="0 0 320 230" width={width} height={height} fill="none">
        {/* Ground Shadow */}
        <Ellipse cx="160" cy="205" rx="110" ry="8" fill="#EEF3E8" />

        {/* ================= RADAR SCANNER GRID IN BACKGROUND ================= */}
        <G id="RadarScanner">
          {/* Concentric Radar Rings */}
          <Circle cx="85" cy="95" r="55" stroke="#E2E7DB" strokeWidth="1.5" strokeDasharray="4 4" />
          <Circle cx="85" cy="95" r="38" stroke="#E2E7DB" strokeWidth="1.5" />
          <Circle cx="85" cy="95" r="20" stroke="#B8F23E" strokeWidth="1.8" />
          {/* Radar Center Pulse */}
          <Circle cx="85" cy="95" r="4" fill="#B8F23E" />
          {/* Radar Sweep Line */}
          <Path d="M85 95 L124 56" stroke="#B8F23E" strokeWidth="2" strokeLinecap="round" />

          {/* Matched Opportunity Blips */}
          <Circle cx="112" cy="74" r="5" fill="#B8F23E" stroke="#121212" strokeWidth="1.5" />
          <Circle cx="62" cy="115" r="4" fill="#B8F23E" stroke="#121212" strokeWidth="1.2" />
          <Circle cx="104" cy="128" r="4.5" fill="#1E293B" />
        </G>

        {/* Floating Active Radar Status Badge (Top Right) */}
        <G id="RadarStatusBadge">
          <Rect
            x="175"
            y="35"
            width="125"
            height="44"
            rx="10"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="1.8"
          />
          {/* Pulsing Green Indicator */}
          <Circle cx="192" cy="57" r="5" fill="#22C55E" />
          <Circle cx="192" cy="57" r="8" stroke="#86EFAC" strokeWidth="1.2" />
          {/* Status Text Lines */}
          <Rect x="206" y="50" width="70" height="6" rx="3" fill="#1E293B" />
          <Rect x="206" y="60" width="45" height="5" rx="2.5" fill="#94A3B8" />
        </G>

        {/* Floating Pipeline Progress Badge (Mid Right) */}
        <G id="PipelineBadge">
          <Rect
            x="195"
            y="95"
            width="105"
            height="50"
            rx="10"
            fill="#FAFCF8"
            stroke="#E2E7DB"
            strokeWidth="1.5"
          />
          {/* 3 Step Pipeline Progress */}
          <Circle cx="215" cy="120" r="7" fill="#B8F23E" />
          <Path d="M213 120 L214.5 121.5 L217.5 118.5" stroke="#121212" strokeWidth="1.4" strokeLinecap="round" />
          <Path d="M222 120 H240" stroke="#B8F23E" strokeWidth="2" />
          <Circle cx="247" cy="120" r="7" fill="#B8F23E" />
          <Path d="M254 120 H272" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="2 2" />
          <Circle cx="279" cy="120" r="7" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.2" />
        </G>

        {/* Developer Character (Standing & Observing Radar) */}
        <G id="Developer">
          {/* Legs & Obsidian Pants */}
          <Path
            d="M136 142 L132 202 H144 L146 150 L148 150 L150 202 H162 L158 142 Z"
            fill="#1E293B"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Shoes */}
          <Path
            d="M126 198 C126 193 138 191 146 196 L144 204 H126 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="1.8"
          />
          <Path
            d="M150 198 C150 193 162 191 170 196 L168 204 H150 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="1.8"
          />

          {/* Torso & Lime T-shirt */}
          <Path
            d="M132 88 C132 82 140 79 148 79 C156 79 164 82 164 88 L168 144 H128 Z"
            fill="#B8F23E"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Sleeves */}
          <Path
            d="M133 86 L118 104 L127 111 L137 95 Z"
            fill="#B8F23E"
            stroke="#121212"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <Path
            d="M163 86 L178 104 L169 111 L159 95 Z"
            fill="#B8F23E"
            stroke="#121212"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <Path d="M143 79 C143 83 153 83 153 79" stroke="#121212" strokeWidth="2" strokeLinecap="round" />

          {/* Left Arm pointing toward radar scanner */}
          <Path
            d="M122 106 L102 108 L104 116 L124 114 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <Circle cx="99" cy="111" r="3.5" fill="#FFFFFF" stroke="#121212" strokeWidth="1.6" />

          {/* Right Arm resting naturally */}
          <Path
            d="M174 106 L178 128 L170 130 L166 112 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <Circle cx="178" cy="132" r="3.5" fill="#FFFFFF" stroke="#121212" strokeWidth="1.6" />

          {/* Head & Neck */}
          <Path d="M144 70 V81 H152 V70 Z" fill="#FFFFFF" stroke="#121212" strokeWidth="2" />
          <Path
            d="M134 50 C134 34 162 34 162 50 C162 64 157 72 148 72 C139 72 134 64 134 50 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Ears */}
          <Circle cx="133" cy="54" r="3" fill="#FFFFFF" stroke="#121212" strokeWidth="1.8" />
          <Circle cx="163" cy="54" r="3" fill="#FFFFFF" stroke="#121212" strokeWidth="1.8" />
          {/* Eyes & Smile */}
          <Circle cx="143" cy="51" r="1.5" fill="#121212" />
          <Circle cx="153" cy="51" r="1.5" fill="#121212" />
          <Path d="M145 60 Q148 63 151 60" stroke="#121212" strokeWidth="1.6" strokeLinecap="round" />

          {/* Hair */}
          <Path
            d="M131 48 C130 32 139 22 148 22 C159 22 166 32 165 48 C162 48 158 43 154 44 C150 45 148 42 145 43 C140 44 135 48 131 48 Z"
            fill="#1E293B"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </G>

        {/* Floating Sparkle Stars */}
        <Path
          d="M25 155 C25 152 22 149 19 149 C22 149 25 146 25 143 C25 146 28 149 31 149 C28 149 25 152 25 155 Z"
          fill="#B8F23E"
        />
        <Path
          d="M295 160 C295 157 293 155 290 155 C293 155 295 153 295 150 C295 153 297 155 300 155 C297 155 295 157 295 160 Z"
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
