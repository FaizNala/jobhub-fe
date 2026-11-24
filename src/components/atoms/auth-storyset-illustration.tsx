import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, {
  G,
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

interface Props {
  width?: number | string;
  height?: number | string;
  style?: ViewStyle;
}

export function AuthStorysetIllustration({ width = 420, height = 380, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Svg viewBox="0 0 500 440" width={width} height={height} fill="none">
        {/* ================= BACKGROUND UI WIREFRAME (STORYSET / UNDRAW MOTIF) ================= */}
        {/* Soft floating browser window behind character */}
        <Rect
          x="70"
          y="30"
          width="360"
          height="240"
          rx="12"
          fill="#FAFCF8"
          stroke="#E2E7DB"
          strokeWidth="2"
        />
        {/* Browser Header Bar */}
        <Path d="M70 66 H430" stroke="#E2E7DB" strokeWidth="1.5" />
        <Circle cx="92" cy="48" r="4.5" fill="#E2E7DB" />
        <Circle cx="106" cy="48" r="4.5" fill="#E2E7DB" />
        <Circle cx="120" cy="48" r="4.5" fill="#B8F23E" />

        {/* Code Lines in Browser */}
        <Rect x="94" y="86" width="70" height="7" rx="3.5" fill="#B8F23E" />
        <Rect x="174" y="86" width="120" height="7" rx="3.5" fill="#E5EAE0" />
        <Rect x="94" y="104" width="160" height="7" rx="3.5" fill="#E5EAE0" />
        <Rect x="94" y="122" width="95" height="7" rx="3.5" fill="#E5EAE0" />
        <Rect x="94" y="140" width="130" height="7" rx="3.5" fill="#E5EAE0" />
        <Rect x="94" y="158" width="80" height="7" rx="3.5" fill="#E5EAE0" />

        {/* Code Tag Badge </> */}
        <Rect
          x="330"
          y="84"
          width="74"
          height="32"
          rx="8"
          fill="#1E293B"
        />
        <Path
          d="M346 100 L341 96 L346 92"
          stroke="#B8F23E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M364 92 L359 108"
          stroke="#94A3B8"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Path
          d="M372 92 L377 96 L372 100"
          stroke="#B8F23E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Floating Checklist / Application Card (Right) */}
        <Rect
          x="340"
          y="136"
          width="124"
          height="124"
          rx="12"
          fill="#FFFFFF"
          stroke="#E2E7DB"
          strokeWidth="1.8"
        />
        {/* Item 1 */}
        <Circle cx="360" cy="162" r="8" fill="#B8F23E" />
        <Path
          d="M357 162 L359.5 164.5 L364 159.5"
          stroke="#121212"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Rect x="376" y="158" width="68" height="6" rx="3" fill="#1E293B" />
        {/* Item 2 */}
        <Circle cx="360" cy="192" r="8" fill="#B8F23E" />
        <Path
          d="M357 192 L359.5 194.5 L364 189.5"
          stroke="#121212"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Rect x="376" y="188" width="56" height="6" rx="3" fill="#64748B" />
        {/* Item 3 */}
        <Circle cx="360" cy="222" r="8" fill="#F0F4EC" stroke="#CBD5E1" strokeWidth="1.5" />
        <Rect x="376" y="218" width="72" height="6" rx="3" fill="#CBD5E1" />

        {/* Floating 4-point vector sparkle stars */}
        {/* Sparkle 1 (Top Left) */}
        <Path
          d="M52 140 C52 134 46 128 40 128 C46 128 52 122 52 116 C52 122 58 128 64 128 C58 128 52 134 52 140 Z"
          fill="#B8F23E"
        />
        {/* Sparkle 2 (Top Right) */}
        <Path
          d="M448 80 C448 76 444 72 440 72 C444 72 448 68 448 64 C448 68 452 72 456 72 C452 72 448 76 448 80 Z"
          fill="#1E293B"
        />
        {/* Sparkle 3 (Mid Left) */}
        <Path
          d="M78 240 C78 236 74 232 70 232 C74 232 78 228 78 224 C78 228 82 232 86 232 C82 232 78 236 78 240 Z"
          fill="#B8F23E"
        />

        {/* ================= GROUND SHADOW ELLIPSE ================= */}
        <Path
          d="M100 405 C100 395 380 395 380 405 C380 415 100 415 100 405 Z"
          fill="#EEF3E8"
        />

        {/* ================= CHARACTER (STORYSET / UNDRAW DEV) ================= */}
        <G id="DeveloperCharacter">
          {/* LEGS (Crossed on the floor) */}
          {/* Back leg & pants */}
          <Path
            d="M148 370 C148 340 178 300 220 300 H260 C302 300 332 340 332 370 C332 392 300 405 240 405 C180 405 148 392 148 370 Z"
            fill="#1E293B"
            stroke="#121212"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Left folded leg curve */}
          <Path
            d="M148 365 C135 375 142 398 185 398 C220 398 235 388 235 380"
            fill="#1E293B"
            stroke="#121212"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Right folded leg curve */}
          <Path
            d="M332 365 C345 375 338 398 295 398 C260 398 245 388 245 380"
            fill="#1E293B"
            stroke="#121212"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Shoes (Minimalist white sneakers with lime accent & dark soles) */}
          {/* Left shoe */}
          <Path
            d="M136 385 C136 375 155 372 170 380 L168 396 C152 398 136 395 136 385 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2.2"
          />
          <Path d="M136 392 H168" stroke="#121212" strokeWidth="2.5" />
          <Path d="M148 378 L152 388" stroke="#B8F23E" strokeWidth="2.5" strokeLinecap="round" />

          {/* Right shoe */}
          <Path
            d="M344 385 C344 375 325 372 310 380 L312 396 C328 398 344 395 344 385 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2.2"
          />
          <Path d="M312 392 H344" stroke="#121212" strokeWidth="2.5" />
          <Path d="M332 378 L328 388" stroke="#B8F23E" strokeWidth="2.5" strokeLinecap="round" />

          {/* TORSO & T-SHIRT (Signature vibrant lime green #B8F23E) */}
          <Path
            d="M192 210 C192 200 215 195 240 195 C265 195 288 200 288 210 L296 308 H184 Z"
            fill="#B8F23E"
            stroke="#121212"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* T-Shirt Sleeves */}
          {/* Left Sleeve */}
          <Path
            d="M194 205 L162 245 L182 258 L204 220 Z"
            fill="#B8F23E"
            stroke="#121212"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Right Sleeve */}
          <Path
            d="M286 205 L318 245 L298 258 L276 220 Z"
            fill="#B8F23E"
            stroke="#121212"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Neckline */}
          <Path
            d="M225 195 C225 204 255 204 255 195"
            stroke="#121212"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* ARMS (Pure White Skin #FFFFFF, Bold Outlines #121212) */}
          {/* Left Arm toward laptop keyboard */}
          <Path
            d="M174 252 L198 300 L218 295 L192 245 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Left Hand on keyboard */}
          <Path
            d="M212 292 C212 288 230 288 230 295 L224 302 L208 300 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2.2"
          />

          {/* Right Arm toward laptop keyboard */}
          <Path
            d="M306 252 L282 300 L262 295 L288 245 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Right Hand on keyboard */}
          <Path
            d="M268 292 C268 288 250 288 250 295 L256 302 L272 300 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2.2"
          />

          {/* LAPTOP (Minimalist flat vector modern laptop) */}
          {/* Keyboard base (dark charcoal) */}
          <Path
            d="M198 300 H282 L290 310 H190 Z"
            fill="#1E293B"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Screen lid facing user slightly angled */}
          <Path
            d="M208 244 H272 L282 300 H198 Z"
            fill="#F8FAFC"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Code lines on laptop display */}
          <Rect x="216" y="256" width="30" height="4" rx="2" fill="#B8F23E" />
          <Rect x="250" y="256" width="14" height="4" rx="2" fill="#94A3B8" />
          <Rect x="216" y="266" width="42" height="4" rx="2" fill="#94A3B8" />
          <Rect x="216" y="276" width="24" height="4" rx="2" fill="#94A3B8" />
          <Rect x="244" y="276" width="20" height="4" rx="2" fill="#B8F23E" />

          {/* HEAD & NECK */}
          {/* Neck (White skin) */}
          <Path
            d="M231 176 V198 H249 V176 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Head contour (Pure White Skin #FFFFFF) */}
          <Path
            d="M220 138 C220 114 260 114 260 138 C260 162 254 180 240 180 C226 180 220 162 220 138 Z"
            fill="#FFFFFF"
            stroke="#121212"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Ears */}
          <Circle cx="219" cy="144" r="4.5" fill="#FFFFFF" stroke="#121212" strokeWidth="2.2" />
          <Circle cx="261" cy="144" r="4.5" fill="#FFFFFF" stroke="#121212" strokeWidth="2.2" />

          {/* Minimalist Facial Features (unDraw / Storyset style) */}
          {/* Eyes (Simple clean dots) */}
          <Circle cx="233" cy="142" r="2.2" fill="#121212" />
          <Circle cx="247" cy="142" r="2.2" fill="#121212" />
          {/* Eyebrows (Minimal arcs) */}
          <Path d="M230 136 Q233 134 236 136" stroke="#121212" strokeWidth="1.8" strokeLinecap="round" />
          <Path d="M244 136 Q247 134 250 136" stroke="#121212" strokeWidth="1.8" strokeLinecap="round" />
          {/* Nose (Subtle notch) */}
          <Path d="M240 144 L239 148 H242" stroke="#121212" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          {/* Smile (Cheerful upward arc) */}
          <Path
            d="M235 156 Q240 161 245 156"
            stroke="#121212"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* HAIR (Solid deep dark charcoal silhouette #1E293B) */}
          <Path
            d="M216 134 C214 116 226 100 240 100 C256 100 266 114 264 132 C262 134 256 128 252 128 C248 128 244 132 240 128 C236 124 228 128 224 134 C220 136 218 135 216 134 Z"
            fill="#1E293B"
            stroke="#121212"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Modern front fringe tufts */}
          <Path
            d="M234 102 C236 94 246 96 248 103"
            stroke="#121212"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </G>
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
