import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { X, Plus, Check } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { Heading, Body, Label } from '@/components/atoms/typography';
import { CandidateProfile, UpdateProfileDto } from '../cv.types';

export interface CvEditModalProps {
  visible: boolean;
  profile: CandidateProfile | null;
  onClose: () => void;
  onSave: (dto: UpdateProfileDto) => Promise<void>;
}

export const CvEditModal: React.FC<CvEditModalProps> = ({
  visible,
  profile,
  onClose,
  onSave,
}) => {
  const [fullName, setFullName] = useState(profile?.fullName ?? '');
  const [headline, setHeadline] = useState(profile?.headline ?? '');
  const [location, setLocation] = useState(profile?.location ?? '');
  const [summary, setSummary] = useState(profile?.summary ?? '');
  const [skills, setSkills] = useState<string[]>(profile?.skills ?? []);
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName);
      setHeadline(profile.headline);
      setLocation(profile.location);
      setSummary(profile.summary);
      setSkills(profile.skills);
    }
  }, [profile, visible]);

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (skills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setNewSkill('');
      return;
    }
    Haptics.selectionAsync();
    setSkills([...skills, trimmed]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    Haptics.selectionAsync();
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        fullName: fullName.trim(),
        headline: headline.trim(),
        location: location.trim(),
        summary: summary.trim(),
        skills,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    } catch {
      // error handled in caller
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
          accessibilityLabel="Close profile modal"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetContainer}>
          <View style={styles.sheetHeader}>
            <View style={styles.sheetTitleBlock}>
              <Heading style={styles.sheetTitle}>EDIT CANDIDATE DOSSIER</Heading>
              <Body style={styles.sheetSubtitle}>Update your primary career attributes</Body>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityLabel="Close profile editor">
              <X size={18} color="#121212" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollBody}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>FULL NAME</Label>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Alex Vance"
                placeholderTextColor="#A0A59A"
              />
            </View>

            {/* Headline */}
            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>PROFESSIONAL HEADLINE</Label>
              <TextInput
                style={styles.input}
                value={headline}
                onChangeText={setHeadline}
                placeholder="Senior Mobile Engineer & Systems Architect"
                placeholderTextColor="#A0A59A"
              />
            </View>

            {/* Location */}
            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>LOCATION</Label>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="San Francisco, CA"
                placeholderTextColor="#A0A59A"
              />
            </View>

            {/* Summary */}
            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>EXECUTIVE SUMMARY</Label>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={summary}
                onChangeText={setSummary}
                multiline
                numberOfLines={3}
                placeholder="Brief summary of your career focus and core technical competencies..."
                placeholderTextColor="#A0A59A"
                textAlignVertical="top"
              />
            </View>

            {/* Skills Inventory */}
            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>TECHNICAL SKILLS INVENTORY</Label>
              <View style={styles.addSkillRow}>
                <TextInput
                  style={[styles.input, styles.addSkillInput]}
                  value={newSkill}
                  onChangeText={setNewSkill}
                  placeholder="e.g. Kotlin, SQLite, GraphQL"
                  placeholderTextColor="#A0A59A"
                  onSubmitEditing={handleAddSkill}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  onPress={handleAddSkill}
                  style={styles.addSkillButton}
                  activeOpacity={0.8}
                  accessibilityLabel="Add skill tag">
                  <Plus size={16} color="#121212" />
                  <Text style={styles.addSkillText}>ADD</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.skillsTagWrap}>
                {skills.map(s => (
                  <View key={s} style={styles.skillTag}>
                    <Text style={styles.skillTagText}>{s}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveSkill(s)}
                      style={styles.skillRemoveButton}
                      accessibilityLabel={`Remove skill ${s}`}>
                      <X size={12} color="#5A5D54" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.sheetFooter}>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              style={styles.saveButton}
              activeOpacity={0.85}
              accessibilityLabel="Save dossier changes">
              {isSaving ? (
                <ActivityIndicator size="small" color="#121212" />
              ) : (
                <>
                  <Check size={16} color="#121212" />
                  <Text style={styles.saveButtonText}>SAVE DOSSIER</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 18, 18, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: '#E8ECDF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
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
  sheetTitleBlock: {
    gap: 2,
  },
  sheetTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.5,
  },
  sheetSubtitle: {
    fontSize: 12,
    color: '#5A5D54',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    backgroundColor: '#F4F6F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5A5D54',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F9FAF7',
    borderWidth: 1.5,
    borderColor: '#E8ECDF',
    borderRadius: Radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#121212',
  },
  textArea: {
    height: 74,
  },
  addSkillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addSkillInput: {
    flex: 1,
  },
  addSkillButton: {
    backgroundColor: '#B8F23E',
    paddingHorizontal: 14,
    borderRadius: Radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addSkillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#121212',
  },
  skillsTagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFFCD3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#B8F23E',
  },
  skillTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2F4F00',
  },
  skillRemoveButton: {
    padding: 2,
  },
  sheetFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    borderTopWidth: 1,
    borderTopColor: '#F4F6F0',
  },
  saveButton: {
    backgroundColor: '#B8F23E',
    paddingVertical: 14,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.5,
  },
});
