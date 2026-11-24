import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, {
  G,
  Path,
  Rect,
  Circle,
  Ellipse,
  Line,
} from 'react-native-svg';

interface Props {
  width?: number | string;
  height?: number | string;
  style?: ViewStyle;
}

/**
 * OnboardingJobsIllustration (Slide 1: Curated Tech Jobs)
 * 
 * unDraw / Storyset style:
 * - Pure white skin (#FFFFFF) with dark charcoal outline (#121212)
 * - JobHub Electric Lime (#B8F23E) t-shirt and match accents
 * - Floating curated job card with 94% match badge and salary
 * - Filter funnel icon showing zero recruiter noise
 */
export function OnboardingJobsIllustration({
  width = 280,
  height = 200,
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <Svg viewBox="0 0 320 230" width={width} height={height} fill="none">
        {/* Ground Shadow */}
        <Ellipse cx="160" cy="205" rx="110" ry="8" fill="#EEF3E8" />

        {/* Floating Curated Job Card (Right) */}
        <G id="FloatingJobCard">
          <Rect
            x="170"
            y="30"
            width="130"
            height="115"
            rx="12"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2"
          />
          {/* Card Header Tag */}
          <Rect x="182" y="44" width="46" height="14" rx="7" fill="#B8F23E" />
          {/* Company & Role Lines */}
          <Rect x="182" y="66" width="90" height="7" rx="3.5" fill="#1E293B" />
          <Rect x="182" y="78" width="60" height="5" rx="2.5" fill="#94A3B8" />
          {/* Match Score Badge */}
          <Circle cx="275" cy="50" r="12" fill="#F0FDF4" stroke="#22C55E" strokeWidth="1.5" />
          <Path
            d="M271 50 L274 53 L279 47"
            stroke="#16A34A"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Salary Pill */}
          <Rect x="182" y="94" width="75" height="18" rx="5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.2" />
          <Rect x="190" y="100" width="45" height="6" rx="3" fill="#1E293B" />
        </G>

        {/* Floating Filter Funnel (Top Left - No noise filter) */}
        <G id="NoiseFilter">
          <Rect
            x="25"
            y="45"
            width="55"
            height="55"
            rx="10"
            fill="#FAFCF8"
            stroke="#E2E7DB"
            strokeWidth="1.8"
          />
          {/* Funnel Icon */}
          <Path
            d="M40 58 H65 L56 70 V78 L49 75 V70 Z"
            fill="#B8F23E"
            stroke="#121212"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </G>

        {/* Developer Character (Sitting Cross-legged with Laptop) */}
        <G id="Developer">
          {/* Legs & Pants */}
          <Path
            d="M92 182 C92 165 110 156 130 156 C150 156 168 165 168 182 C168 200 152 205 130 205 C108 205 92 200 92 182 Z"
            fill="#1E293B"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Folded knees */}
          <Path
            d="M92 180 C84 186 88 200 112 200 C126 200 130 194 130 188"
            fill="#1E293B"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <Path
            d="M168 180 C176 186 172 200 148 200 C134 200 130 194 130 188"
            fill="#1E293B"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* Shoes */}
          <Path
            d="M84 192 C84 186 96 184 104 189 L102 199 C93 200 84 198 84 192 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="1.8"
          />
          <Path d="M84 196 H102" stroke="#121212" strokeWidth="2" />
          <Path
            d="M176 192 C176 186 164 184 156 189 L158 199 C167 200 176 198 176 192 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="1.8"
          />
          <Path d="M158 196 H176" stroke="#121212" strokeWidth="2" />

          {/* Torso & Lime T-Shirt */}
          <Path
            d="M112 122 C112 116 120 113 130 113 C140 113 148 116 148 122 L152 168 H108 Z"
            fill="#B8F23E"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Sleeves */}
          <Path
            d="M113 120 L98 138 L107 145 L117 129 Z"
            fill="#B8F23E"
            stroke="#121212"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <Path
            d="M147 120 L162 138 L153 145 L143 129 Z"
            fill="#B8F23E"
            stroke="#121212"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Neckline */}
          <Path d="M125 113 C125 117 135 117 135 113" stroke="#121212" strokeWidth="2" strokeLinecap="round" />

          {/* Arms & Hands (White skin #FFFFFF) */}
          <Path
            d="M102 140 L108 164 H122 L112 137 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <Path
            d="M158 140 L152 164 H138 L148 137 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Laptop on lap */}
          <Path
            d="M108 164 H152 L156 170 H104 Z"
            fill="#1E293B"
            stroke="#121212"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <Path
            d="M113 140 H147 L151 164 H109 Z"
            fill="#F8FAFC"
            stroke="#121212"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Code lines on screen */}
          <Rect x="117" y="146" width="18" height="3" rx="1.5" fill="#B8F23E" />
          <Rect x="137" y="146" width="8" height="3" rx="1.5" fill="#94A3B8" />
          <Rect x="117" y="152" width="24" height="3" rx="1.5" fill="#94A3B8" />

          {/* Head & Neck */}
          <Path d="M126 104 V115 H134 V104 Z" fill="#FFFFFF" stroke="#121212" strokeWidth="2" />
          <Path
            d="M116 84 C116 68 144 68 144 84 C144 98 139 106 130 106 C121 106 116 98 116 84 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Ears */}
          <Circle cx="115" cy="88" r="3" fill="#FFFFFF" stroke="#121212" strokeWidth="1.8" />
          <Circle cx="145" cy="88" r="3" fill="#FFFFFF" stroke="#121212" strokeWidth="1.8" />
          {/* Eyes & Smile */}
          <Circle cx="125" cy="85" r="1.5" fill="#121212" />
          <Circle cx="135" cy="85" r="1.5" fill="#121212" />
          <Path d="M127 94 Q130 97 133 94" stroke="#121212" strokeWidth="1.6" strokeLinecap="round" />

          {/* Hair */}
          <Path
            d="M113 82 C112 66 121 56 130 56 C141 56 148 66 147 82 C144 82 140 77 136 78 C132 79 130 76 127 77 C122 78 117 82 113 82 Z"
            fill="#1E293B"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </G>

        {/* Sparkle Stars */}
        <Path
          d="M275 165 C275 162 272 159 269 159 C272 159 275 156 275 153 C275 156 278 159 281 159 C278 159 275 162 275 165 Z"
          fill="#B8F23E"
        />
        <Path
          d="M48 135 C48 132 46 130 43 130 C46 130 48 128 48 125 C48 128 50 130 53 130 C50 130 48 132 48 135 Z"
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
