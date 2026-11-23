import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

interface TypographyProps extends TextProps {
  children: React.ReactNode;
  color?: string;
}

export function Display({ children, style, color, ...props }: TypographyProps) {
  return (
    <Text style={[styles.display, color ? { color } : undefined, style]} {...props}>
      {children}
    </Text>
  );
}

export function Title({ children, style, color, ...props }: TypographyProps) {
  return (
    <Text style={[styles.title, color ? { color } : undefined, style]} {...props}>
      {children}
    </Text>
  );
}

export function Heading({ children, style, color, ...props }: TypographyProps) {
  return (
    <Text style={[styles.heading, color ? { color } : undefined, style]} {...props}>
      {children}
    </Text>
  );
}

export function Body({ children, style, color, ...props }: TypographyProps) {
  return (
    <Text style={[styles.body, color ? { color } : undefined, style]} {...props}>
      {children}
    </Text>
  );
}

export function Caption({ children, style, color, ...props }: TypographyProps) {
  return (
    <Text style={[styles.caption, color ? { color } : undefined, style]} {...props}>
      {children}
    </Text>
  );
}

export function Label({ children, style, color, ...props }: TypographyProps) {
  return (
    <Text style={[styles.label, color ? { color } : undefined, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  display: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 36,
    color: Colors.light.text,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 28,
    color: Colors.light.text,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 24,
    color: Colors.light.text,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: Colors.light.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    color: Colors.light.textSecondary,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    color: Colors.light.text,
  },
});
