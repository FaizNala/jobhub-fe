import React, { useEffect } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { X, Bot, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react-native';
import { Radius } from '@/constants/theme';
import { Heading, Body, Label } from '@/components/atoms/typography';
import { CvHealthMetrics } from '../cv.types';

export interface HunterAuditModalProps {
  visible: boolean;
  metrics: CvHealthMetrics | null;
  onClose: () => void;
}

export const HunterAuditModal: React.FC<HunterAuditModalProps> = ({
  visible,
  metrics,
  onClose,
}) => {
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

  if (!metrics) return null;

  const handleLaunchHunterChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onClose();
    router.push('/agent' as any);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Close audit modal"
        />

        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.hunterBadge}>
                <Bot size={14} color="#2F4F00" />
                <Label style={styles.hunterBadgeText}>HUNTER AI AUDIT</Label>
              </View>
              <Heading style={styles.sheetTitle}>Dossier Strength Review</Heading>
            </View>
            <Pressable
              onPress={onClose}
              style={state => [
                styles.closeButton,
                state.pressed && styles.pressedFade,
                Platform.OS === 'web' && (state as { focused?: boolean }).focused
                  ? styles.webFocusRing
                  : null,
                Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Close modal">
              <X size={18} color="#121212" />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={true}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollBody}>
            {/* Score Summary Box */}
            <View style={styles.summaryBox}>
              <View style={styles.summaryTop}>
                <View>
                  <Label style={styles.summarySub}>OVERALL ATS READINESS</Label>
                  <Heading style={styles.summaryLevel}>{metrics.level}</Heading>
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreBadgeNumber}>{metrics.score}</Text>
                  <Text style={styles.scoreBadgeMax}>/100</Text>
                </View>
              </View>
              <Body style={styles.summaryDesc}>
                Review of your core CV sections against hiring screening structure and applicant tracking readability.
              </Body>
            </View>

            {/* Findings List */}
            <View style={styles.findingsSection}>
              <Label style={styles.findingsHeader}>AUDIT FINDINGS</Label>
              <View style={styles.findingsList}>
                {metrics.auditItems.map((item, idx) => (
                  <View key={idx} style={styles.findingCard}>
                    <View style={styles.findingIconBlock}>
                      {item.type === 'strength' ? (
                        <CheckCircle2 size={16} color="#2F4F00" />
                      ) : (
                        <AlertCircle size={16} color="#8A6508" />
                      )}
                    </View>
                    <View style={styles.findingContent}>
                      <View style={styles.findingTitleRow}>
                        <Heading style={styles.findingSectionName}>{item.section}</Heading>
                        <Label
                          style={[
                            styles.findingTypeBadge,
                            item.type === 'strength'
                              ? styles.findingTypeStrength
                              : styles.findingTypeTip,
                          ]}>
                          {item.type.toUpperCase()}
                        </Label>
                      </View>
                      <Body style={styles.findingMessage}>{item.message}</Body>
                      {item.suggestion ? (
                        <View style={styles.suggestionBox}>
                          <Sparkles size={12} color="#2F4F00" />
                          <Body style={styles.suggestionText}>{item.suggestion}</Body>
                        </View>
                      ) : null}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.footer}>
            <Pressable
              onPress={handleLaunchHunterChat}
              style={state => [
                styles.chatButton,
                state.pressed && styles.pressedFade,
                Platform.OS === 'web' && (state as { focused?: boolean }).focused
                  ? styles.webFocusRing
                  : null,
                Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Consult Hunter in chat">
              <Bot size={16} color="#121212" />
              <Label style={styles.chatButtonText}>CONSULT HUNTER IN CHAT</Label>
              <ArrowRight size={15} color="#121212" />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 18, 18, 0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    height: '82%',
    maxHeight: '88%',
    borderWidth: 1,
    borderColor: '#E2E6DC',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F6F0',
  },
  headerLeft: {
    gap: 2,
  },
  hunterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  hunterBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2F4F00',
    letterSpacing: 0.5,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#121212',
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
  },
  scrollView: {
    flex: 1,
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 18,
  },
  summaryBox: {
    backgroundColor: '#F9FAF7',
    borderRadius: Radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E6DC',
    gap: 8,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summarySub: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5A5D54',
    letterSpacing: 0.5,
  },
  summaryLevel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#121212',
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#EFFCD3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#B8F23E',
  },
  scoreBadgeNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2F4F00',
  },
  scoreBadgeMax: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2F4F00',
  },
  summaryDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#5A5D54',
  },
  findingsSection: {
    gap: 10,
  },
  findingsHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5A5D54',
    letterSpacing: 0.5,
  },
  findingsList: {
    gap: 10,
  },
  findingCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E6DC',
    borderRadius: Radius.md,
    padding: 14,
  },
  findingIconBlock: {
    marginTop: 2,
  },
  findingContent: {
    flex: 1,
    gap: 4,
  },
  findingTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  findingSectionName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#121212',
  },
  findingTypeBadge: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  findingTypeStrength: {
    backgroundColor: '#EFFCD3',
    color: '#2F4F00',
  },
  findingTypeTip: {
    backgroundColor: '#FFF8E1',
    color: '#8A6508',
  },
  findingMessage: {
    fontSize: 12,
    lineHeight: 17,
    color: '#343830',
  },
  suggestionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#F9FAF7',
    padding: 9,
    borderRadius: Radius.sm,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E2E6DC',
  },
  suggestionText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16,
    color: '#2F4F00',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    borderTopWidth: 1,
    borderTopColor: '#F4F6F0',
  },
  chatButton: {
    minHeight: 48,
    backgroundColor: '#B8F23E',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  chatButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.5,
  },
  pressedFade: {
    opacity: 0.82,
  },
  webFocusRing: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#121212',
    outlineOffset: 2,
  } as any,
});
