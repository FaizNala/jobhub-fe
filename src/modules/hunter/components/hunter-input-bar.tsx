import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ArrowUp, Loader2, Sparkles } from 'lucide-react-native';
import { Body, Label } from '@/components/atoms/typography';
import { Colors, Radius } from '@/constants/theme';

interface HunterInputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: (text: string) => void;
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

  const handleSend = () => {
    if (!canSend) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const textToSend = value;
    onChangeText('');
    onSend(textToSend);
  };

  const handlePromptPress = (prompt: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (onSelectPrompt) {
      onSelectPrompt(prompt);
    } else {
      onChangeText(prompt);
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
              style={({ pressed }) => [
                styles.quickPill,
                pressed && styles.quickPillPressed,
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
          placeholder={
            isHunting
              ? 'Agent is scouting jobs across connectors...'
              : 'Search roles, benchmark compensation, or audit CV...'
          }
          placeholderTextColor="#8E9285"
          multiline
          maxLength={500}
          editable={!isHunting}
          style={styles.textInput}
          accessibilityLabel="Message input for Career Agent"
        />

        {/* Circular Send Action Button */}
        <Pressable
          onPress={handleSend}
          disabled={!canSend}
          style={({ pressed }) => [
            styles.sendButton,
            canSend ? styles.sendButtonActive : styles.sendButtonDisabled,
            pressed && canSend && styles.sendButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Send message to Hunter Agent">
          {isHunting ? (
            <Loader2 size={18} color="#121212" />
          ) : (
            <ArrowUp
              size={18}
              color={canSend ? '#121212' : '#8E9285'}
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
    paddingBottom: 12,
    backgroundColor: 'transparent',
    gap: 8,
  },
  promptsScrollContent: {
    gap: 8,
    paddingBottom: 4,
  },
  quickPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: '#D8DEC9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  quickPillPressed: {
    backgroundColor: '#EFF3E8',
    borderColor: '#B8F23E',
  },
  quickPillText: {
    fontSize: 12,
    color: '#121212',
    fontWeight: '500',
  },
  inputCapsule: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#D8DEC9',
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    fontSize: 14,
    lineHeight: 20,
    color: '#121212',
    paddingTop: Platform.OS === 'ios' ? 8 : 4,
    paddingBottom: Platform.OS === 'ios' ? 8 : 4,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  sendButtonActive: {
    backgroundColor: '#B8F23E',
  },
  sendButtonDisabled: {
    backgroundColor: '#EFF3E8',
  },
  sendButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});
