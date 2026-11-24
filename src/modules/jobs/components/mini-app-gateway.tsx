import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Layers, Bot, FileText, Briefcase } from 'lucide-react-native';
import { Radius } from '@/constants/theme';
import { Label } from '@/components/atoms/typography';

interface MiniAppGatewayProps {
  onOpenDailyMatch: () => void;
  unreviewedMatchCount?: number;
}

export function MiniAppGateway({
  onOpenDailyMatch,
  unreviewedMatchCount = 5,
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
          <Text style={styles.headerSub}>Shortcuts</Text>
        </View>

        <View style={styles.stripRow}>
          {/* Action 1: Daily Match Deck */}
          <TouchableOpacity
            onPress={handleOpenDailyMatch}
            activeOpacity={0.75}
            style={styles.actionItem}
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
          </TouchableOpacity>

          {/* Action 2: AI Hunter */}
          <TouchableOpacity
            onPress={() => handleNavigate('/agent')}
            activeOpacity={0.75}
            style={styles.actionItem}
            accessibilityRole="button"
            accessibilityLabel="Open AI Hunter">
            <View style={styles.iconSquircle}>
              <Bot size={20} color="#121212" strokeWidth={2.2} />
              <View style={styles.livePip} />
            </View>
            <Text style={styles.actionLabel}>AI Hunter</Text>
          </TouchableOpacity>

          {/* Action 3: CV Studio */}
          <TouchableOpacity
            onPress={() => handleNavigate('/cv')}
            activeOpacity={0.75}
            style={styles.actionItem}
            accessibilityRole="button"
            accessibilityLabel="Open CV Studio">
            <View style={styles.iconSquircle}>
              <FileText size={20} color="#121212" strokeWidth={2.2} />
            </View>
            <Text style={styles.actionLabel}>CV Studio</Text>
          </TouchableOpacity>

          {/* Action 4: Pipeline Tracker */}
          <TouchableOpacity
            onPress={() => handleNavigate('/jobs')}
            activeOpacity={0.75}
            style={styles.actionItem}
            accessibilityRole="button"
            accessibilityLabel="Open Job Tracker">
            <View style={styles.iconSquircle}>
              <Briefcase size={20} color="#121212" strokeWidth={2.2} />
            </View>
            <Text style={styles.actionLabel}>Tracker</Text>
          </TouchableOpacity>
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
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: '#E2E6DC',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    shadowColor: '#121212',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#121212',
    letterSpacing: -0.2,
  },
  headerSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#73786B',
  },
  stripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionItem: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  iconSquircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F4F6F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8ECDF',
  },
  heroIconSquircle: {
    backgroundColor: '#B8F23E',
    borderColor: '#A3E62B',
  },
  badgePip: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#121212',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgePipText: {
    color: '#B8F23E',
    fontSize: 9,
    fontWeight: '800',
  },
  livePip: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#16A34A',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3A3D36',
  },
});
