import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { X, BookmarkPlus, RotateCcw } from 'lucide-react-native';

interface MatchDeckControlsProps {
  onPass: () => void;
  onTrack: () => void;
  onUndo?: () => void;
  canUndo?: boolean;
  disabled?: boolean;
}

export function MatchDeckControls({
  onPass,
  onTrack,
  onUndo,
  canUndo = false,
  disabled = false,
}: MatchDeckControlsProps) {
  const undoDisabled = disabled || !canUndo || !onUndo;

  const handlePass = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPass();
  };

  const handleTrack = () => {
    if (disabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onTrack();
  };

  const handleUndo = () => {
    if (undoDisabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onUndo();
  };

  return (
    <View style={styles.controlsRow}>
      {/* Compact Undo Icon */}
      <Pressable
        onPress={handleUndo}
        disabled={undoDisabled}
        style={state => [
          styles.undoBtn,
          undoDisabled && styles.undoDisabledBtn,
          state.pressed && !undoDisabled && styles.pressedFade,
          Platform.OS === 'web' && (state as { focused?: boolean }).focused
            ? styles.webFocusRing
            : null,
          Platform.OS === 'web'
            ? ({ cursor: undoDisabled ? 'not-allowed' : 'pointer' } as any)
            : null,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled: undoDisabled }}
        accessibilityLabel="Undo last decision">
        <RotateCcw
          size={17}
          color={undoDisabled ? '#9CA3AF' : '#5A5D54'}
          strokeWidth={2.2}
        />
      </Pressable>

      {/* Quiet Pass Circular Button */}
      <Pressable
        onPress={handlePass}
        disabled={disabled}
        style={state => [
          styles.passBtn,
          disabled && styles.disabledBtn,
          state.pressed && !disabled && styles.passBtnPressed,
          Platform.OS === 'web' && (state as { focused?: boolean }).focused
            ? styles.webFocusRing
            : null,
          Platform.OS === 'web'
            ? ({ cursor: disabled ? 'not-allowed' : 'pointer' } as any)
            : null,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessibilityLabel="Pass this opportunity">
        <X size={20} color="#5A5D54" strokeWidth={2.4} />
      </Pressable>

      {/* Quiet Obsidian Track Circular Button */}
      <Pressable
        onPress={handleTrack}
        disabled={disabled}
        style={state => [
          styles.trackBtn,
          disabled && styles.disabledBtn,
          state.pressed && !disabled && styles.pressedFade,
          Platform.OS === 'web' && (state as { focused?: boolean }).focused
            ? styles.webFocusRing
            : null,
          Platform.OS === 'web'
            ? ({ cursor: disabled ? 'not-allowed' : 'pointer' } as any)
            : null,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessibilityLabel="Save to Tracker pipeline">
        <BookmarkPlus size={20} color="#B8F23E" strokeWidth={2.3} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    paddingTop: 6,
    paddingBottom: 4,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  undoDisabledBtn: {
    opacity: 0.42,
    backgroundColor: '#F8FAF6',
  },
  pressedFade: {
    opacity: 0.78,
  },
  webFocusRing: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#121212',
    outlineOffset: 2,
  } as any,
  undoBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE1D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DCE1D5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#121212',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  passBtnPressed: {
    backgroundColor: '#FEE2E2',
    borderColor: '#B91C1C',
  },
  trackBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#121212',
    borderWidth: 1.5,
    borderColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#121212',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
  },
});
