import React from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Target, ArrowUpRight, MessageSquare, FileCheck2, Compass } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Radius } from '@/constants/theme';
import { Display, Heading, Body, Label } from '@/components/atoms/typography';

const PREP_MODULES = [
  {
    id: 'p1',
    title: 'Analyze Resume for Uber L5 Role',
    desc: 'Match qualifications, extract keywords, and suggest concise ATS improvements.',
    icon: FileCheck2,
    accent: '#635BFF',
  },
  {
    id: 'p2',
    title: 'Practice Amazon Behavioral Principles',
    desc: 'Simulate situational interview questions mapped to Amazon Leadership Principles.',
    icon: Target,
    accent: '#F5C242',
  },
  {
    id: 'p3',
    title: 'Compensation Benchmark Calculator',
    desc: 'Review market compensation data for hybrid roles in the San Francisco Bay Area.',
    icon: MessageSquare,
    accent: '#B8F23E',
  },
];

export default function AgentScreen() {
  const handlePromptPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.iconCircle}>
              <Target size={16} color="#121212" />
            </View>
            <Label style={styles.badgeText}>INTERVIEW PREPARATION</Label>
          </View>

          <Display style={styles.title}>
            INTERVIEW{'\n'}DRILLS
          </Display>
          <Body style={styles.subtitle}>
            Targeted role preparation, resume audits, and mock interview practice.
          </Body>
        </View>

        <View style={styles.promptList}>
          <Heading style={styles.sectionHeading}>Active Modules</Heading>

          {PREP_MODULES.map(item => {
            const Icon = item.icon;
            return (
              <Pressable
                key={item.id}
                onPress={handlePromptPress}
                accessibilityRole="button"
                style={styles.promptCard}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIconBox, { backgroundColor: item.accent }]}>
                    <Icon size={18} color="#121212" />
                  </View>
                  <View style={styles.arrowBox}>
                    <ArrowUpRight size={16} color="#121212" />
                  </View>
                </View>

                <Heading style={styles.promptTitle}>{item.title}</Heading>
                <Body style={styles.promptDesc}>{item.desc}</Body>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    color: '#121212',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
    color: '#121212',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B6D66',
    lineHeight: 20,
  },
  promptList: {
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 12,
  },
  sectionHeading: {
    fontSize: 16,
    color: '#121212',
    marginBottom: 4,
  },
  promptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardIconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowBox: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.backgroundElement,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptTitle: {
    fontSize: 15,
    color: '#121212',
    lineHeight: 20,
  },
  promptDesc: {
    fontSize: 13,
    color: '#6B6D66',
    lineHeight: 18,
  },
});
