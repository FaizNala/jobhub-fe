import React, { useEffect } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { MessageSquare, Plus, Trash2, X } from 'lucide-react-native';
import { HunterSession } from '../hunter.types';
import { Body, Heading } from '@/components/atoms/typography';
import { Colors, Radius } from '@/constants/theme';

interface HunterSessionDrawerProps {
  visible: boolean;
  onClose: () => void;
  sessions: HunterSession[];
  activeSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onCreateNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
}

export function HunterSessionDrawer({
  visible,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateNewSession,
  onDeleteSession,
}: HunterSessionDrawerProps) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS !== 'web' || !visible) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [onClose, visible]);

  const handleSelect = (id: string) => {
    Haptics.selectionAsync().catch(() => {});
    onSelectSession(id);
    onClose();
  };

  const handleCreate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onCreateNewSession();
    onClose();
  };

  const handleDelete = (id: string, e: any) => {
    e?.stopPropagation?.();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onDeleteSession(id);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable
          onPress={onClose}
          style={styles.backdrop}
          accessibilityRole="button"
          accessibilityLabel="Close conversation history drawer"
        />

        {/* Side Drawer Panel */}
        <View
          style={[
            styles.drawerPanel,
            { paddingTop: Math.max(insets.top + 12, 24) },
          ]}>
          {/* Top Bar */}
          <View style={styles.drawerHeader}>
            <Heading style={styles.headerTitle}>Chats</Heading>
            <Pressable
              onPress={onClose}
              style={state => [
                styles.closeButton,
                state.pressed && styles.buttonPressed,
                Platform.OS === 'web' && (state as { focused?: boolean }).focused
                  ? styles.webFocusRing
                  : null,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Close drawer">
              <X size={18} color="#121212" />
            </Pressable>
          </View>

          {/* New Chat Row */}
          <Pressable
            onPress={handleCreate}
            style={state => [
              styles.newChatRow,
              state.pressed && styles.buttonPressed,
              Platform.OS === 'web' && (state as { focused?: boolean }).focused
                ? styles.webFocusRing
                : null,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Start a new chat">
            <Plus size={16} color="#121212" strokeWidth={2.2} />
            <Body style={styles.newChatText}>New chat</Body>
          </Pressable>

          {/* Conversation Sessions List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sessionListContent}>
            {sessions.map(session => {
              const isActive = session.id === activeSessionId;

              return (
                <View
                  key={session.id}
                  style={[
                    styles.sessionRow,
                    isActive && styles.sessionRowActive,
                  ]}>
                  <Pressable
                    onPress={() => handleSelect(session.id)}
                    style={state => [
                      styles.sessionMainPressable,
                      state.pressed && styles.pressedFade,
                      Platform.OS === 'web' && (state as { focused?: boolean }).focused
                        ? styles.webFocusRing
                        : null,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                    accessibilityLabel={session.title}>
                    <MessageSquare
                      size={15}
                      color={isActive ? '#121212' : '#5A5D54'}
                    />
                    <Body
                      style={[
                        styles.sessionText,
                        isActive && styles.sessionTextActive,
                      ]}
                      numberOfLines={1}>
                      {session.title}
                    </Body>
                  </Pressable>

                  <Pressable
                    onPress={e => handleDelete(session.id, e)}
                    style={state => [
                      styles.deleteButton,
                      state.pressed && styles.buttonPressed,
                      Platform.OS === 'web' && (state as { focused?: boolean }).focused
                        ? styles.webFocusRing
                        : null,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Delete ${session.title}`}>
                    <Trash2 size={15} color="#5A5D54" />
                  </Pressable>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(18, 18, 18, 0.45)',
  },
  drawerPanel: {
    width: 300,
    maxWidth: '84%',
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1.5,
    borderRightColor: Colors.light.border,
    paddingBottom: 24,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3E8',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#121212',
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
  buttonPressed: {
    backgroundColor: '#EAEFE2',
  },
  pressedFade: {
    opacity: 0.78,
  },
  newChatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 14,
    minHeight: 44,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#F4F6F0',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  newChatText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#121212',
  },
  sessionListContent: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 24,
    gap: 4,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    borderRadius: Radius.sm,
    paddingLeft: 10,
  },
  sessionRowActive: {
    backgroundColor: '#EFF3E8',
  },
  sessionMainPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minHeight: 44,
    borderRadius: Radius.sm,
    paddingRight: 6,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  sessionText: {
    fontSize: 13,
    color: '#5A5D54',
    flex: 1,
  },
  sessionTextActive: {
    color: '#121212',
    fontWeight: '700',
  },
  deleteButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  webFocusRing: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#121212',
    outlineOffset: 1,
  } as any,
});
