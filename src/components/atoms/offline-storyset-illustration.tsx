import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, {
  G,
  Path,
  Rect,
  Circle,
  Line,
  Ellipse,
} from 'react-native-svg';

interface Props {
  width?: number | string;
  height?: number | string;
  style?: ViewStyle;
}

/**
 * OfflineStorysetIllustration
 * 
 * 100% pure flat 2D vector spot illustration in unDraw / Storyset art style:
 * - Pure white skin (#FFFFFF) defined only by clean vector outlines (#121212)
 * - Brand JobHub vibrant lime green accent (#B8F23E) on crewneck t-shirt
 * - Obsidian slate pants & hair (#1E293B)
 * - Contextual tech motifs: mini router, offline laptop screen, floating slashed Wi-Fi badge
 * - Balanced head proportions & expressive questioning developer pose
 */
export function OfflineStorysetIllustration({
  width = 220,
  height = 155,
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <Svg viewBox="0 0 280 190" width={width} height={height} fill="none">
        {/* ================= GROUND SHADOW ================= */}
        <Ellipse cx="140" cy="172" rx="95" ry="7" fill="#EEF3E8" />

        {/* ================= FLOATING BACKGROUND TECH MOTIF (STORYSET) ================= */}
        {/* Soft floating browser / cloud frame */}
        <G id="FloatingNetworkCard">
          <Rect
            x="96"
            y="32"
            width="108"
            height="58"
            rx="12"
            fill="#FAFCF8"
            stroke="#E2E7DB"
            strokeWidth="1.8"
          />
          {/* Card header / lines */}
          <Path d="M96 46 H204" stroke="#E2E7DB" strokeWidth="1.2" />
          <Circle cx="106" cy="39" r="2.5" fill="#E2E7DB" />
          <Circle cx="113" cy="39" r="2.5" fill="#E2E7DB" />
          <Circle cx="120" cy="39" r="2.5" fill="#B8F23E" />
          {/* Subtle placeholder code lines */}
          <Rect x="106" y="54" width="45" height="4" rx="2" fill="#E2E7DB" />
          <Rect x="106" y="62" width="60" height="4" rx="2" fill="#E2E7DB" />
          <Rect x="106" y="70" width="30" height="4" rx="2" fill="#B8F23E" />
        </G>

        {/* Floating Disconnected Wi-Fi Alert Badge */}
        <G id="DisconnectedWifiBadge">
          <Circle cx="198" cy="44" r="16" fill="#FEE2E2" stroke="#FECACA" strokeWidth="1.5" />
          {/* Slashed Wifi Icon inside Badge */}
          {/* Outer Broken Arc */}
          <Path
            d="M190 40 C194 36 202 36 206 40"
            stroke="#DC2626"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Inner Arc */}
          <Path
            d="M193 44 C195 42 201 42 203 44"
            stroke="#DC2626"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Wifi Base Dot */}
          <Circle cx="198" cy="49" r="1.5" fill="#DC2626" />
          {/* Disconnect Diagonal Slash */}
          <Line
            x1="189"
            y1="53"
            x2="207"
            y2="35"
            stroke="#DC2626"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </G>

        {/* ================= FLOATING TECH WIREFRAME (MINI ROUTER) ================= */}
        <G id="MiniRouter">
          {/* Router box on the floor to the left */}
          <Rect
            x="48"
            y="144"
            width="42"
            height="20"
            rx="4"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2"
          />
          {/* Router Antenna */}
          <Path d="M56 144 V122" stroke="#121212" strokeWidth="2.2" strokeLinecap="round" />
          <Circle cx="56" cy="120" r="2.5" fill="#DC2626" />
          {/* Router Status LEDs */}
          <Circle cx="72" cy="154" r="2" fill="#B8F23E" />
          <Circle cx="78" cy="154" r="2" fill="#DC2626" />
          {/* Disconnected Pulse Waves */}
          <Path
            d="M48 114 C52 110 60 110 64 114"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="2 2"
          />
        </G>

        {/* ================= CHARACTER (STORYSET / UNDRAW DEV) ================= */}
        <G id="PerplexedDeveloper">
          {/* LEGS (Cross-legged sitting posture on floor) */}
          {/* Main pants base */}
          <Path
            d="M102 150 C102 134 120 126 140 126 C160 126 178 134 178 150 C178 168 162 173 140 173 C118 173 102 168 102 150 Z"
            fill="#1E293B"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Left folded leg */}
          <Path
            d="M102 148 C94 154 98 168 122 168 C136 168 140 162 140 156"
            fill="#1E293B"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Right folded leg */}
          <Path
            d="M178 148 C186 154 182 168 158 168 C144 168 140 162 140 156"
            fill="#1E293B"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* Minimalist Sneakers (White with black soles) */}
          {/* Left Shoe */}
          <Path
            d="M94 160 C94 154 106 152 114 157 L112 167 C103 168 94 166 94 160 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="1.8"
          />
          <Path d="M94 164 H112" stroke="#121212" strokeWidth="2" />
          <Path d="M102 155 L104 162" stroke="#B8F23E" strokeWidth="2" strokeLinecap="round" />

          {/* Right Shoe */}
          <Path
            d="M186 160 C186 154 174 152 166 157 L168 167 C177 168 186 166 186 160 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="1.8"
          />
          <Path d="M168 164 H186" stroke="#121212" strokeWidth="2" />
          <Path d="M178 155 L176 162" stroke="#B8F23E" strokeWidth="2" strokeLinecap="round" />

          {/* TORSO & T-SHIRT (Signature vibrant lime green #B8F23E) */}
          <Path
            d="M122 92 C122 86 130 83 140 83 C150 83 158 86 158 92 L162 136 H118 Z"
            fill="#B8F23E"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* T-Shirt Sleeves */}
          {/* Left Sleeve */}
          <Path
            d="M123 90 L108 107 L117 114 L127 98 Z"
            fill="#B8F23E"
            stroke="#121212"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Right Sleeve */}
          <Path
            d="M157 90 L172 107 L163 114 L153 98 Z"
            fill="#B8F23E"
            stroke="#121212"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Neckline */}
          <Path
            d="M135 83 C135 87 145 87 145 83"
            stroke="#121212"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* ARMS & GESTURE (Pure White Skin #FFFFFF, Bold outlines #121212) */}
          {/* Left Arm holding laptop */}
          <Path
            d="M112 110 L118 132 H132 L122 107 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Left Hand fingers on laptop */}
          <Circle cx="120" cy="132" r="3" fill="#FFFFFF" stroke="#121212" strokeWidth="1.6" />

          {/* Right Arm raised to chin / cheek in wondering contemplation */}
          <Path
            d="M168 110 L164 98 L154 94 L151 100 L159 104 L158 114 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Hand at chin / thinking */}
          <Circle cx="152" cy="94" r="3.8" fill="#FFFFFF" stroke="#121212" strokeWidth="1.8" />

          {/* LAPTOP (Showing offline screen) */}
          {/* Keyboard base (charcoal) */}
          <Path
            d="M119 132 H161 L165 138 H115 Z"
            fill="#1E293B"
            stroke="#121212"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Laptop Screen facing character */}
          <Path
            d="M123 108 H157 L161 132 H119 Z"
            fill="#F8FAFC"
            stroke="#121212"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Offline warning badge on laptop screen */}
          <Circle cx="140" cy="120" r="5" fill="#FEE2E2" stroke="#DC2626" strokeWidth="1.2" />
          <Path d="M140 117.5 V120" stroke="#DC2626" strokeWidth="1.4" strokeLinecap="round" />
          <Circle cx="140" cy="122.5" r="0.7" fill="#DC2626" />

          {/* NECK & HEAD (White skin #FFFFFF, Friendly balanced proportions) */}
          {/* Neck */}
          <Path
            d="M136 75 V85 H144 V75 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Head Contour (Friendly, perfectly proportioned oval & jaw) */}
          <Path
            d="M126 54 C126 38 154 38 154 54 C154 68 149 76 140 76 C131 76 126 68 126 54 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* Ears */}
          <Circle cx="125" cy="58" r="3" fill="#FFFFFF" stroke="#121212" strokeWidth="1.8" />
          <Circle cx="155" cy="58" r="3" fill="#FFFFFF" stroke="#121212" strokeWidth="1.8" />

          {/* Minimalist Facial Features (unDraw / Storyset style) */}
          {/* Left Eyebrow (Questioning / Raised slightly) */}
          <Path d="M132 50 Q135 48 138 50" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" />
          {/* Right Eyebrow */}
          <Path d="M142 50 Q145 51 148 49" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" />
          {/* Eyes (Simple clean dots) */}
          <Circle cx="135" cy="55" r="1.5" fill="#121212" />
          <Circle cx="145" cy="55" r="1.5" fill="#121212" />
          {/* Nose (Subtle notch) */}
          <Path d="M140 57 L139 60 H141" stroke="#121212" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          {/* Mouth (Calm pensive smile) */}
          <Path
            d="M137 66 Q140 65 143 66"
            stroke="#121212"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* HAIR (Solid dark charcoal silhouette #1E293B, stylish modern volume) */}
          <Path
            d="M123 52 C122 36 131 26 140 26 C151 26 158 36 157 52 C154 52 150 47 146 48 C142 49 140 46 137 47 C132 48 127 52 123 52 Z"
            fill="#1E293B"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Hair Front Tufts */}
          <Path
            d="M136 28 C138 23 143 24 145 29"
            stroke="#121212"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </G>

        {/* Floating Sparkle Stars */}
        <Path
          d="M225 96 C225 93 222 90 219 90 C222 90 225 87 225 84 C225 87 228 90 231 90 C228 90 225 93 225 96 Z"
          fill="#B8F23E"
        />
        <Path
          d="M68 84 C68 81 66 79 63 79 C66 79 68 77 68 74 C68 77 70 79 73 79 C70 79 68 81 68 84 Z"
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
