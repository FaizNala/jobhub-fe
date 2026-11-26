import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Heading, Label } from '@/components/atoms/typography';
import { CandidateAvatar } from '@/components/atoms/candidate-avatar';

interface ExploreHeaderProps {
  candidateName?: string;
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function ExploreHeader({
  candidateName = 'Candidate',
}: ExploreHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.userRow}>
        <CandidateAvatar size={44} name={candidateName} />

        <View style={styles.userInfo}>
          <Label style={styles.greetingText}>{getTimeGreeting()}</Label>
          <Heading style={styles.userName} numberOfLines={1}>
            {candidateName}
          </Heading>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userInfo: {
    flex: 1,
    gap: 1,
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
  },
});
