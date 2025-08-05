import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/src/components/ThemedText';

export default function DonationsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-primary">
      <ThemedText type="title" className="mb-4">Donations Screen</ThemedText>
      <ThemedText>This is the donations test screen</ThemedText>
    </View>
  );
}
