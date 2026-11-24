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
import { X, Check, Plus, Briefcase, MapPin, DollarSign, User } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { Heading, Body, Label } from '@/components/atoms/typography';
import {
  CandidateProfile,
  UpdateProfileDto,
  WorkModelType,
} from '../cv.types';

export interface ProfileEditModalProps {
  visible: boolean;
  profile: CandidateProfile | null;
  onClose: () => void;
  onSave: (dto: UpdateProfileDto) => Promise<void>;
}

const AVAILABLE_WORK_MODELS: WorkModelType[] = ['Remote', 'Hybrid', 'On-Site'];
const ROLE_SUGGESTIONS = ['Staff Mobile Architect', 'Lead iOS Engineer', 'Senior Frontend Engineer'];
const LOCATION_SUGGESTIONS = ['San Francisco, CA', 'Remote (US)', 'New York, NY'];

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  visible,
  profile,
  onClose,
  onSave,
}) => {
  // Identity
  const [fullName, setFullName] = useState(profile?.fullName ?? '');
  const [headline, setHeadline] = useState(profile?.headline ?? '');
  const [location, setLocation] = useState(profile?.location ?? '');

  // Target Roles (Multi-select tags)
  const [targetRoles, setTargetRoles] = useState<string[]>(
    profile?.preferences?.targetRoles ?? ['Senior React Native Engineer', 'Mobile Solutions Architect']
  );
  const [newRoleInput, setNewRoleInput] = useState('');

  // Work Models (Multi-select)
  const [workModels, setWorkModels] = useState<WorkModelType[]>(
    profile?.preferences?.workModels ?? ['Remote', 'Hybrid']
  );

  // Target Locations (Multi-select tags)
  const [targetLocations, setTargetLocations] = useState<string[]>(
    profile?.preferences?.targetLocations ?? ['San Francisco, CA', 'Remote (US)']
  );
  const [newLocationInput, setNewLocationInput] = useState('');

  // Target Compensation
  const [minCompensation, setMinCompensation] = useState(
    profile?.preferences?.minCompensation ?? '$150k - $210k / year'
  );

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName);
      setHeadline(profile.headline);
      setLocation(profile.location);
      if (profile.preferences) {
        setTargetRoles(profile.preferences.targetRoles || []);
        setWorkModels(profile.preferences.workModels || ['Remote', 'Hybrid']);
        setTargetLocations(profile.preferences.targetLocations || []);
        setMinCompensation(profile.preferences.minCompensation || '');
      }
    }
  }, [profile, visible]);

  // Add / remove target roles
  const handleAddRole = (roleToAdd?: string) => {
    const role = (roleToAdd || newRoleInput).trim();
    if (!role) return;
    if (targetRoles.some(r => r.toLowerCase() === role.toLowerCase())) {
      setNewRoleInput('');
      return;
    }
    Haptics.selectionAsync();
    setTargetRoles([...targetRoles, role]);
    setNewRoleInput('');
  };

  const handleRemoveRole = (roleToRemove: string) => {
    Haptics.selectionAsync();
    setTargetRoles(targetRoles.filter(r => r !== roleToRemove));
  };

  // Toggle work model
  const handleToggleWorkModel = (model: WorkModelType) => {
    Haptics.selectionAsync();
    if (workModels.includes(model)) {
      if (workModels.length > 1) {
        setWorkModels(workModels.filter(m => m !== model));
      }
    } else {
      setWorkModels([...workModels, model]);
    }
  };

  // Add / remove target locations
  const handleAddLocation = (locToAdd?: string) => {
    const loc = (locToAdd || newLocationInput).trim();
    if (!loc) return;
    if (targetLocations.some(l => l.toLowerCase() === loc.toLowerCase())) {
      setNewLocationInput('');
      return;
    }
    Haptics.selectionAsync();
    setTargetLocations([...targetLocations, loc]);
    setNewLocationInput('');
  };

  const handleRemoveLocation = (locToRemove: string) => {
    Haptics.selectionAsync();
    setTargetLocations(targetLocations.filter(l => l !== locToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        fullName: fullName.trim(),
        headline: headline.trim(),
        location: location.trim(),
        preferences: {
          targetRoles,
          workModels,
          targetLocations,
          minCompensation: minCompensation.trim(),
        },
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
          accessibilityLabel="Close profile edit modal"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.sheetTitleBlock}>
              <Heading style={styles.sheetTitle}>EDIT PROFILE</Heading>
              <Body style={styles.sheetSubtitle}>
                Personal credentials & job hunting preferences
              </Body>
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
            style={styles.modalScrollView}
            contentContainerStyle={styles.scrollBody}>
            {/* Section 1: Identity */}
            <View style={styles.formSection}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionIcon}>
                  <User size={13} color="#121212" />
                </View>
                <Label style={styles.sectionHeaderLabel}>PROFILE INFORMATION</Label>
              </View>

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

              <View style={styles.inputGroup}>
                <Label style={styles.inputLabel}>CURRENT HEADLINE / TITLE</Label>
                <TextInput
                  style={styles.input}
                  value={headline}
                  onChangeText={setHeadline}
                  placeholder="Senior Mobile Engineer & Systems Architect"
                  placeholderTextColor="#A0A59A"
                />
              </View>

              <View style={styles.inputGroup}>
                <Label style={styles.inputLabel}>BASE LOCATION</Label>
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="San Francisco, CA"
                  placeholderTextColor="#A0A59A"
                />
              </View>
            </View>

            {/* Section 2: Job Preferences */}
            <View style={styles.formSection}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionIcon}>
                  <Briefcase size={13} color="#121212" />
                </View>
                <Label style={styles.sectionHeaderLabel}>TARGET ROLES & PREFERENCES</Label>
              </View>

              {/* Target Roles (Multi-tag) */}
              <View style={styles.inputGroup}>
                <Label style={styles.inputLabel}>TARGET ROLES (MULTI-SELECT)</Label>
                <View style={styles.addTagRow}>
                  <TextInput
                    style={[styles.input, styles.addTagInput]}
                    value={newRoleInput}
                    onChangeText={setNewRoleInput}
                    placeholder="e.g. Staff Mobile Architect"
                    placeholderTextColor="#A0A59A"
                    onSubmitEditing={() => handleAddRole()}
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    onPress={() => handleAddRole()}
                    style={styles.addTagButton}
                    activeOpacity={0.8}
                    accessibilityLabel="Add target role">
                    <Plus size={15} color="#121212" />
                    <Text style={styles.addTagButtonText}>ADD</Text>
                  </TouchableOpacity>
                </View>

                {/* Selected Roles Chips */}
                <View style={styles.tagsWrapper}>
                  {targetRoles.map(role => (
                    <View key={role} style={styles.tagChip}>
                      <Text style={styles.tagChipText}>{role}</Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveRole(role)}
                        style={styles.tagRemoveBtn}
                        accessibilityLabel={`Remove role ${role}`}>
                        <X size={12} color="#5A5D54" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>

                {/* Quick Role Suggestions */}
                <View style={styles.suggestionsRow}>
                  {ROLE_SUGGESTIONS.filter(s => !targetRoles.includes(s)).map(s => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => handleAddRole(s)}
                      style={styles.suggestionPill}>
                      <Text style={styles.suggestionText}>+ {s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Work Models (Multi-Select) */}
              <View style={styles.inputGroup}>
                <Label style={styles.inputLabel}>WORK MODEL PREFERENCE (MULTI-SELECT)</Label>
                <View style={styles.pillsRow}>
                  {AVAILABLE_WORK_MODELS.map(model => {
                    const isSelected = workModels.includes(model);
                    return (
                      <TouchableOpacity
                        key={model}
                        onPress={() => handleToggleWorkModel(model)}
                        style={[
                          styles.selectorPill,
                          isSelected && styles.selectorPillActive,
                        ]}>
                        <Text
                          style={[
                            styles.selectorPillText,
                            isSelected && styles.selectorPillTextActive,
                          ]}>
                          {model}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <Body style={styles.helperText}>
                  Select all that apply (e.g. both Remote & Hybrid).
                </Body>
              </View>

              {/* Target Locations (Multi-tag) */}
              <View style={styles.inputGroup}>
                <Label style={styles.inputLabel}>TARGET LOCATIONS / CITIES (MULTI-SELECT)</Label>
                <View style={styles.addTagRow}>
                  <TextInput
                    style={[styles.input, styles.addTagInput]}
                    value={newLocationInput}
                    onChangeText={setNewLocationInput}
                    placeholder="e.g. Remote (US) or New York, NY"
                    placeholderTextColor="#A0A59A"
                    onSubmitEditing={() => handleAddLocation()}
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    onPress={() => handleAddLocation()}
                    style={styles.addTagButton}
                    activeOpacity={0.8}
                    accessibilityLabel="Add target location">
                    <Plus size={15} color="#121212" />
                    <Text style={styles.addTagButtonText}>ADD</Text>
                  </TouchableOpacity>
                </View>

                {/* Selected Locations Chips */}
                <View style={styles.tagsWrapper}>
                  {targetLocations.map(loc => (
                    <View key={loc} style={styles.tagChip}>
                      <Text style={styles.tagChipText}>{loc}</Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveLocation(loc)}
                        style={styles.tagRemoveBtn}
                        accessibilityLabel={`Remove location ${loc}`}>
                        <X size={12} color="#5A5D54" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>

                {/* Quick Location Suggestions */}
                <View style={styles.suggestionsRow}>
                  {LOCATION_SUGGESTIONS.filter(s => !targetLocations.includes(s)).map(s => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => handleAddLocation(s)}
                      style={styles.suggestionPill}>
                      <Text style={styles.suggestionText}>+ {s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Target Compensation */}
              <View style={styles.inputGroup}>
                <Label style={styles.inputLabel}>EXPECTED COMPENSATION RANGE</Label>
                <TextInput
                  style={styles.input}
                  value={minCompensation}
                  onChangeText={setMinCompensation}
                  placeholder="e.g. $150k - $210k / year"
                  placeholderTextColor="#A0A59A"
                />
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
              accessibilityLabel="Save profile changes">
              {isSaving ? (
                <ActivityIndicator size="small" color="#121212" />
              ) : (
                <>
                  <Check size={16} color="#121212" />
                  <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
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
    backgroundColor: 'rgba(18, 18, 18, 0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    height: '85%',
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: '#E8ECDF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  modalScrollView: {
    flex: 1,
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
    paddingVertical: 18,
    gap: 22,
  },
  formSection: {
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F6F0',
  },
  sectionIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F4F6F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.5,
  },
  inputGroup: {
    gap: 6,
  },
  labelWithCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5A5D54',
    letterSpacing: 0.4,
  },
  helperText: {
    fontSize: 11,
    color: '#73786B',
    lineHeight: 15,
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
  addTagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addTagInput: {
    flex: 1,
  },
  addTagButton: {
    backgroundColor: '#B8F23E',
    paddingHorizontal: 14,
    borderRadius: Radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addTagButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#121212',
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFFCD3',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#B8F23E',
  },
  tagChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2F4F00',
  },
  tagRemoveBtn: {
    padding: 2,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  suggestionPill: {
    backgroundColor: '#F4F6F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#E8ECDF',
  },
  suggestionText: {
    fontSize: 10.5,
    color: '#5A5D54',
    fontWeight: '500',
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectorPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: '#E8ECDF',
    backgroundColor: '#F9FAF7',
  },
  selectorPillActive: {
    backgroundColor: '#121212',
    borderColor: '#121212',
  },
  selectorPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5A5D54',
  },
  selectorPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
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
