import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Briefcase, Check, Plus, User, X } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { Body, Heading, Label } from '@/components/atoms/typography';
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
const ROLE_SUGGESTIONS = [
  'Product Manager',
  'Senior Engineer',
  'Operations Lead',
  'Growth Strategist',
];
const LOCATION_SUGGESTIONS = [
  'Remote (Global)',
  'Jakarta / Hybrid',
  'Singapore',
  'San Francisco, CA',
];

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  visible,
  profile,
  onClose,
  onSave,
}) => {
  const [fullName, setFullName] = useState(profile?.fullName ?? '');
  const [headline, setHeadline] = useState(profile?.headline ?? '');
  const [location, setLocation] = useState(profile?.location ?? '');

  const [targetRoles, setTargetRoles] = useState<string[]>(
    profile?.preferences?.targetRoles ?? []
  );
  const [newRoleInput, setNewRoleInput] = useState('');

  const [workModels, setWorkModels] = useState<WorkModelType[]>(
    profile?.preferences?.workModels ?? ['Remote', 'Hybrid']
  );

  const [targetLocations, setTargetLocations] = useState<string[]>(
    profile?.preferences?.targetLocations ?? []
  );
  const [newLocationInput, setNewLocationInput] = useState('');

  const [minCompensation, setMinCompensation] = useState(
    profile?.preferences?.minCompensation ?? ''
  );

  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setFormError(null);
    setNewRoleInput('');
    setNewLocationInput('');
    if (profile) {
      setFullName(profile.fullName || '');
      setHeadline(profile.headline || '');
      setLocation(profile.location || '');
      setTargetRoles(profile.preferences?.targetRoles ?? []);
      setWorkModels(
        profile.preferences?.workModels && profile.preferences.workModels.length > 0
          ? profile.preferences.workModels
          : ['Remote', 'Hybrid']
      );
      setTargetLocations(profile.preferences?.targetLocations ?? []);
      setMinCompensation(profile.preferences?.minCompensation ?? '');
    }
  }, [profile, visible]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !visible) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSaving) {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isSaving, onClose, visible]);

  const handleAddRole = (roleToAdd?: string) => {
    const role = (roleToAdd || newRoleInput).trim();
    if (!role) return;
    if (targetRoles.some(r => r.toLowerCase() === role.toLowerCase())) {
      setNewRoleInput('');
      return;
    }
    Haptics.selectionAsync().catch(() => {});
    setTargetRoles([...targetRoles, role]);
    setNewRoleInput('');
  };

  const handleRemoveRole = (roleToRemove: string) => {
    Haptics.selectionAsync().catch(() => {});
    setTargetRoles(targetRoles.filter(r => r !== roleToRemove));
  };

  const handleToggleWorkModel = (model: WorkModelType) => {
    Haptics.selectionAsync().catch(() => {});
    if (workModels.includes(model)) {
      if (workModels.length > 1) {
        setFormError(null);
        setWorkModels(workModels.filter(m => m !== model));
      } else {
        setFormError('Keep at least one preferred work model selected.');
      }
    } else {
      setFormError(null);
      setWorkModels([...workModels, model]);
    }
  };

  const handleAddLocation = (locToAdd?: string) => {
    const loc = (locToAdd || newLocationInput).trim();
    if (!loc) return;
    if (targetLocations.some(l => l.toLowerCase() === loc.toLowerCase())) {
      setNewLocationInput('');
      return;
    }
    Haptics.selectionAsync().catch(() => {});
    setTargetLocations([...targetLocations, loc]);
    setNewLocationInput('');
  };

  const handleRemoveLocation = (locToRemove: string) => {
    Haptics.selectionAsync().catch(() => {});
    setTargetLocations(targetLocations.filter(l => l !== locToRemove));
  };

  const handleSave = async () => {
    const trimmedName = fullName.trim();
    const trimmedHeadline = headline.trim();
    if (!trimmedName) {
      setFormError('Please enter your full name before saving.');
      return;
    }
    if (!trimmedHeadline) {
      setFormError('Please enter your current headline or role title.');
      return;
    }

    // Preserve any unsubmitted role/location typed into inputs when saving
    const pendingRole = newRoleInput.trim();
    const nextRoles =
      pendingRole && !targetRoles.some(r => r.toLowerCase() === pendingRole.toLowerCase())
        ? [...targetRoles, pendingRole]
        : targetRoles;

    const pendingLocation = newLocationInput.trim();
    const nextLocations =
      pendingLocation &&
      !targetLocations.some(l => l.toLowerCase() === pendingLocation.toLowerCase())
        ? [...targetLocations, pendingLocation]
        : targetLocations;

    setFormError(null);
    setIsSaving(true);
    try {
      await onSave({
        fullName: trimmedName,
        headline: trimmedHeadline,
        location: location.trim(),
        preferences: {
          targetRoles: nextRoles,
          workModels,
          targetLocations: nextLocations,
          minCompensation: minCompensation.trim(),
        },
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      onClose();
    } catch (err: any) {
      setFormError(err?.message || 'Unable to save profile changes. Please try again.');
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
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => {
            if (!isSaving) onClose();
          }}
          accessibilityRole="button"
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
                Identity details & career search preferences
              </Body>
            </View>
            <Pressable
              onPress={onClose}
              disabled={isSaving}
              style={state => [
                styles.closeButton,
                state.pressed && styles.pressedFade,
                Platform.OS === 'web' && (state as { focused?: boolean }).focused
                  ? styles.webFocusRing
                  : null,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Close modal">
              <X size={18} color="#121212" />
            </Pressable>
          </View>

          {formError ? (
            <View style={styles.formErrorBanner} accessibilityLiveRegion="polite">
              <Text style={styles.formErrorText}>{formError}</Text>
            </View>
          ) : null}

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
                <Label style={styles.inputLabel}>FULL NAME *</Label>
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={text => {
                    setFullName(text);
                    if (formError) setFormError(null);
                  }}
                  placeholder="e.g. Jordan Mercer"
                  placeholderTextColor="#5A5D54"
                />
              </View>

              <View style={styles.inputGroup}>
                <Label style={styles.inputLabel}>CURRENT HEADLINE / ROLE *</Label>
                <TextInput
                  style={styles.input}
                  value={headline}
                  onChangeText={text => {
                    setHeadline(text);
                    if (formError) setFormError(null);
                  }}
                  placeholder="e.g. Senior Product Manager & Strategy Lead"
                  placeholderTextColor="#5A5D54"
                />
              </View>

              <View style={styles.inputGroup}>
                <Label style={styles.inputLabel}>BASE LOCATION</Label>
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="e.g. San Francisco, CA or Remote"
                  placeholderTextColor="#5A5D54"
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
                <Label style={styles.inputLabel}>TARGET ROLES</Label>
                <View style={styles.addTagRow}>
                  <TextInput
                    style={[styles.input, styles.addTagInput]}
                    value={newRoleInput}
                    onChangeText={setNewRoleInput}
                    placeholder="e.g. Operations Lead or Staff Engineer"
                    placeholderTextColor="#5A5D54"
                    onSubmitEditing={() => handleAddRole()}
                    returnKeyType="done"
                  />
                  <Pressable
                    onPress={() => handleAddRole()}
                    style={state => [
                      styles.addTagButton,
                      state.pressed && styles.pressedFade,
                      Platform.OS === 'web' && (state as { focused?: boolean }).focused
                        ? styles.webFocusRing
                        : null,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Add target role">
                    <Plus size={15} color="#121212" />
                    <Text style={styles.addTagButtonText}>ADD</Text>
                  </Pressable>
                </View>

                {targetRoles.length > 0 ? (
                  <View style={styles.tagsWrapper}>
                    {targetRoles.map(role => (
                      <View key={role} style={styles.tagChip}>
                        <Text style={styles.tagChipText}>{role}</Text>
                        <Pressable
                          onPress={() => handleRemoveRole(role)}
                          style={state => [
                            styles.tagRemoveBtn,
                            state.pressed && styles.pressedFade,
                            Platform.OS === 'web' && (state as { focused?: boolean }).focused
                              ? styles.webFocusRing
                              : null,
                          ]}
                          accessibilityRole="button"
                          accessibilityLabel={`Remove role ${role}`}>
                          <X size={13} color="#2F4F00" />
                        </Pressable>
                      </View>
                    ))}
                  </View>
                ) : null}

                <View style={styles.suggestionsRow}>
                  {ROLE_SUGGESTIONS.filter(
                    s => !targetRoles.some(r => r.toLowerCase() === s.toLowerCase())
                  ).map(s => (
                    <Pressable
                      key={s}
                      onPress={() => handleAddRole(s)}
                      style={state => [
                        styles.suggestionPill,
                        state.pressed && styles.pressedFade,
                        Platform.OS === 'web' && (state as { focused?: boolean }).focused
                          ? styles.webFocusRing
                          : null,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={`Add suggested role ${s}`}>
                      <Text style={styles.suggestionText}>+ {s}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Work Models */}
              <View style={styles.inputGroup}>
                <Label style={styles.inputLabel}>WORK MODEL PREFERENCE</Label>
                <View style={styles.pillsRow}>
                  {AVAILABLE_WORK_MODELS.map(model => {
                    const isSelected = workModels.includes(model);
                    return (
                      <Pressable
                        key={model}
                        onPress={() => handleToggleWorkModel(model)}
                        style={state => [
                          styles.selectorPill,
                          isSelected && styles.selectorPillActive,
                          state.pressed && styles.pressedFade,
                          Platform.OS === 'web' && (state as { focused?: boolean }).focused
                            ? styles.webFocusRing
                            : null,
                        ]}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected }}
                        accessibilityLabel={`Work model ${model}`}>
                        <Text
                          style={[
                            styles.selectorPillText,
                            isSelected && styles.selectorPillTextActive,
                          ]}>
                          {model}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                <Body style={styles.helperText}>
                  Select one or more preferred arrangements (at least one required).
                </Body>
              </View>

              {/* Target Locations */}
              <View style={styles.inputGroup}>
                <Label style={styles.inputLabel}>TARGET LOCATIONS / CITIES</Label>
                <View style={styles.addTagRow}>
                  <TextInput
                    style={[styles.input, styles.addTagInput]}
                    value={newLocationInput}
                    onChangeText={setNewLocationInput}
                    placeholder="e.g. Remote (Global) or Singapore"
                    placeholderTextColor="#5A5D54"
                    onSubmitEditing={() => handleAddLocation()}
                    returnKeyType="done"
                  />
                  <Pressable
                    onPress={() => handleAddLocation()}
                    style={state => [
                      styles.addTagButton,
                      state.pressed && styles.pressedFade,
                      Platform.OS === 'web' && (state as { focused?: boolean }).focused
                        ? styles.webFocusRing
                        : null,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Add target location">
                    <Plus size={15} color="#121212" />
                    <Text style={styles.addTagButtonText}>ADD</Text>
                  </Pressable>
                </View>

                {targetLocations.length > 0 ? (
                  <View style={styles.tagsWrapper}>
                    {targetLocations.map(loc => (
                      <View key={loc} style={styles.tagChip}>
                        <Text style={styles.tagChipText}>{loc}</Text>
                        <Pressable
                          onPress={() => handleRemoveLocation(loc)}
                          style={state => [
                            styles.tagRemoveBtn,
                            state.pressed && styles.pressedFade,
                            Platform.OS === 'web' && (state as { focused?: boolean }).focused
                              ? styles.webFocusRing
                              : null,
                          ]}
                          accessibilityRole="button"
                          accessibilityLabel={`Remove location ${loc}`}>
                          <X size={13} color="#2F4F00" />
                        </Pressable>
                      </View>
                    ))}
                  </View>
                ) : null}

                <View style={styles.suggestionsRow}>
                  {LOCATION_SUGGESTIONS.filter(
                    s => !targetLocations.some(l => l.toLowerCase() === s.toLowerCase())
                  ).map(s => (
                    <Pressable
                      key={s}
                      onPress={() => handleAddLocation(s)}
                      style={state => [
                        styles.suggestionPill,
                        state.pressed && styles.pressedFade,
                        Platform.OS === 'web' && (state as { focused?: boolean }).focused
                          ? styles.webFocusRing
                          : null,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={`Add suggested location ${s}`}>
                      <Text style={styles.suggestionText}>+ {s}</Text>
                    </Pressable>
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
                  placeholder="e.g. $120k - $160k / year or Rp 35M/mo"
                  placeholderTextColor="#5A5D54"
                />
              </View>
            </View>
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.sheetFooter}>
            <Pressable
              onPress={handleSave}
              disabled={isSaving}
              style={state => [
                styles.saveButton,
                isSaving && styles.disabledButton,
                state.pressed && !isSaving && styles.pressedFade,
                Platform.OS === 'web' && (state as { focused?: boolean }).focused
                  ? styles.webFocusRing
                  : null,
              ]}
              accessibilityRole="button"
              accessibilityState={{ busy: isSaving, disabled: isSaving }}
              accessibilityLabel="Save profile changes">
              {isSaving ? (
                <ActivityIndicator size="small" color="#121212" />
              ) : (
                <>
                  <Check size={16} color="#121212" />
                  <Text style={styles.saveButtonText}>SAVE PROFILE</Text>
                </>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 18, 18, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    height: '86%',
    maxHeight: '92%',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    overflow: 'hidden',
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
    flex: 1,
    paddingRight: 12,
    gap: 2,
  },
  sheetTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.4,
  },
  sheetSubtitle: {
    fontSize: 12,
    color: '#5A5D54',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: '#F4F6F0',
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  formErrorBanner: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: Radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  formErrorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#991B1B',
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 24,
  },
  formSection: {
    gap: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F6F0',
  },
  sectionIcon: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
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
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5A5D54',
    letterSpacing: 0.4,
  },
  helperText: {
    fontSize: 11,
    color: '#5A5D54',
    lineHeight: 16,
  },
  input: {
    minHeight: 44,
    backgroundColor: '#F9FAF7',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: Radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13.5,
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
    minHeight: 44,
    backgroundColor: '#B8F23E',
    paddingHorizontal: 16,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  addTagButtonText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#121212',
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  tagChip: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFFCD3',
    paddingLeft: 12,
    paddingRight: 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#B8F23E',
  },
  tagChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2F4F00',
  },
  tagRemoveBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  suggestionPill: {
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: '#F4F6F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  suggestionText: {
    fontSize: 11.5,
    color: '#5A5D54',
    fontWeight: '600',
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectorPill: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    backgroundColor: '#F9FAF7',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  selectorPillActive: {
    backgroundColor: '#121212',
    borderColor: '#121212',
  },
  selectorPillText: {
    fontSize: 12,
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
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    minHeight: 48,
    backgroundColor: '#B8F23E',
    paddingVertical: 12,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  disabledButton: {
    opacity: 0.65,
  },
  saveButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.5,
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
