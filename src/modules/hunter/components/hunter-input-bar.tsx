import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ArrowUp } from 'lucide-react-native';
import { Body } from '@/components/atoms/typography';
import { Colors, Radius } from '@/constants/theme';

interface HunterInputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: (text: string) => Promise<boolean> | boolean;
  isHunting: boolean;
  suggestedPrompts?: string[];
  onSelectPrompt?: (prompt: string) => void;
}

export function HunterInputBar({
  value,
  onChangeText,
  onSend,
  isHunting,
  suggestedPrompts,
  onSelectPrompt,
}: HunterInputBarProps) {
  const canSend = value.trim().length > 0 && !isHunting;

  const handleSend = async () => {
    if (!canSend) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const textToSend = value;
    onChangeText('');
    const ok = await onSend(textToSend);
    if (ok === false) {
      onChangeText(textToSend);
    }
  };

  const handlePromptPress = (prompt: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (onSelectPrompt) {
      onSelectPrompt(prompt);
    } else {
      onChangeText(prompt);
    }
  };

  const handleKeyPress = (e: any) => {
    if (Platform.OS !== 'web') return;
    if (e?.nativeEvent?.key === 'Enter' && !e?.nativeEvent?.shiftKey) {
      e.preventDefault?.();
      handleSend();
    }
  };

  return (
    <View style={styles.outerContainer}>
      {/* Quick Suggested Prompts Horizontal Slider */}
      {suggestedPrompts && suggestedPrompts.length > 0 && !isHunting ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promptsScrollContent}>
          {suggestedPrompts.map(prompt => (
            <Pressable
              key={prompt}
              onPress={() => handlePromptPress(prompt)}
              style={state => [
                styles.quickPill,
                state.pressed && styles.quickPillPressed,
                Platform.OS === 'web' && (state as { focused?: boolean }).focused
                  ? styles.webFocusRing
                  : null,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Select prompt: ${prompt}`}>
              <Body style={styles.quickPillText} numberOfLines={1}>
                {prompt}
              </Body>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      {/* Main Input Capsule */}
      <View style={styles.inputCapsule}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onKeyPress={handleKeyPress}
          placeholder={
            isHunting
              ? 'Agent is scouting boards and curated feeds...'
              : 'Search roles, benchmark compensation, or audit CV...'
          }
          placeholderTextColor="#5A5D54"
          multiline
          maxLength={500}
          editable={!isHunting}
          style={styles.textInput}
          accessibilityLabel="Message input for Career Agent"
        />

        {/* Circular Send Action Button (>= 44x44) */}
        <Pressable
          onPress={handleSend}
          disabled={!canSend && !isHunting}
          style={state => [
            styles.sendButton,
            canSend ? styles.sendButtonActive : styles.sendButtonDisabled,
            state.pressed && canSend && styles.sendButtonPressed,
            Platform.OS === 'web' && (state as { focused?: boolean }).focused
              ? styles.webFocusRing
              : null,
          ]}
          accessibilityRole="button"
          accessibilityState={{ busy: isHunting, disabled: !canSend }}
          accessibilityLabel="Send message to Hunter Agent">
          {isHunting ? (
            <ActivityIndicator size="small" color="#121212" />
          ) : (
            <ArrowUp
              size={19}
              color={canSend ? '#121212' : '#5A5D54'}
              strokeWidth={2.5}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: 'transparent',
    gap: 8,
  },
  promptsScrollContent: {
    gap: 8,
    paddingBottom: 4,
  },
  quickPill: {
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  quickPillPressed: {
    backgroundColor: '#EFF3E8',
    borderColor: '#B8F23E',
  },
  quickPillText: {
    fontSize: 12,
    color: '#121212',
    fontWeight: '600',
  },
  inputCapsule: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 108,
    fontSize: 14,
    lineHeight: 20,
    color: '#121212',
    paddingTop: Platform.OS === 'ios' ? 9 : 7,
    paddingBottom: Platform.OS === 'ios' ? 9 : 7,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  sendButtonActive: {
    backgroundColor: '#B8F23E',
  },
  sendButtonDisabled: {
    backgroundColor: '#EFF3E8',
  },
  sendButtonPressed: {
    opacity: 0.8,
  },
  webFocusRing: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#121212',
    outlineOffset: 2,
  } as any,
});
