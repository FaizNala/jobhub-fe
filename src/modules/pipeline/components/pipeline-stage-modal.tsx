import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { X, Check, Trash2 } from 'lucide-react-native';
import { PipelineItem, PipelineStage } from '../pipeline.types';
import { Heading, Body, Label } from '@/components/atoms/typography';
import { Radius } from '@/constants/theme';

interface PipelineStageModalProps {
  item: PipelineItem | null;
  visible: boolean;
  onClose: () => void;
  onUpdateStage: (id: string, stage: PipelineStage) => Promise<unknown> | void;
  onAddNote: (id: string, note: string) => Promise<unknown> | void;
  onRemove?: (id: string) => Promise<unknown> | void;
}

const STAGES: { id: PipelineStage; label: string; desc: string }[] = [
  { id: 'scouted', label: 'Scouted', desc: 'Discovered by AI' },
  { id: 'shortlisted', label: 'Shortlist', desc: 'Saved for review' },
  { id: 'applied', label: 'Applied', desc: 'Application sent' },
  { id: 'interviewing', label: 'Interview', desc: 'Rounds in progress' },
  { id: 'offered', label: 'Offer', desc: 'Offer received' },
];

export function PipelineStageModal({
  item,
  visible,
  onClose,
  onUpdateStage,
  onAddNote,
  onRemove,
}: PipelineStageModalProps) {
  const [selectedStage, setSelectedStage] = useState<PipelineStage>('shortlisted');
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (item) {
      setSelectedStage(item.stage);
      setNoteText('');
    }
  }, [item]);

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

  if (!item) return null;

  const handleSave = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    try {
      if (selectedStage !== item.stage) {
        await onUpdateStage(item.id, selectedStage);
      }
      if (noteText.trim()) {
        await onAddNote(item.id, noteText.trim());
      }
    } finally {
      onClose();
    }
  };

  const handleRemove = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    if (onRemove) {
      onRemove(item.id);
    }
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

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetContainer}>
          <View style={styles.sheetContent}>
            {/* Header */}
            <View style={styles.headerRow}>
              <View style={styles.headerTitleCol}>
                <Heading style={styles.roleTitle} numberOfLines={1}>
                  {item.job.title}
                </Heading>
                <Body style={styles.companyName}>{item.job.company}</Body>
              </View>

              <Pressable
                onPress={onClose}
                style={state => [
                  styles.closeButton,
                  state.pressed && styles.stagePillPressed,
                  Platform.OS === 'web' && (state as { focused?: boolean }).focused
                    ? styles.webFocusRing
                    : null,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Close stage update modal">
                <X size={18} color="#121212" />
              </Pressable>
            </View>

            {/* Stage Selector Grid */}
            <View style={styles.stagesSection}>
              <Label style={styles.sectionLabel}>PROGRESSION STAGE</Label>
              <View style={styles.stageOptionsGrid}>
                {STAGES.map(s => {
                  const isSelected = selectedStage === s.id;

                  return (
                    <Pressable
                      key={s.id}
                      onPress={() => {
                        Haptics.selectionAsync().catch(() => {});
                        setSelectedStage(s.id);
                      }}
                      style={state => [
                        styles.stagePill,
                        isSelected ? styles.stagePillActive : styles.stagePillInactive,
                        state.pressed && styles.stagePillPressed,
                        Platform.OS === 'web' && (state as { focused?: boolean }).focused
                          ? styles.webFocusRing
                          : null,
                        Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={`Select stage ${s.label}`}>
                      <View style={styles.stagePillLeft}>
                        {isSelected ? (
                          <Check size={14} color="#121212" strokeWidth={2.5} />
                        ) : null}
                        <Body
                          style={[
                            styles.stageLabelText,
                            isSelected && styles.stageLabelActive,
                          ]}>
                          {s.label}
                        </Body>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Note / Milestone Input */}
            <View style={styles.noteSection}>
              <Label style={styles.sectionLabel}>ADD NOTE OR INTERVIEW DATE (OPTIONAL)</Label>
              <TextInput
                value={noteText}
                onChangeText={setNoteText}
                placeholder="e.g. Recruiter phone screen scheduled for Nov 28..."
                placeholderTextColor="#5A5D54"
                style={styles.noteInput}
                accessibilityLabel="Application note input"
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionColumn}>
              <Pressable
                onPress={handleSave}
                style={state => [
                  styles.saveButton,
                  state.pressed && styles.saveButtonPressed,
                  Platform.OS === 'web' && (state as { focused?: boolean }).focused
                    ? styles.webFocusRing
                    : null,
                  Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Save stage update">
                <Label style={styles.saveButtonText}>SAVE UPDATE</Label>
              </Pressable>

              {onRemove ? (
                <Pressable
                  onPress={handleRemove}
                  style={state => [
                    styles.removeButton,
                    state.pressed && styles.removeButtonPressed,
                    Platform.OS === 'web' && (state as { focused?: boolean }).focused
                      ? styles.webFocusRing
                      : null,
                    Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Remove role from application tracker">
                  <Trash2 size={14} color="#991B1B" />
                  <Label style={styles.removeButtonText}>REMOVE FROM TRACKER</Label>
                </Pressable>
              ) : null}
            </View>
          </View>
        </KeyboardAvoidingView>
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
    paddingBottom: 36,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3E8',
  },
  headerTitleCol: {
    flex: 1,
    paddingRight: 12,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#121212',
  },
  companyName: {
    fontSize: 13,
    color: '#5A5D54',
    marginTop: 2,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F4F6F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8ECDF',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  stagesSection: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 0.8,
    color: '#5A5D54',
    fontWeight: '700',
  },
  stageOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stagePill: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stagePillActive: {
    backgroundColor: '#B8F23E',
    borderColor: '#A4DC35',
  },
  stagePillInactive: {
    backgroundColor: '#F8F9F5',
    borderColor: '#E8ECDF',
  },
  stagePillPressed: {
    opacity: 0.85,
  },
  stagePillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stageLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5A5D54',
  },
  stageLabelActive: {
    color: '#121212',
    fontWeight: '800',
  },
  noteSection: {
    gap: 8,
  },
  noteInput: {
    minHeight: 44,
    backgroundColor: '#F8F9F5',
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: '#E8ECDF',
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#121212',
  },
  actionColumn: {
    gap: 8,
    paddingTop: 4,
  },
  saveButton: {
    minHeight: 46,
    backgroundColor: '#121212',
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonPressed: {
    opacity: 0.88,
  },
  saveButtonText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#FFFFFF',
  },
  removeButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'transparent',
    borderRadius: Radius.pill,
  },
  removeButtonPressed: {
    backgroundColor: '#FEE2E2',
  },
  removeButtonText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#991B1B',
  },
  webFocusRing: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#121212',
    outlineOffset: 2,
  } as any,
});
