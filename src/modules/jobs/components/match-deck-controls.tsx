import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { X, BookmarkPlus, RotateCcw } from 'lucide-react-native';

interface MatchDeckControlsProps {
  onPass: () => void;
  onTrack: () => void;
  onUndo?: () => void;
  canUndo?: boolean;
}

export function MatchDeckControls({
  onPass,
  onTrack,
  onUndo,
  canUndo = false,
}: MatchDeckControlsProps) {
  const handlePass = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPass();
  };

  const handleTrack = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onTrack();
  };

  const handleUndo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (onUndo) onUndo();
  };

  return (
    <View style={styles.controlsRow}>
      {/* Undo Button (Only if previous card exists) */}
      {canUndo && onUndo ? (
        <TouchableOpacity
          onPress={handleUndo}
          style={styles.undoBtn}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Undo last pass">
          <RotateCcw size={16} color="#73786B" strokeWidth={2.2} />
        </TouchableOpacity>
      ) : null}

      {/* Pass / Skip Button */}
      <TouchableOpacity
        onPress={handlePass}
        style={styles.passBtn}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Pass this opportunity">
        <X size={16} color="#5A5D54" strokeWidth={2.4} />
        <Text style={styles.passText}>PASS</Text>
      </TouchableOpacity>

      {/* Save to Tracker Button */}
      <TouchableOpacity
        onPress={handleTrack}
        style={styles.trackBtn}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Save to Tracker pipeline">
        <BookmarkPlus size={16} color="#121212" strokeWidth={2.4} />
        <Text style={styles.trackText}>TRACK JOB</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  undoBtn: {
    width: 46,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E6DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E6DC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  passText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5A5D54',
    letterSpacing: 0.6,
  },
  trackBtn: {
    flex: 1.4,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#B8F23E',
    borderWidth: 1.5,
    borderColor: '#98DA18',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  trackText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#121212',
    letterSpacing: 0.6,
  },
});
