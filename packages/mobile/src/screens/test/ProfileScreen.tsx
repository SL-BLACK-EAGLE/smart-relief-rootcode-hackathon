import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/src/components/ThemedText';

export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-primary">
      <ThemedText type="title" className="mb-4">Profile Screen</ThemedText>
      <ThemedText>This is the profile test screen</ThemedText>
    </View>
  );
}
