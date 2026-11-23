import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { PanelLeft, SquarePen } from 'lucide-react-native';
import { useHunterChat } from '../hunter.hooks';
import { Job, JobDetailModal } from '@/modules/jobs';
import { HunterMessageBubble } from './hunter-message-bubble';
import { HunterInputBar } from './hunter-input-bar';
import { HunterSessionDrawer } from './hunter-session-drawer';
import { Heading, Body } from '@/components/atoms/typography';
import { Colors } from '@/constants/theme';

export function HunterChatView() {
  const {
    sessions,
    activeSessionId,
    activeSession,
    messages,
    isHunting,
    suggestedPrompts,
    sendMessage,
    switchSession,
    createNewSession,
    deleteSession,
  } = useHunterChat();

  const [inputText, setInputText] = useState('');
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const scrollViewRef = useRef<any>(null);

  // Auto-scroll on new message
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 120);
    return () => clearTimeout(timer);
  }, [messages.length, isHunting]);

  const handleSend = (text: string) => {
    sendMessage(text);
  };

  const handleSelectPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleOpenDrawer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setIsDrawerOpen(true);
  };

  const handleNewChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    createNewSession();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      {/* Sleek Minimalist Top Bar: Left Drawer, Center Title, Right New Chat */}
      <View style={styles.header}>
        <Pressable
          onPress={handleOpenDrawer}
          hitSlop={8}
          style={({ pressed }) => [
            styles.headerIconButton,
            pressed && styles.headerIconButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Open conversation history">
          <PanelLeft size={20} color="#121212" />
        </Pressable>

        <View style={styles.headerCenter}>
          <Heading style={styles.headerTitle} numberOfLines={1}>
            {activeSession?.title || 'New Hunt'}
          </Heading>
        </View>

        <Pressable
          onPress={handleNewChat}
          hitSlop={8}
          style={({ pressed }) => [
            styles.headerIconButton,
            pressed && styles.headerIconButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Start a new chat">
          <SquarePen size={19} color="#121212" />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
        {/* Messages Stream */}
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {messages.map(msg => (
            <HunterMessageBubble
              key={msg.id}
              message={msg}
              onSelectJob={job => setActiveJob(job)}
              onSelectPrompt={handleSelectPrompt}
            />
          ))}

          {/* Minimalist thinking indicator */}
          {isHunting ? (
            <View style={styles.huntingIndicatorRow}>
              <View style={styles.huntingBadge}>
                <View style={styles.huntingPulseDot} />
                <Body style={styles.huntingText}>Scouting opportunities...</Body>
              </View>
            </View>
          ) : null}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputWrapper}>
          <HunterInputBar
            value={inputText}
            onChangeText={setInputText}
            onSend={handleSend}
            isHunting={isHunting}
            suggestedPrompts={suggestedPrompts}
            onSelectPrompt={handleSelectPrompt}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Detail Modal */}
      <JobDetailModal
        job={activeJob}
        visible={Boolean(activeJob)}
        onClose={() => setActiveJob(null)}
      />

      {/* History Drawer */}
      <HunterSessionDrawer
        visible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={switchSession}
        onCreateNewSession={createNewSession}
        onDeleteSession={deleteSession}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3E8',
    backgroundColor: Colors.light.background,
  },
  headerIconButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  headerIconButtonPressed: {
    backgroundColor: '#EAEFE2',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#121212',
    textAlign: 'center',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  huntingIndicatorRow: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  huntingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF3E8',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D8DEC9',
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignSelf: 'flex-start',
  },
  huntingPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#B8F23E',
  },
  huntingText: {
    fontSize: 12,
    color: '#5A5D54',
    fontWeight: '500',
  },
  inputWrapper: {
    paddingBottom: Platform.OS === 'ios' ? 88 : 84,
  },
});
