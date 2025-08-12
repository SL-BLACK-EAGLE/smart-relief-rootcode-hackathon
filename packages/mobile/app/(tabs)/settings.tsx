import { View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function SettingsScreen() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [location, setLocation] = useState(false);
    const [autoSync, setAutoSync] = useState(true);

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-6">
                <Text className="text-3xl font-bold text-gray-900 mb-6">⚙️ Settings</Text>

                <View className="bg-white rounded-2xl shadow-sm mb-6">
                    <Text className="text-lg font-bold text-gray-900 p-6 pb-2">🔔 Notifications</Text>

                    <View className="px-6 py-4 border-b border-gray-100">
                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="text-lg font-medium text-gray-900">Push Notifications</Text>
                                <Text className="text-gray-500 text-sm">Receive updates and alerts</Text>
                            </View>
                            <Switch
                                value={notifications}
                                onValueChange={setNotifications}
                                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                                thumbColor={notifications ? '#ffffff' : '#f3f4f6'}
                            />
                        </View>
                    </View>

                    <View className="px-6 py-4">
                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="text-lg font-medium text-gray-900">Auto Sync</Text>
                                <Text className="text-gray-500 text-sm">Automatically sync your data</Text>
                            </View>
                            <Switch
                                value={autoSync}
                                onValueChange={setAutoSync}
                                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                                thumbColor={autoSync ? '#ffffff' : '#f3f4f6'}
                            />
                        </View>
                    </View>
                </View>

                <View className="bg-white rounded-2xl shadow-sm mb-6">
                    <Text className="text-lg font-bold text-gray-900 p-6 pb-2">🎨 Appearance</Text>

                    <View className="px-6 py-4 border-b border-gray-100">
                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="text-lg font-medium text-gray-900">Dark Mode</Text>
                                <Text className="text-gray-500 text-sm">Switch to dark theme</Text>
                            </View>
                            <Switch
                                value={darkMode}
                                onValueChange={setDarkMode}
                                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                                thumbColor={darkMode ? '#ffffff' : '#f3f4f6'}
                            />
                        </View>
                    </View>

                    <View className="px-6 py-4">
                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="text-lg font-medium text-gray-900">Location Services</Text>
                                <Text className="text-gray-500 text-sm">Allow location access</Text>
                            </View>
                            <Switch
                                value={location}
                                onValueChange={setLocation}
                                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                                thumbColor={location ? '#ffffff' : '#f3f4f6'}
                            />
                        </View>
                    </View>
                </View>

                <View className="bg-white rounded-2xl shadow-sm mb-6">
                    <Text className="text-lg font-bold text-gray-900 p-6 pb-2">👤 Account</Text>

                    <TouchableOpacity className="px-6 py-4 border-b border-gray-100">
                        <Text className="text-blue-600 font-medium">Edit Profile Information</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="px-6 py-4 border-b border-gray-100">
                        <Text className="text-blue-600 font-medium">Privacy & Security</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="px-6 py-4">
                        <Text className="text-blue-600 font-medium">Subscription Management</Text>
                    </TouchableOpacity>
                </View>

                <View className="bg-white rounded-2xl shadow-sm mb-6">
                    <Text className="text-lg font-bold text-gray-900 p-6 pb-2">💬 Support</Text>

                    <TouchableOpacity className="px-6 py-4 border-b border-gray-100">
                        <Text className="text-blue-600 font-medium">Help Center</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="px-6 py-4 border-b border-gray-100">
                        <Text className="text-blue-600 font-medium">Contact Support</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="px-6 py-4">
                        <Text className="text-blue-600 font-medium">Report a Bug</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity className="bg-red-500 rounded-2xl p-4">
                    <Text className="text-white font-bold text-center text-lg">Sign Out</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
