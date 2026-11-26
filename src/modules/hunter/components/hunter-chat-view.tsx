import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { AlertCircle, PanelLeft, SquarePen, X } from 'lucide-react-native';
import { useHunterChat } from '../hunter.hooks';
import { Job, JobDetailModal } from '@/modules/jobs';
import { HunterMessageBubble } from './hunter-message-bubble';
import { HunterInputBar } from './hunter-input-bar';
import { HunterSessionDrawer } from './hunter-session-drawer';
import { Body, Heading, Label } from '@/components/atoms/typography';
import { Colors, Radius } from '@/constants/theme';

export function HunterChatView() {
  const {
    sessions,
    activeSessionId,
    activeSession,
    messages,
    isInitialLoading,
    isLoadingMessages,
    isHunting,
    error,
    suggestedPrompts,
    sendMessage,
    retryLastPrompt,
    clearError,
    switchSession,
    createNewSession,
    deleteSession,
  } = useHunterChat();

  const [inputText, setInputText] = useState('');
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, () => setIsKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setIsKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 120);
    return () => clearTimeout(timer);
  }, [messages.length, isHunting]);

  const handleSend = async (text: string): Promise<boolean> => {
    return sendMessage(text);
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

      {/* Header Bar (Centered maxWidth: 720 on desktop) */}
      <View style={styles.headerOuter}>
        <View style={styles.header}>
          <Pressable
            onPress={handleOpenDrawer}
            style={state => [
              styles.headerIconButton,
              state.pressed && styles.headerIconButtonPressed,
              Platform.OS === 'web' && (state as { focused?: boolean }).focused
                ? styles.webFocusRing
                : null,
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
            style={state => [
              styles.headerIconButton,
              state.pressed && styles.headerIconButtonPressed,
              Platform.OS === 'web' && (state as { focused?: boolean }).focused
                ? styles.webFocusRing
                : null,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Start a new chat">
            <SquarePen size={19} color="#121212" />
          </Pressable>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
        {/* Inline Error + Retry Banner */}
        {error ? (
          <View style={styles.errorBannerWrap}>
            <View style={styles.errorBanner} accessibilityLiveRegion="polite">
              <AlertCircle size={16} color="#991B1B" />
              <Body style={styles.errorBannerText}>{error}</Body>
              <Pressable
                onPress={() => retryLastPrompt()}
                style={state => [
                  styles.errorRetryBtn,
                  state.pressed && styles.pressedFade,
                  Platform.OS === 'web' && (state as { focused?: boolean }).focused
                    ? styles.webFocusRing
                    : null,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Retry failed action">
                <Label style={styles.errorRetryText}>RETRY</Label>
              </Pressable>
              <Pressable
                onPress={clearError}
                style={state => [
                  styles.errorDismissBtn,
                  state.pressed && styles.pressedFade,
                  Platform.OS === 'web' && (state as { focused?: boolean }).focused
                    ? styles.webFocusRing
                    : null,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Dismiss error">
                <X size={15} color="#991B1B" />
              </Pressable>
            </View>
          </View>
        ) : null}

        {/* Messages Stream */}
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.streamWrapper}>
            {(isInitialLoading || isLoadingMessages) && messages.length === 0 ? (
              <View style={styles.stateBox} accessibilityLiveRegion="polite">
                <ActivityIndicator size="small" color="#121212" />
                <Body style={styles.stateBody}>Loading your Hunter workspace...</Body>
              </View>
            ) : messages.length === 0 ? (
              <View style={styles.stateBox}>
                <Heading style={styles.stateTitle}>Start a new career hunt</Heading>
                <Body style={styles.stateBody}>
                  Describe the role, work setup, or compensation range you want to explore.
                </Body>
              </View>
            ) : (
              messages.map(msg => (
                <HunterMessageBubble
                  key={msg.id}
                  message={msg}
                  onSelectJob={job => setActiveJob(job)}
                  onSelectPrompt={handleSelectPrompt}
                />
              ))
            )}

            {/* Minimalist scouting indicator */}
            {isHunting ? (
              <View style={styles.huntingIndicatorRow} accessibilityLiveRegion="polite">
                <View style={styles.huntingBadge}>
                  <View style={styles.huntingPulseDot} />
                  <Body style={styles.huntingText}>Scouting opportunities...</Body>
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>

        {/* Input Bar (Synced with FloatingDock bottom clearance) */}
        <View
          style={[
            styles.inputWrapper,
            { paddingBottom: isKeyboardVisible ? 8 : Platform.OS === 'ios' ? 92 : 90 },
          ]}>
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
  headerOuter: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  header: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    minHeight: 52,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
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
  errorBannerWrap: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: Radius.sm,
    paddingLeft: 12,
    paddingRight: 4,
    paddingVertical: 4,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#991B1B',
  },
  errorRetryBtn: {
    minHeight: 44,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderRadius: Radius.sm,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  errorRetryText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#991B1B',
    letterSpacing: 0.4,
  },
  errorDismissBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  streamWrapper: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  stateBox: {
    paddingHorizontal: 24,
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#121212',
    textAlign: 'center',
  },
  stateBody: {
    fontSize: 13,
    lineHeight: 19,
    color: '#5A5D54',
    textAlign: 'center',
    maxWidth: 300,
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
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignSelf: 'flex-start',
  },
  huntingPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#15803D',
  },
  huntingText: {
    fontSize: 12,
    color: '#5A5D54',
    fontWeight: '600',
  },
  inputWrapper: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
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
