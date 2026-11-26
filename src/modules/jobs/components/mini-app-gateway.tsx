import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Bot, Briefcase, FileText, Layers } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { Label } from '@/components/atoms/typography';

interface MiniAppGatewayProps {
  onOpenDailyMatch: () => void;
  unreviewedMatchCount?: number;
  hunterDiscoveredCount?: number;
}

export function MiniAppGateway({
  onOpenDailyMatch,
  unreviewedMatchCount = 0,
  hunterDiscoveredCount = 0,
}: MiniAppGatewayProps) {
  const handleOpenDailyMatch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onOpenDailyMatch();
  };

  const handleNavigate = (route: '/agent' | '/cv' | '/jobs') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Label style={styles.headerLabel}>Quick Access</Label>
          <Text style={styles.headerSub}>Workspace tools</Text>
        </View>

        <View style={styles.stripRow}>
          {/* Action 1: Daily Match Deck */}
          <Pressable
            onPress={handleOpenDailyMatch}
            style={state => [
              styles.actionItem,
              state.pressed && styles.pressedFade,
              Platform.OS === 'web' && (state as { focused?: boolean }).focused
                ? styles.webFocusRing
                : null,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Open Daily Match Deck">
            <View style={[styles.iconSquircle, styles.heroIconSquircle]}>
              <Layers size={20} color="#121212" strokeWidth={2.4} />
              {unreviewedMatchCount > 0 ? (
                <View style={styles.badgePip}>
                  <Text style={styles.badgePipText}>{unreviewedMatchCount}</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.actionLabel}>Match Deck</Text>
          </Pressable>

          {/* Action 2: AI Hunter */}
          <Pressable
            onPress={() => handleNavigate('/agent')}
            style={state => [
              styles.actionItem,
              state.pressed && styles.pressedFade,
              Platform.OS === 'web' && (state as { focused?: boolean }).focused
                ? styles.webFocusRing
                : null,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Open AI Hunter">
            <View style={styles.iconSquircle}>
              <Bot size={20} color="#121212" strokeWidth={2.2} />
              {hunterDiscoveredCount > 0 ? <View style={styles.livePip} /> : null}
            </View>
            <Text style={styles.actionLabel}>AI Hunter</Text>
          </Pressable>

          {/* Action 3: CV Studio */}
          <Pressable
            onPress={() => handleNavigate('/cv')}
            style={state => [
              styles.actionItem,
              state.pressed && styles.pressedFade,
              Platform.OS === 'web' && (state as { focused?: boolean }).focused
                ? styles.webFocusRing
                : null,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Open CV Studio">
            <View style={styles.iconSquircle}>
              <FileText size={20} color="#121212" strokeWidth={2.2} />
            </View>
            <Text style={styles.actionLabel}>CV Studio</Text>
          </Pressable>

          {/* Action 4: Pipeline Tracker */}
          <Pressable
            onPress={() => handleNavigate('/jobs')}
            style={state => [
              styles.actionItem,
              state.pressed && styles.pressedFade,
              Platform.OS === 'web' && (state as { focused?: boolean }).focused
                ? styles.webFocusRing
                : null,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Open Job Tracker">
            <View style={styles.iconSquircle}>
              <Briefcase size={20} color="#121212" strokeWidth={2.2} />
            </View>
            <Text style={styles.actionLabel}>Tracker</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: -0.1,
  },
  headerSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5A5D54',
  },
  stripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  actionItem: {
    minHeight: 70,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flex: 1,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  iconSquircle: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: '#F4F6F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  heroIconSquircle: {
    backgroundColor: '#B8F23E',
    borderColor: '#9ED42B',
  },
  badgePip: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#121212',
    minWidth: 18,
    height: 18,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgePipText: {
    color: '#B8F23E',
    fontSize: 9.5,
    fontWeight: '800',
  },
  livePip: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#15803D',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  actionLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#121212',
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
});
