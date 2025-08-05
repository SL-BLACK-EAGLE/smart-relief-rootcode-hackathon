import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import BottomTabNavigator from './BottomTabNavigator';

// For future auth screens
import LoginScreen from '@/src/screens/auth/LoginScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={BottomTabNavigator} />
      ) : (
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="TestTabs" component={BottomTabNavigator} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
