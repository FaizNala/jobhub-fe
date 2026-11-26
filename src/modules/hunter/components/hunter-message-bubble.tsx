import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Bot } from 'lucide-react-native';
import { HunterMessage } from '../hunter.types';
import { Job } from '@/modules/jobs/jobs.types';
import { HunterStatusTicker } from './hunter-status-ticker';
import { InChatJobCard } from './in-chat-job-card';
import { Body, Label } from '@/components/atoms/typography';
import { Colors, Radius } from '@/constants/theme';

interface HunterMessageBubbleProps {
  message: HunterMessage;
  onSelectJob?: (job: Job) => void;
  onSelectPrompt?: (prompt: string) => void;
}

export function HunterMessageBubble({
  message,
  onSelectJob,
  onSelectPrompt,
}: HunterMessageBubbleProps) {
  const isUser = message.role === 'user';

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handlePromptPress = (prompt: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (onSelectPrompt) onSelectPrompt(prompt);
  };

  return (
    <View
      style={[
        styles.rowContainer,
        isUser ? styles.rowUser : styles.rowAgent,
      ]}>
      {/* Agent Avatar Icon */}
      {!isUser ? (
        <View style={styles.agentAvatarBox} accessibilityElementsHidden>
          <Bot size={15} color="#121212" />
        </View>
      ) : null}

      <View
        style={[
          styles.bubbleWrapper,
          isUser ? styles.bubbleWrapperUser : styles.bubbleWrapperAgent,
        ]}>
        {/* Main Text Content */}
        <View
          style={[
            styles.bubbleCard,
            isUser ? styles.bubbleCardUser : styles.bubbleCardAgent,
          ]}>
          <Body
            style={[
              styles.messageText,
              isUser ? styles.messageTextUser : styles.messageTextAgent,
            ]}>
            {message.content}
          </Body>

          {/* Timestamp Indicator */}
          <Label
            style={[
              styles.timestampText,
              isUser ? styles.timestampUser : styles.timestampAgent,
            ]}>
            {formatTime(message.timestamp)}
          </Label>
        </View>

        {/* Telemetry Status Steps */}
        {!isUser && message.steps && message.steps.length > 0 ? (
          <View style={styles.attachmentContainer}>
            <HunterStatusTicker steps={message.steps} isHunting={false} />
          </View>
        ) : null}

        {/* Embedded Job Cards */}
        {!isUser && message.jobs && message.jobs.length > 0 ? (
          <View style={styles.attachmentContainer}>
            {message.jobs.map(job => (
              <InChatJobCard
                key={job.id}
                job={job}
                onViewDetail={onSelectJob}
              />
            ))}
          </View>
        ) : null}

        {/* Suggested Quick Prompt Chips Attached to Message */}
        {!isUser && message.suggestedPrompts && message.suggestedPrompts.length > 0 ? (
          <View style={styles.promptsContainer}>
            <Label style={styles.promptsHeader}>SUGGESTED NEXT STEPS</Label>
            <View style={styles.promptsList}>
              {message.suggestedPrompts.map(prompt => (
                <Pressable
                  key={prompt}
                  onPress={() => handlePromptPress(prompt)}
                  style={state => [
                    styles.promptPill,
                    state.pressed && styles.promptPillPressed,
                    Platform.OS === 'web' && (state as { focused?: boolean }).focused
                      ? styles.webFocusRing
                      : null,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={prompt}>
                  <Body style={styles.promptPillText}>{prompt}</Body>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    marginVertical: 6,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  rowAgent: {
    justifyContent: 'flex-start',
  },
  agentAvatarBox: {
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  bubbleWrapper: {
    maxWidth: '85%',
  },
  bubbleWrapperUser: {
    alignItems: 'flex-end',
  },
  bubbleWrapperAgent: {
    alignItems: 'flex-start',
    flex: 1,
  },
  bubbleCard: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubbleCardUser: {
    backgroundColor: '#121212',
    borderBottomRightRadius: 4,
  },
  bubbleCardAgent: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextUser: {
    color: '#FFFFFF',
  },
  messageTextAgent: {
    color: '#121212',
  },
  timestampText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timestampUser: {
    color: '#A0A398',
  },
  timestampAgent: {
    color: '#5A5D54',
  },
  attachmentContainer: {
    width: '100%',
    marginTop: 4,
  },
  promptsContainer: {
    width: '100%',
    marginTop: 8,
    gap: 6,
  },
  promptsHeader: {
    fontSize: 10,
    letterSpacing: 0.6,
    color: '#5A5D54',
    fontWeight: '700',
  },
  promptsList: {
    gap: 6,
  },
  promptPill: {
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  promptPillPressed: {
    backgroundColor: '#EFF3E8',
    borderColor: '#B8F23E',
  },
  promptPillText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#121212',
    fontWeight: '600',
  },
  webFocusRing: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#121212',
    outlineOffset: 2,
  } as any,
});
