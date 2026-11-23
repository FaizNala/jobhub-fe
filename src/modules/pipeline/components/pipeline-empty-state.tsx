import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  Inbox,
  Bookmark,
  Send,
  Calendar,
  Award,
  Compass,
} from 'lucide-react-native';
import { PipelineStage } from '../pipeline.types';
import { Heading, Body, Label } from '@/components/atoms/typography';
import { Radius } from '@/constants/theme';

interface PipelineEmptyStateProps {
  selectedStage: PipelineStage | 'all';
  onSwitchStage: (stage: PipelineStage | 'all') => void;
  counts: Record<string, number>;
}

export function PipelineEmptyState({
  selectedStage,
  onSwitchStage,
  counts,
}: PipelineEmptyStateProps) {
  const router = useRouter();

  const handleAction = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    callback();
  };

  const totalCount = counts.all ?? 0;
  const shortlistCount = counts.shortlisted ?? 0;

  // Single clean, uncluttered empty state per stage
  const getContent = () => {
    switch (selectedStage) {
      case 'shortlisted':
        return {
          icon: <Bookmark size={22} color="#8E9285" />,
          title: 'Shortlist is empty',
          subtitle: 'Save vacancies from Explore to prepare and tailor your applications.',
          buttonLabel: 'BROWSE VACANCIES',
          action: () => router.push('/'),
        };

      case 'applied':
        return {
          icon: <Send size={20} color="#8E9285" />,
          title: 'No applications sent',
          subtitle:
            shortlistCount > 0
              ? `You have ${shortlistCount} shortlisted role${
                  shortlistCount > 1 ? 's' : ''
                } ready to apply.`
              : 'Track submitted applications to monitor response times and interview rounds.',
          buttonLabel: shortlistCount > 0 ? 'REVIEW SHORTLIST' : 'BROWSE OPENINGS',
          action: () =>
            shortlistCount > 0 ? onSwitchStage('shortlisted') : router.push('/'),
        };

      case 'interviewing':
        return {
          icon: <Calendar size={20} color="#8E9285" />,
          title: 'No active interview loops',
          subtitle: 'Applications with scheduled screening or technical loops appear here.',
          buttonLabel: totalCount > 0 ? 'VIEW ALL APPLICATIONS' : 'EXPLORE ROLES',
          action: () => (totalCount > 0 ? onSwitchStage('all') : router.push('/')),
        };

      case 'offered':
        return {
          icon: <Award size={22} color="#8E9285" />,
          title: 'No formal offers yet',
          subtitle: 'Progress through your interview loops to log compensation packages.',
          buttonLabel: totalCount > 0 ? 'VIEW ALL ROLES' : 'EXPLORE ROLES',
          action: () => (totalCount > 0 ? onSwitchStage('all') : router.push('/')),
        };

      case 'scouted':
        return {
          icon: <Compass size={22} color="#8E9285" />,
          title: 'No scouted vacancies',
          subtitle: 'Prompt your Hunter Agent to scout Greenhouse and Lever boards for you.',
          buttonLabel: 'LAUNCH HUNTER AGENT',
          action: () => router.push('/agent'),
        };

      case 'all':
      default:
        return {
          icon: <Inbox size={22} color="#8E9285" />,
          title: 'Your pipeline is empty',
          subtitle: 'Discover vacancies in Explore or let Hunter Agent scout matching roles.',
          buttonLabel: 'EXPLORE VACANCIES',
          action: () => router.push('/'),
        };
    }
  };

  const content = getContent();

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>{content.icon}</View>

      <View style={styles.textContainer}>
        <Heading style={styles.title}>{content.title}</Heading>
        <Body style={styles.subtitle}>{content.subtitle}</Body>
      </View>

      {/* Exactly ONE clean, quiet button */}
      <Pressable
        onPress={() => handleAction(content.action)}
        style={({ pressed }) => [
          styles.actionButton,
          pressed && styles.actionButtonPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={content.buttonLabel}>
        <Label style={styles.actionButtonText}>{content.buttonLabel}</Label>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingVertical: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F4F6F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8ECDF',
  },
  textContainer: {
    alignItems: 'center',
    gap: 4,
    maxWidth: 270,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#121212',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: '#71756B',
    textAlign: 'center',
  },
  actionButton: {
    height: 38,
    paddingHorizontal: 18,
    borderRadius: Radius.pill,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  actionButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#FFFFFF',
  },
});
