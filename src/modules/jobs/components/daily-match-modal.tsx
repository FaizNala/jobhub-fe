import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Radius } from '@/constants/theme';
import { Heading, Label } from '@/components/atoms/typography';
import { Job } from '../jobs.types';
import { pipelineService } from '@/modules/pipeline';
import { MatchDeckCard } from './match-deck-card';
import { MatchDeckControls } from './match-deck-controls';
import { MatchDeckEmpty } from './match-deck-empty';
import { JobDetailModal } from './job-detail-modal';

interface DailyMatchModalProps {
  visible: boolean;
  onClose: () => void;
  jobs: Job[];
  matchScores?: Record<string, number>;
}

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<{ id: string; action: 'pass' | 'track' }[]>([]);
  const [trackedCount, setTrackedCount] = useState(3);
  const [activeJobDetail, setActiveJobDetail] = useState<Job | null>(null);
  const [toastText, setToastText] = useState<string | null>(null);

  const currentJob = jobs[currentIndex];
  const totalCount = jobs.length;

  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => {
      setToastText(null);
    }, 2200);
  };

  const handlePass = () => {
    if (!currentJob) return;
    setHistory(prev => [...prev, { id: currentJob.id, action: 'pass' }]);
    setCurrentIndex(prev => prev + 1);
  };

  const handleTrack = () => {
    if (!currentJob) return;
    pipelineService
      .create({
        job: currentJob,
        stage: 'shortlisted',
        notes: ['Saved from Daily Match Deck'],
      })
      .catch(() => {});

    setHistory(prev => [...prev, { id: currentJob.id, action: 'track' }]);
    setTrackedCount(prev => prev + 1);
    showToast(`Saved ${currentJob.company} to Tracker! 🎉`);
    setCurrentIndex(prev => prev + 1);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    setHistory(prev => prev.slice(0, -1));
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleResetDeck = () => {
    setCurrentIndex(0);
    setHistory([]);
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onClose();
  };

  const currentScore = currentJob ? (matchScores[currentJob.id] || 85) : 85;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar style="dark" />

        {/* Modal Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleCol}>
            <View style={styles.badgeRow}>
              <Label style={styles.badgeText}>DAILY MATCH DECK</Label>
            </View>
            <Heading style={styles.title}>Today's Curated Triage</Heading>
          </View>

          <View style={styles.headerRightRow}>
            {currentJob ? (
              <View style={styles.counterPill}>
                <Text style={styles.counterText}>
                  {currentIndex + 1} OF {totalCount}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeBtn}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Close Match Deck">
              <X size={18} color="#121212" strokeWidth={2.4} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Toast Alert */}
        {toastText ? (
          <View style={styles.toastBanner}>
            <Text style={styles.toastText}>{toastText}</Text>
          </View>
        ) : null}

        {/* Deck Center Card or Finished State */}
        <View style={styles.deckContent}>
          {currentJob ? (
            <MatchDeckCard
              job={currentJob}
              score={currentScore}
              onPressDetails={j => setActiveJobDetail(j)}
            />
          ) : (
            <MatchDeckEmpty
              trackedCount={trackedCount}
              onResetDeck={handleResetDeck}
            />
          )}
        </View>

        {/* Bottom Triage Controls */}
        {currentJob ? (
          <View style={styles.controlsFooter}>
            <MatchDeckControls
              onPass={handlePass}
              onTrack={handleTrack}
              onUndo={handleUndo}
              canUndo={history.length > 0}
            />
          </View>
        ) : null}

        {/* Job Detail Modal inside Triage */}
        <JobDetailModal
          job={activeJobDetail}
          visible={Boolean(activeJobDetail)}
          onClose={() => setActiveJobDetail(null)}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F0',
    zIndex: 99999,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E6DC',
    backgroundColor: '#FFFFFF',
  },
  headerTitleCol: {
    gap: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#38A100',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: -0.3,
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  counterPill: {
    backgroundColor: '#F4F6F0',
    borderWidth: 1,
    borderColor: '#E2E6DC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
  counterText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F4F6F0',
    borderWidth: 1,
    borderColor: '#E2E6DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastBanner: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.pill,
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
    paddingTop: 14,
    paddingBottom: 10,
  },
  controlsFooter: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
  },
});
