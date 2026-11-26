import React from 'react';
import { Platform, View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  Inbox,
  Bookmark,
  Send,
  Calendar,
  Award,
  Compass,
  SlidersHorizontal,
} from 'lucide-react-native';
import { PipelineStage } from '../pipeline.types';
import { Heading, Body, Label } from '@/components/atoms/typography';
import { Radius } from '@/constants/theme';

interface PipelineEmptyStateProps {
  selectedStage: PipelineStage | 'all';
  onSwitchStage: (stage: PipelineStage | 'all') => void;
  counts: Record<string, number>;
  hasSecondaryFilter?: boolean;
  onClearSecondaryFilters?: () => void;
}

export function PipelineEmptyState({
  selectedStage,
  onSwitchStage,
  counts,
  hasSecondaryFilter = false,
  onClearSecondaryFilters,
}: PipelineEmptyStateProps) {
  const router = useRouter();

  const handleAction = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    callback();
  };

  const totalCount = counts.all ?? 0;
  const shortlistCount = counts.shortlisted ?? 0;

  const getContent = () => {
    if (hasSecondaryFilter && onClearSecondaryFilters) {
      return {
        icon: <SlidersHorizontal size={20} color="#5A5D54" />,
        title: 'No matching applications',
        subtitle: 'No tracked roles match the active workplace filter in this view.',
        buttonLabel: 'CLEAR FILTERS',
        action: onClearSecondaryFilters,
      };
    }

    switch (selectedStage) {
      case 'shortlisted':
        return {
          icon: <Bookmark size={22} color="#5A5D54" />,
          title: 'Shortlist is empty',
          subtitle: 'Save roles from Explore or Daily Match Deck to prepare your applications.',
          buttonLabel: 'BROWSE VACANCIES',
          action: () => router.push('/'),
        };

      case 'applied':
        return {
          icon: <Send size={20} color="#5A5D54" />,
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
          icon: <Calendar size={20} color="#5A5D54" />,
          title: 'No active interview loops',
          subtitle: 'Applications with scheduled screening or team interviews appear here.',
          buttonLabel: totalCount > 0 ? 'VIEW ALL TRACKED' : 'EXPLORE ROLES',
          action: () => (totalCount > 0 ? onSwitchStage('all') : router.push('/')),
        };

      case 'offered':
        return {
          icon: <Award size={22} color="#5A5D54" />,
          title: 'No formal offers yet',
          subtitle: 'Progress through your interview rounds to record compensation offers.',
          buttonLabel: totalCount > 0 ? 'VIEW ALL TRACKED' : 'EXPLORE ROLES',
          action: () => (totalCount > 0 ? onSwitchStage('all') : router.push('/')),
        };

      case 'scouted':
        return {
          icon: <Compass size={22} color="#5A5D54" />,
          title: 'No scouted roles',
          subtitle: 'Use AI Hunter to discover curated opportunities tailored to your preferences.',
          buttonLabel: 'LAUNCH HUNTER AGENT',
          action: () => router.push('/agent'),
        };

      case 'all':
      default:
        return {
          icon: <Inbox size={22} color="#5A5D54" />,
          title: 'Your tracker is empty',
          subtitle: 'Save roles in Explore or use AI Hunter to start building your pipeline.',
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

      <Pressable
        onPress={() => handleAction(content.action)}
        style={state => [
          styles.actionButton,
          state.pressed && styles.actionButtonPressed,
          Platform.OS === 'web' && (state as { focused?: boolean }).focused
            ? styles.webFocusRing
            : null,
          Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null,
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
    paddingHorizontal: 28,
    paddingVertical: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E6DC',
  },
  textContainer: {
    alignItems: 'center',
    gap: 6,
    maxWidth: 300,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#121212',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: '#5A5D54',
    textAlign: 'center',
  },
  actionButton: {
    minHeight: 44,
    paddingHorizontal: 20,
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
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#FFFFFF',
  },
  webFocusRing: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#121212',
    outlineOffset: 2,
  } as any,
});
