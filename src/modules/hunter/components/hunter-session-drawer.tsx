import React from 'react';
import {
  Modal,
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Plus, X, Trash2, MessageSquare } from 'lucide-react-native';
import { HunterSession } from '../hunter.types';
import { Heading, Body } from '@/components/atoms/typography';
import { Colors } from '@/constants/theme';

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
    e.stopPropagation?.();
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
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Clean, Understated Side Drawer Panel */}
        <View style={styles.drawerPanel}>
          {/* Top Bar */}
          <View style={styles.drawerHeader}>
            <Heading style={styles.headerTitle}>Chats</Heading>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.buttonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Close drawer">
              <X size={18} color="#121212" />
            </Pressable>
          </View>

          {/* New Chat Row */}
          <Pressable
            onPress={handleCreate}
            style={({ pressed }) => [
              styles.newChatRow,
              pressed && styles.buttonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Start a new chat">
            <Plus size={16} color="#121212" strokeWidth={2.2} />
            <Body style={styles.newChatText}>New chat</Body>
          </Pressable>

          {/* Simple, Quiet Text List */}
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
                    style={styles.sessionMainPressable}
                    accessibilityRole="button"
                    accessibilityLabel={session.title}>
                    <MessageSquare
                      size={15}
                      color={isActive ? '#121212' : '#8A8D84'}
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

                  {/* Delete Button */}
                  <Pressable
                    onPress={e => handleDelete(session.id, e)}
                    hitSlop={8}
                    style={styles.deleteButton}
                    accessibilityRole="button"
                    accessibilityLabel={`Delete ${session.title}`}>
                    <Trash2 size={13} color="#8A8D84" />
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
    backgroundColor: 'rgba(18, 18, 18, 0.4)',
  },
  drawerPanel: {
    width: 290,
    maxWidth: '82%',
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E8ECDF',
    paddingTop: 48,
    paddingBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3E8',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#121212',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: '#F4F6F0',
  },
  newChatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 14,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#F4F6F0',
  },
  newChatText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#121212',
  },
  sessionListContent: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 24,
    gap: 2,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  sessionRowActive: {
    backgroundColor: '#EFF3E8',
  },
  sessionMainPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    height: '100%',
  },
  sessionText: {
    fontSize: 13,
    color: '#5A5D54',
    flex: 1,
  },
  sessionTextActive: {
    color: '#121212',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 6,
    opacity: 0.7,
  },
});
