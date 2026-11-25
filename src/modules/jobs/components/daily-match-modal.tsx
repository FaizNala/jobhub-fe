import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { CheckCircle2, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Radius } from '@/constants/theme';
import { Job } from '../jobs.types';
import { pipelineService } from '@/modules/pipeline';
import { MatchDeckCard } from './match-deck-card';
import { MatchDeckControls } from './match-deck-controls';
import { MatchDeckEmpty } from './match-deck-empty';
import { JobDetailModal } from './job-detail-modal';
import {
  SwipeableDeckCard,
  type SwipeDirection,
  type SwipeableDeckCardHandle,
} from './swipeable-deck-card';

interface DailyMatchModalProps {
  visible: boolean;
  onClose: () => void;
  jobs: Job[];
  matchScores?: Record<string, number>;
}

const SWIPE_THRESHOLD = 96;

export function DailyMatchModal({
  visible,
  onClose,
  jobs,
  matchScores = {
    'job-1': 94,
    'job-2': 88,
    'job-3': 81,
    'job-4': 92,
    'job-5': 86,
  },
}: DailyMatchModalProps) {
  const reducedMotion = useReducedMotion();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<{ id: string; action: 'pass' | 'track' }[]>([]);
  const [trackedCount, setTrackedCount] = useState(0);
  const [activeJobDetail, setActiveJobDetail] = useState<Job | null>(null);
  const [toastText, setToastText] = useState<string | null>(null);
  const [isAnimatingExit, setIsAnimatingExit] = useState(false);

  const frontCardRef = useRef<SwipeableDeckCardHandle>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frontDragX = useSharedValue(0);

  const currentJob = jobs[currentIndex];
  const nextJob = jobs[currentIndex + 1];
  const totalCount = jobs.length;

  const savedJobsInSession = useMemo(() => {
    const savedIds = new Set(
      history.filter(entry => entry.action === 'track').map(entry => entry.id),
    );
    return jobs.filter(job => savedIds.has(job.id));
  }, [history, jobs]);

  const passedSessionCount = useMemo(
    () => history.filter(entry => entry.action === 'pass').length,
    [history],
  );

  useEffect(() => {
    frontDragX.set(0);
    setIsAnimatingExit(false);
  }, [currentIndex, frontDragX]);

  useEffect(() => {
    if (!visible) return;
    let active = true;
    pipelineService
      .getAll()
      .then(res => {
        if (active && Array.isArray(res.data)) {
          setTrackedCount(res.data.length);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [visible]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastText(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastText(null);
    }, 2200);
  }, []);

  const commitSwipeAction = useCallback(
    (direction: SwipeDirection) => {
      if (!currentJob) {
        setIsAnimatingExit(false);
        return;
      }

      if (direction === 'right') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        pipelineService
          .create({
            job: currentJob,
            stage: 'shortlisted',
            notes: ['Saved from Daily Match Deck'],
          })
          .catch(() => {});

        setHistory(prev => [...prev, { id: currentJob.id, action: 'track' }]);
        setTrackedCount(prev => prev + 1);
        showToast(`Saved ${currentJob.company} to Tracker`);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        setHistory(prev => [...prev, { id: currentJob.id, action: 'pass' }]);
      }

      setCurrentIndex(prev => prev + 1);
      setIsAnimatingExit(false);
    },
    [currentJob, showToast],
  );

  const handlePass = useCallback(() => {
    if (!currentJob || isAnimatingExit) return;
    frontCardRef.current?.triggerSwipe('left');
  }, [currentJob, isAnimatingExit]);

  const handleTrack = useCallback(() => {
    if (!currentJob || isAnimatingExit) return;
    frontCardRef.current?.triggerSwipe('right');
  }, [currentJob, isAnimatingExit]);

  const handleUndo = useCallback(() => {
    if (history.length === 0 || isAnimatingExit) return;
    const lastEntry = history[history.length - 1];
    if (lastEntry?.action === 'track') {
      setTrackedCount(prev => Math.max(0, prev - 1));
    }
    setHistory(prev => prev.slice(0, -1));
    setCurrentIndex(prev => Math.max(0, prev - 1));
  }, [history, isAnimatingExit]);

  const handleResetDeck = useCallback(() => {
    setCurrentIndex(0);
    setHistory([]);
    setIsAnimatingExit(false);
  }, []);

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !visible || activeJobDetail) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
        return;
      }
      if ((event.key === 'z' || event.key === 'Backspace') && history.length > 0 && !isAnimatingExit) {
        event.preventDefault();
        handleUndo();
        return;
      }
      if (!currentJob || isAnimatingExit) return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePass();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleTrack();
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [
    activeJobDetail,
    currentJob,
    handleClose,
    handlePass,
    handleTrack,
    handleUndo,
    history.length,
    isAnimatingExit,
    visible,
  ]);

  const nextCardAnimatedStyle = useAnimatedStyle(() => {
    if (reducedMotion) {
      return {
        opacity: 0.94,
        transform: [{ scale: 0.96 }, { translateY: 10 }],
      };
    }

    const dragAbs = Math.min(Math.abs(frontDragX.get()), SWIPE_THRESHOLD);
    const scale = interpolate(dragAbs, [0, SWIPE_THRESHOLD], [0.95, 1], Extrapolation.CLAMP);
    const translateY = interpolate(dragAbs, [0, SWIPE_THRESHOLD], [12, 0], Extrapolation.CLAMP);
    const opacity = interpolate(dragAbs, [0, SWIPE_THRESHOLD], [0.92, 1], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ scale }, { translateY }],
    };
  });

  const currentScore = currentJob ? (matchScores[currentJob.id] || 85) : 85;
  const nextScore = nextJob ? (matchScores[nextJob.id] || 85) : 85;

  return (
    <Modal
      visible={visible}
      animationType={reducedMotion ? 'fade' : 'slide'}
      presentationStyle="fullScreen"
      onRequestClose={handleClose}>
      <GestureHandlerRootView style={styles.gestureRoot}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
          <StatusBar style="dark" />

          {/* Floating Minimal Top Bar */}
          <View style={styles.topBarWrapper}>
            <View style={styles.topBar}>
              <View style={styles.progressTrackWrap}>
                <View style={styles.segmentsRow} accessibilityElementsHidden>
                  {jobs.map((job, idx) => {
                    const isReviewed = idx < currentIndex;
                    const isCurrent = idx === currentIndex;
                    return (
                      <View
                        key={job.id}
                        style={[
                          styles.progressSegment,
                          isReviewed && styles.progressSegmentDone,
                          isCurrent && styles.progressSegmentActive,
                        ]}
                      />
                    );
                  })}
                </View>
                <Text style={styles.progressLabel}>
                  {currentJob ? `${currentIndex + 1} / ${totalCount}` : `${totalCount} / ${totalCount} reviewed`}
                </Text>
              </View>

              <Pressable
                onPress={handleClose}
                style={state => [
                  styles.closeBtn,
                  state.pressed && styles.pressedFade,
                  Platform.OS === 'web' && (state as { focused?: boolean }).focused
                    ? styles.webFocusRing
                    : null,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Close Match Deck">
                <X size={18} color="#121212" strokeWidth={2.4} />
              </Pressable>
            </View>
          </View>

          {/* Toast Alert */}
          {toastText ? (
            <View style={styles.toastBanner} accessibilityLiveRegion="polite">
              <CheckCircle2 size={15} color="#B8F23E" strokeWidth={2.4} />
              <Text style={styles.toastText}>{toastText}</Text>
            </View>
          ) : null}

          {/* Stacked Deck Stage or Session Recap Card */}
          <View style={styles.deckContent}>
            <View style={styles.deckStage}>
              {currentJob ? (
                <>
                  {nextJob ? (
                    <Animated.View
                      key={nextJob.id}
                      style={[styles.cardLayer, nextCardAnimatedStyle]}
                      pointerEvents="none"
                      accessibilityElementsHidden
                      importantForAccessibility="no-hide-descendants">
                      <MatchDeckCard
                        job={nextJob}
                        score={nextScore}
                        onPressDetails={() => {}}
                      />
                    </Animated.View>
                  ) : null}

                  <SwipeableDeckCard
                    key={currentJob.id}
                    ref={frontCardRef}
                    dragProgressX={frontDragX}
                    swipeThreshold={SWIPE_THRESHOLD}
                    enabled={!isAnimatingExit}
                    onSwipeStart={() => setIsAnimatingExit(true)}
                    onSwipeComplete={commitSwipeAction}>
                    <MatchDeckCard
                      job={currentJob}
                      score={currentScore}
                      onPressDetails={j => setActiveJobDetail(j)}
                    />
                  </SwipeableDeckCard>
                </>
              ) : (
                <MatchDeckEmpty
                  trackedCount={trackedCount}
                  savedJobs={savedJobsInSession}
                  passedCount={passedSessionCount}
                  onSelectJob={j => setActiveJobDetail(j)}
                  onUndoLast={history.length > 0 ? handleUndo : undefined}
                  onResetDeck={handleResetDeck}
                />
              )}
            </View>
          </View>

          {/* Compact Monochrome Circular Dock */}
          {currentJob ? (
            <View style={styles.controlsFooter}>
              <View style={styles.controlsInner}>
                <MatchDeckControls
                  onPass={handlePass}
                  onTrack={handleTrack}
                  onUndo={handleUndo}
                  canUndo={history.length > 0}
                  disabled={isAnimatingExit}
                />
              </View>
            </View>
          ) : null}

          {/* Job Detail Modal inside Triage */}
          <JobDetailModal
            job={activeJobDetail}
            visible={Boolean(activeJobDetail)}
            onClose={() => setActiveJobDetail(null)}
          />
        </SafeAreaView>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F0',
    zIndex: 99999,
  },
  topBarWrapper: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    alignItems: 'center',
  },
  topBar: {
    width: '100%',
    maxWidth: 440,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  progressTrackWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  segmentsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D6DCD0',
  },
  progressSegmentDone: {
    backgroundColor: '#121212',
  },
  progressSegmentActive: {
    backgroundColor: '#2E6F00',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5A5D54',
    letterSpacing: 0.2,
    fontVariant: ['tabular-nums'],
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E6DC',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  toastBanner: {
    position: 'absolute',
    top: 66,
    alignSelf: 'center',
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: Radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    zIndex: 99,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  toastText: {
    color: '#B8F23E',
    fontSize: 12,
    fontWeight: '700',
  },
  deckContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deckStage: {
    flex: 1,
    width: '100%',
    maxWidth: 440,
    maxHeight: 620,
    position: 'relative',
  },
  cardLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  controlsFooter: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    paddingTop: 4,
    alignItems: 'center',
  },
  controlsInner: {
    width: '100%',
    maxWidth: 440,
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
