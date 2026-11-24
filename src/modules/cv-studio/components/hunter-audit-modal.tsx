import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { X, Bot, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
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
  if (!metrics) return null;

  const handleLaunchHunterChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onClose();
    router.push('/agent' as any);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
          accessibilityLabel="Close audit modal"
        />

        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.hunterBadge}>
                <Bot size={14} color="#121212" />
                <Label style={styles.hunterBadgeText}>HUNTER AI AUDIT</Label>
              </View>
              <Heading style={styles.sheetTitle}>Dossier Strength Review</Heading>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityLabel="Close modal">
              <X size={18} color="#121212" />
            </TouchableOpacity>
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
                <View style={styles.scorePill}>
                  <Text style={styles.scorePillNumber}>{metrics.score}</Text>
                  <Text style={styles.scorePillMax}>/100</Text>
                </View>
              </View>
              <Body style={styles.summaryDesc}>
                Hunter analyzed your 8 core CV sections against standard hiring manager screening criteria and applicant tracking systems.
              </Body>
            </View>

            {/* Findings List */}
            <View style={styles.findingsSection}>
              <Label style={styles.findingsHeader}>HUNTER AUDIT FINDINGS</Label>
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
                          <Sparkles size={11} color="#2F4F00" />
                          <Body style={styles.suggestionText}>{item.suggestion}</Body>
                        </View>
                      ) : null}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Action Footer: Connects to Hunter Chatbot */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleLaunchHunterChat}
              style={styles.chatButton}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Consult Hunter in chat">
              <Bot size={16} color="#121212" />
              <Label style={styles.chatButtonText}>CONSULT HUNTER IN CHAT</Label>
              <ArrowRight size={15} color="#121212" />
            </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    height: '80%',
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: '#E8ECDF',
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
    gap: 4,
  },
  hunterBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2F4F00',
    letterSpacing: 0.5,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#121212',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: '#F4F6F0',
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
    borderColor: '#E8ECDF',
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
  scorePill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#EFFCD3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#B8F23E',
  },
  scorePillNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2F4F00',
  },
  scorePillMax: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2F4F00',
  },
  summaryDesc: {
    fontSize: 12,
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
    borderColor: '#E8ECDF',
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
  },
  findingSectionName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#121212',
  },
  findingTypeBadge: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
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
    padding: 8,
    borderRadius: Radius.sm,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E8ECDF',
  },
  suggestionText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
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
    backgroundColor: '#B8F23E',
    paddingVertical: 14,
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
});
