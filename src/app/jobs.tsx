import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Briefcase } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Radius } from '@/constants/theme';
import { Display, Heading, Body, Label } from '@/components/atoms/typography';
import { Job, JobDetailModal } from '@/modules/jobs';
import {
  PipelineItem,
  PipelineStage,
  usePipeline,
  PipelineStageTabs,
  PipelineCard,
  PipelineStageModal,
} from '@/modules/pipeline';

const STAGE_LABELS: Record<string, string> = {
  all: 'All Jobs',
  shortlisted: 'Shortlist',
  applied: 'Applied',
  interviewing: 'Interview',
  offered: 'Offer',
  scouted: 'Scouted',
};

export default function JobsScreen() {
  const router = useRouter();
  const {
    items,
    allItems,
    selectedStage,
    setSelectedStage,
    countsByStage,
    updateStage,
    addNote,
    remove,
  } = usePipeline();

  const [detailJob, setDetailJob] = useState<Job | null>(null);
  const [managingItem, setManagingItem] = useState<PipelineItem | null>(null);

  const getEmptyCopy = (stage: PipelineStage | 'all') => {
    const shortlistCount = countsByStage.shortlisted ?? 0;
    const allCount = allItems.length;

    switch (stage) {
      case 'shortlisted':
        return {
          title: 'No Shortlisted Roles',
          subtitle: 'Save vacancies from Explore to prepare and tailor your CV.',
          actionLabel: 'EXPLORE VACANCIES',
          onAction: () => router.push('/'),
        };
      case 'applied':
        return {
          title: 'No Applications Sent',
          subtitle:
            shortlistCount > 0
              ? `You have ${shortlistCount} role${
                  shortlistCount > 1 ? 's' : ''
                } in Shortlist ready to apply.`
              : 'Track submitted applications to monitor response times and loops.',
          actionLabel: shortlistCount > 0 ? 'REVIEW SHORTLIST' : 'EXPLORE ROLES',
          onAction: () => (shortlistCount > 0 ? setSelectedStage('shortlisted') : router.push('/')),
        };
      case 'interviewing':
        return {
          title: 'No Active Interviews',
          subtitle: 'Roles with scheduled technical or behavioral rounds appear here.',
          actionLabel: allCount > 0 ? 'VIEW ALL ROLES' : 'EXPLORE VACANCIES',
          onAction: () => (allCount > 0 ? setSelectedStage('all') : router.push('/')),
        };
      case 'offered':
        return {
          title: 'No Offers Recorded',
          subtitle: 'Progress through your interview loops to log compensation offers.',
          actionLabel: allCount > 0 ? 'VIEW ALL ROLES' : 'EXPLORE VACANCIES',
          onAction: () => (allCount > 0 ? setSelectedStage('all') : router.push('/')),
        };
      case 'scouted':
        return {
          title: 'No Scouted Vacancies',
          subtitle: 'Prompt your Hunter Agent to scout Greenhouse and Lever boards.',
          actionLabel: 'LAUNCH HUNTER AGENT',
          onAction: () => router.push('/agent'),
        };
      case 'all':
      default:
        return {
          title: 'No Tracked Applications',
          subtitle: 'Save vacancies from Explore or have Hunter Agent scout matching roles.',
          actionLabel: 'EXPLORE OPENINGS',
          onAction: () => router.push('/'),
        };
    }
  };

  const emptyCopy = getEmptyCopy(selectedStage);

  const handleEmptyAction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    emptyCopy.onAction();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Header Section (Structured identically to ExploreHeader) */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.iconCircle}>
              <Briefcase size={15} color="#121212" strokeWidth={2.2} />
            </View>
            <Label style={styles.badgeText}>APPLICATION TRACKER</Label>
          </View>

          <View style={styles.titleRow}>
            <Display style={styles.heroText}>
              TRACKED{'\n'}PIPELINE
            </Display>

            <View style={styles.totalBadge}>
              <Label style={styles.totalBadgeText}>{allItems.length} TOTAL</Label>
            </View>
          </View>
        </View>

        {/* Stage Filter Pills (Structured identically to FilterPillBar) */}
        <PipelineStageTabs
          selectedStage={selectedStage}
          onSelectStage={setSelectedStage}
          counts={countsByStage}
        />

        {/* Subtitle Row (Structured identically to Explore's listHeader) */}
        <View style={styles.listHeader}>
          <Heading style={styles.listTitle}>
            {selectedStage === 'all'
              ? 'Featured Openings'
              : `${STAGE_LABELS[selectedStage]} Stage`}
          </Heading>
          <Body style={styles.countText}>{items.length} Positions Available</Body>
        </View>

        {/* Bento/Pipeline Cards List */}
        {items.map(item => (
          <PipelineCard
            key={item.id}
            item={item}
            onViewDetail={j => setDetailJob(j)}
            onManageStage={i => setManagingItem(i)}
          />
        ))}

        {/* Empty State (Structured identically to Explore's emptyContainer) */}
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Heading style={styles.emptyTitle}>{emptyCopy.title}</Heading>
            <Body style={styles.emptySubtitle}>{emptyCopy.subtitle}</Body>

            <Pressable
              onPress={handleEmptyAction}
              style={({ pressed }) => [
                styles.emptyActionButton,
                pressed && styles.emptyActionButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={emptyCopy.actionLabel}>
              <Label style={styles.emptyActionText}>{emptyCopy.actionLabel}</Label>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      {/* Full Job Spec Detail Modal ("Detail Biasa") */}
      <JobDetailModal
        job={detailJob}
        visible={Boolean(detailJob)}
        onClose={() => setDetailJob(null)}
      />

      {/* Dedicated Progress Update Modal */}
      <PipelineStageModal
        item={managingItem}
        visible={Boolean(managingItem)}
        onClose={() => setManagingItem(null)}
        onUpdateStage={updateStage}
        onAddNote={addNote}
        onRemove={remove}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingBottom: 110, // Generous clearance above floating dock
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    letterSpacing: 1,
    color: '#121212',
    fontWeight: '700',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  heroText: {
    fontSize: 28,
    lineHeight: 32,
    color: '#121212',
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  totalBadge: {
    backgroundColor: '#EFF3E8',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#D8DEC9',
  },
  totalBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#2F4F00',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 16,
    color: '#121212',
    fontWeight: '700',
  },
  countText: {
    fontSize: 12,
    color: '#5A5D54',
    fontWeight: '500',
  },
  emptyContainer: {
    paddingHorizontal: 20,
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    color: '#121212',
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: '#5A5D54',
    textAlign: 'center',
    maxWidth: 290,
    marginBottom: 16,
  },
  emptyActionButton: {
    height: 38,
    paddingHorizontal: 18,
    borderRadius: Radius.full,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyActionButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  emptyActionText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#FFFFFF',
  },
});
