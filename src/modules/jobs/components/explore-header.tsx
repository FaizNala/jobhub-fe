import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Heading, Label } from '@/components/atoms/typography';
import { CandidateAvatar } from '@/components/atoms/candidate-avatar';
import { Radius } from '@/constants/theme';

interface ExploreHeaderProps {
  candidateName?: string;
  candidateRole?: string;
}

export function ExploreHeader({
  candidateName = 'Michel Clark',
  candidateRole = 'Software Engineer',
}: ExploreHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.userRow}>
        <CandidateAvatar size={42} />

        <View style={styles.userInfo}>
          <Label style={styles.greetingText}>Good morning</Label>
          <Heading style={styles.userName}>{candidateName}</Heading>
        </View>

        <View style={styles.statusPill}>
          <View style={styles.pulseDot} />
          <Label style={styles.statusText}>Actively Looking</Label>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userInfo: {
    flex: 1,
  },
  greetingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5A5D54',
    letterSpacing: 0.1,
  },
  userName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: -0.4,
    marginTop: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F4F7EE',
    borderWidth: 1,
    borderColor: '#E2E8D8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#274E13',
    letterSpacing: 0.2,
  },
});
