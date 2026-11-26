import React, { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Check, RotateCcw, X } from 'lucide-react-native';
import { Body, Heading, Label } from '@/components/atoms/typography';
import { Radius } from '@/constants/theme';
import {
  PipelineSortOption,
  PipelineWorkplaceFilter,
} from '../pipeline.types';

interface PipelineFilterModalProps {
  visible: boolean;
  sortBy: PipelineSortOption;
  workplaceFilter: PipelineWorkplaceFilter;
  onApply: (sort: PipelineSortOption, workplace: PipelineWorkplaceFilter) => void;
  onReset: () => void;
  onClose: () => void;
}

const SORT_OPTIONS: { id: PipelineSortOption; label: string }[] = [
  { id: 'updated', label: 'Recently Updated' },
  { id: 'score', label: 'Highest CV Match' },
  { id: 'interview', label: 'Upcoming Interview' },
];

const WORKPLACE_OPTIONS: { id: PipelineWorkplaceFilter; label: string }[] = [
  { id: 'all', label: 'All Setups' },
  { id: 'Remote', label: 'Remote' },
  { id: 'Hybrid', label: 'Hybrid' },
  { id: 'On-Site', label: 'On-Site' },
];

export function PipelineFilterModal({
  visible,
  sortBy,
  workplaceFilter,
  onApply,
  onReset,
  onClose,
}: PipelineFilterModalProps) {
  const [draftSort, setDraftSort] = useState<PipelineSortOption>(sortBy);
  const [draftWorkplace, setDraftWorkplace] =
    useState<PipelineWorkplaceFilter>(workplaceFilter);

  useEffect(() => {
    if (visible) {
      setDraftSort(sortBy);
      setDraftWorkplace(workplaceFilter);
    }
  }, [sortBy, visible, workplaceFilter]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !visible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [onClose, visible]);

  const handleApply = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onApply(draftSort, draftWorkplace);
    onClose();
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onReset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.sheetContainer}>
          <View style={styles.sheetContent}>
            <View style={styles.headerRow}>
              <View style={styles.headerTitleCol}>
                <Heading style={styles.sheetTitle}>Sort & Filter</Heading>
                <Body style={styles.sheetSubtitle}>
                  Organize your tracked applications by priority or setup
                </Body>
              </View>

              <Pressable
                onPress={onClose}
                style={state => [
                  styles.closeButton,
                  state.pressed && styles.pressedFade,
                  Platform.OS === 'web' && (state as { focused?: boolean }).focused
                    ? styles.webFocusRing
                    : null,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Close filter options">
                <X size={18} color="#121212" strokeWidth={2.2} />
              </Pressable>
            </View>

            <View style={styles.sectionBlock}>
              <Label style={styles.sectionLabel}>SORT BY</Label>
              <View style={styles.optionsWrap}>
                {SORT_OPTIONS.map(option => {
                  const selected = draftSort === option.id;
                  return (
                    <Pressable
                      key={option.id}
                      onPress={() => {
                        Haptics.selectionAsync().catch(() => {});
                        setDraftSort(option.id);
                      }}
                      style={state => [
                        styles.optionPill,
                        selected ? styles.optionPillActive : styles.optionPillDefault,
                        state.pressed && styles.pressedFade,
                        Platform.OS === 'web' && (state as { focused?: boolean }).focused
                          ? styles.webFocusRing
                          : null,
                      ]}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      accessibilityLabel={`Sort by ${option.label}`}>
                      {selected ? (
                        <Check size={14} color="#121212" strokeWidth={2.6} />
                      ) : null}
                      <Text
                        style={[
                          styles.optionText,
                          selected && styles.optionTextActive,
                        ]}>
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.sectionBlock}>
              <Label style={styles.sectionLabel}>WORKPLACE SETUP</Label>
              <View style={styles.optionsWrap}>
                {WORKPLACE_OPTIONS.map(option => {
                  const selected = draftWorkplace === option.id;
                  return (
                    <Pressable
                      key={option.id}
                      onPress={() => {
                        Haptics.selectionAsync().catch(() => {});
                        setDraftWorkplace(option.id);
                      }}
                      style={state => [
                        styles.optionPill,
                        selected ? styles.optionPillActive : styles.optionPillDefault,
                        state.pressed && styles.pressedFade,
                        Platform.OS === 'web' && (state as { focused?: boolean }).focused
                          ? styles.webFocusRing
                          : null,
                      ]}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      accessibilityLabel={`Filter workplace ${option.label}`}>
                      {selected ? (
                        <Check size={14} color="#121212" strokeWidth={2.6} />
                      ) : null}
                      <Text
                        style={[
                          styles.optionText,
                          selected && styles.optionTextActive,
                        ]}>
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.footerRow}>
              <Pressable
                onPress={handleReset}
                style={state => [
                  styles.resetButton,
                  state.pressed && styles.pressedFade,
                  Platform.OS === 'web' && (state as { focused?: boolean }).focused
                    ? styles.webFocusRing
                    : null,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Reset sort and filter options">
                <RotateCcw size={15} color="#121212" strokeWidth={2.2} />
                <Text style={styles.resetButtonText}>Reset</Text>
              </Pressable>

              <Pressable
                onPress={handleApply}
                style={state => [
                  styles.applyButton,
                  state.pressed && styles.pressedFade,
                  Platform.OS === 'web' && (state as { focused?: boolean }).focused
                    ? styles.webFocusRing
                    : null,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Apply sort and filter options">
                <Text style={styles.applyButtonText}>APPLY</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(18, 18, 18, 0.45)',
  },
  sheetContainer: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  sheetContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    borderTopWidth: 1.5,
    borderTopColor: '#E2E6DC',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 18,
    shadowColor: '#121212',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3E8',
    gap: 12,
  },
  headerTitleCol: {
    flex: 1,
    gap: 2,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#121212',
  },
  sheetSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#5A5D54',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F4F6F0',
    borderWidth: 1,
    borderColor: '#E2E6DC',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  sectionBlock: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 0.8,
    color: '#5A5D54',
    fontWeight: '700',
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionPill: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  optionPillDefault: {
    backgroundColor: '#F8F9F5',
    borderColor: '#E2E6DC',
  },
  optionPillActive: {
    backgroundColor: '#B8F23E',
    borderColor: '#98DA18',
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5A5D54',
  },
  optionTextActive: {
    color: '#121212',
    fontWeight: '800',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 4,
  },
  resetButton: {
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D8DEC9',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  resetButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#121212',
  },
  applyButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  applyButtonText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.7,
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
