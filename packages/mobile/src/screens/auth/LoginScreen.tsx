import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/src/components/ThemedText';
import { useDispatch } from 'react-redux';
import { login } from '@/src/store/slices/auth.slice';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogin = () => {
    dispatch(login({ id: '1', username: 'testuser' }));
  };

  const handleTestNavigation = () => {
    // @ts-ignore - Type safety bypassed for testing
    navigation.navigate('TestTabs');
  };

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-primary p-4">
      <ThemedText type="title" className="mb-8">Login Screen</ThemedText>
      
      <TouchableOpacity 
        onPress={handleLogin}
        className="bg-accent py-3 px-6 rounded-lg mb-4 w-full"
      >
        <ThemedText className="text-center text-white">Login</ThemedText>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={handleTestNavigation}
        className="bg-light-200 py-3 px-6 rounded-lg w-full"
      >
        <ThemedText className="text-center">Try Bottom Tabs</ThemedText>
      </TouchableOpacity>
    </View>
  );
}
