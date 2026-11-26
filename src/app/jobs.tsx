import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { AlertCircle, Briefcase, SlidersHorizontal } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Radius } from '@/constants/theme';
import { Body, Display, Heading, Label } from '@/components/atoms/typography';
import { Job, JobDetailModal } from '@/modules/jobs';
import {
  PipelineCard,
  PipelineEmptyState,
  PipelineFilterModal,
  PipelineItem,
  PipelineSortOption,
  PipelineStage,
  PipelineStageModal,
  PipelineStageTabs,
  PipelineWorkplaceFilter,
  usePipeline,
} from '@/modules/pipeline';

const VALID_STAGES: ReadonlySet<string> = new Set([
  'all',
  'scouted',
  'shortlisted',
  'applied',
  'interviewing',
  'offered',
  'rejected',
]);

const STAGE_LABELS: Record<string, string> = {
  all: 'All Applications',
  shortlisted: 'Shortlist',
  applied: 'Applied',
  interviewing: 'Interview',
  offered: 'Offer',
  scouted: 'Scouted',
};

export default function JobsScreen() {
  const {
    items,
    allItems,
    selectedStage,
    setSelectedStage,
    countsByStage,
    isLoading,
    error,
    getAll,
    updateStage,
    addNote,
    remove,
  } = usePipeline();

  const { stage: stageParam } = useLocalSearchParams<{ stage?: string }>();

  useEffect(() => {
    const normalized = Array.isArray(stageParam) ? stageParam[0] : stageParam;
    if (normalized && VALID_STAGES.has(normalized)) {
      setSelectedStage(normalized as PipelineStage | 'all');
    }
  }, [setSelectedStage, stageParam]);

  const [detailJob, setDetailJob] = useState<Job | null>(null);
  const [managingItem, setManagingItem] = useState<PipelineItem | null>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortBy, setSortBy] = useState<PipelineSortOption>('updated');
  const [workplaceFilter, setWorkplaceFilter] =
    useState<PipelineWorkplaceFilter>('all');

  useFocusEffect(
    useCallback(() => {
      getAll(undefined, { silent: allItems.length > 0 }).catch(() => {});
    }, [allItems.length, getAll]),
  );

  const activeFilterCount =
    (sortBy !== 'updated' ? 1 : 0) + (workplaceFilter !== 'all' ? 1 : 0);

  const visibleItems = useMemo(() => {
    const filtered =
      workplaceFilter === 'all'
        ? [...items]
        : items.filter(item => item.job.workplaceType === workplaceFilter);

    filtered.sort((a, b) => {
      if (sortBy === 'score') {
        return (b.atsScore ?? 0) - (a.atsScore ?? 0);
      }
      if (sortBy === 'interview') {
        const aHas = a.nextInterviewDate ? 1 : 0;
        const bHas = b.nextInterviewDate ? 1 : 0;
        if (aHas !== bHas) return bHas - aHas;
      }
      return b.updatedAt - a.updatedAt;
    });

    return filtered;
  }, [items, sortBy, workplaceFilter]);

  const handleOpenFilter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setFilterVisible(true);
  };

  const handleResetFilters = () => {
    setSortBy('updated');
    setWorkplaceFilter('all');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.pageColumn}>
          {/* Header Section */}
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

              <Pressable
                onPress={handleOpenFilter}
                style={state => [
                  styles.filterButton,
                  activeFilterCount > 0 && styles.filterButtonActive,
                  state.pressed && styles.pressedFade,
                  Platform.OS === 'web' && (state as { focused?: boolean }).focused
                    ? styles.webFocusRing
                    : null,
                  Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null,
                ]}
                accessibilityRole="button"
                accessibilityLabel={
                  activeFilterCount > 0
                    ? `Sort and filter applications, ${activeFilterCount} active`
                    : 'Sort and filter applications'
                }>
                <SlidersHorizontal size={16} color="#121212" strokeWidth={2.2} />
                <Text style={styles.filterButtonText}>Filter</Text>
                {activeFilterCount > 0 ? (
                  <View style={styles.filterCountBadge}>
                    <Text style={styles.filterCountText}>{activeFilterCount}</Text>
                  </View>
                ) : null}
              </Pressable>
            </View>
          </View>

          {/* Stage Filter Pills */}
          <PipelineStageTabs
            selectedStage={selectedStage}
            onSelectStage={setSelectedStage}
            counts={countsByStage}
          />

          {/* List Header */}
          <View style={styles.listHeader}>
            <Heading style={styles.listTitle}>
              {selectedStage === 'all'
                ? STAGE_LABELS.all
                : `${STAGE_LABELS[selectedStage]} Stage`}
            </Heading>

            <View style={styles.listMetaRight}>
              {activeFilterCount > 0 ? (
                <Pressable
                  onPress={handleResetFilters}
                  style={state => [
                    styles.resetChip,
                    state.pressed && styles.pressedFade,
                    Platform.OS === 'web' && (state as { focused?: boolean }).focused
                      ? styles.webFocusRing
                      : null,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Reset active sort and workplace filter">
                  <Text style={styles.resetChipText}>Reset filters</Text>
                </Pressable>
              ) : null}
              <Body style={styles.countText}>
                {visibleItems.length} {visibleItems.length === 1 ? 'Role' : 'Roles'}
              </Body>
            </View>
          </View>

          {/* Data View States: Loading, Error, List, Empty */}
          {isLoading && allItems.length === 0 ? (
            <View style={styles.stateBox} accessibilityLiveRegion="polite">
              <ActivityIndicator size="small" color="#121212" />
              <Body style={styles.stateBody}>Loading your tracked pipeline...</Body>
            </View>
          ) : error && allItems.length === 0 ? (
            <View style={styles.stateBox} accessibilityLiveRegion="polite">
              <AlertCircle size={22} color="#991B1B" />
              <Heading style={styles.stateTitle}>Unable to load tracker</Heading>
              <Body style={styles.stateBody}>{error}</Body>
              <Pressable
                onPress={() => getAll()}
                style={state => [
                  styles.retryBtn,
                  state.pressed && styles.pressedFade,
                  Platform.OS === 'web' && (state as { focused?: boolean }).focused
                    ? styles.webFocusRing
                    : null,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Retry loading applications">
                <Label style={styles.retryBtnText}>RETRY</Label>
              </Pressable>
            </View>
          ) : visibleItems.length > 0 ? (
            visibleItems.map(item => (
              <PipelineCard
                key={item.id}
                item={item}
                onViewDetail={j => setDetailJob(j)}
                onManageStage={i => setManagingItem(i)}
              />
            ))
          ) : (
            <PipelineEmptyState
              selectedStage={selectedStage}
              onSwitchStage={setSelectedStage}
              counts={countsByStage}
              hasSecondaryFilter={workplaceFilter !== 'all'}
              onClearSecondaryFilters={handleResetFilters}
            />
          )}
        </View>
      </ScrollView>

      {/* Full Job Spec Detail Modal */}
      <JobDetailModal
        job={detailJob}
        visible={Boolean(detailJob)}
        onClose={() => setDetailJob(null)}
      />

      {/* Sort & Workplace Filter Sheet */}
      <PipelineFilterModal
        visible={filterVisible}
        sortBy={sortBy}
        workplaceFilter={workplaceFilter}
        onApply={(nextSort, nextWorkplace) => {
          setSortBy(nextSort);
          setWorkplaceFilter(nextWorkplace);
        }}
        onReset={handleResetFilters}
        onClose={() => setFilterVisible(false)}
      />

      {/* Stage Progression Update Modal */}
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
    paddingBottom: 110,
  },
  pageColumn: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
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
    gap: 12,
  },
  heroText: {
    fontSize: 28,
    lineHeight: 32,
    color: '#121212',
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  filterButton: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  filterButtonActive: {
    borderColor: '#121212',
    backgroundColor: '#EFFCD3',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#121212',
  },
  filterCountBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCountText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#B8F23E',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    gap: 8,
  },
  listTitle: {
    fontSize: 16,
    color: '#121212',
    fontWeight: '700',
  },
  listMetaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  resetChip: {
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: '#EFF3E8',
    borderWidth: 1,
    borderColor: '#D8DEC9',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  resetChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#121212',
  },
  countText: {
    fontSize: 12,
    color: '#5A5D54',
    fontWeight: '600',
  },
  stateBox: {
    paddingHorizontal: 24,
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#121212',
    textAlign: 'center',
  },
  stateBody: {
    fontSize: 13,
    lineHeight: 19,
    color: '#5A5D54',
    textAlign: 'center',
    maxWidth: 300,
  },
  retryBtn: {
    minHeight: 44,
    paddingHorizontal: 20,
    borderRadius: Radius.full,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  retryBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#FFFFFF',
  },
  pressedFade: {
    opacity: 0.8,
  },
  webFocusRing: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#121212',
    outlineOffset: 2,
  } as any,
});
