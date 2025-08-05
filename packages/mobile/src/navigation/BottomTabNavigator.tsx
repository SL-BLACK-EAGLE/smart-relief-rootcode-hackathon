import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { Colors } from '@/src/constants/Colors';
import { HapticTab } from '@/src/components/HapticTab';
import TabBarBackground from '@/src/components/ui/TabBarBackground';

// Test Screens
import HomeScreen from '@/src/screens/test/HomeScreen';
import ProfileScreen from '@/src/screens/test/ProfileScreen';
import NotificationsScreen from '@/src/screens/test/NotificationsScreen';
import SettingsScreen from '@/src/screens/test/SettingsScreen';
import DonationsScreen from '@/src/screens/test/DonationsScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: TabBarBackground,
        headerShown: true,
        tabBarButton: (props) => <HapticTab {...props} />,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Donations"
        component={DonationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
