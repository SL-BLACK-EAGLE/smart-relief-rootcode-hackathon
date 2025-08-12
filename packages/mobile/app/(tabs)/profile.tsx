import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-6">
                <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <View className="items-center mb-6">
                        <View className="w-28 h-28 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full items-center justify-center mb-4 shadow-lg">
                            <Text className="text-white text-4xl font-bold">JD</Text>
                        </View>
                        <Text className="text-2xl font-bold text-gray-900">John Doe</Text>
                        <Text className="text-gray-600">john.doe@example.com</Text>
                        <Text className="text-blue-500 font-medium mt-1">Premium Member</Text>
                    </View>

                    <TouchableOpacity className="bg-blue-500 rounded-xl p-4">
                        <Text className="text-white font-bold text-center">Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <Text className="text-xl font-bold text-gray-900 mb-4">📈 Activity Stats</Text>
                    <View className="flex-row justify-between">
                        <View className="items-center">
                            <Text className="text-3xl font-bold text-blue-500">142</Text>
                            <Text className="text-gray-600">Posts</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-3xl font-bold text-green-500">1.2k</Text>
                            <Text className="text-gray-600">Following</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-3xl font-bold text-purple-500">3.8k</Text>
                            <Text className="text-gray-600">Followers</Text>
                        </View>
                    </View>
                </View>

                <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <Text className="text-xl font-bold text-gray-900 mb-4">🏆 Achievements</Text>
                    <View className="space-y-3">
                        <View className="flex-row items-center">
                            <Text className="text-2xl mr-3">🎯</Text>
                            <View>
                                <Text className="font-semibold text-gray-900">Goal Achiever</Text>
                                <Text className="text-gray-600 text-sm">Completed 50 tasks this month</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center">
                            <Text className="text-2xl mr-3">⭐</Text>
                            <View>
                                <Text className="font-semibold text-gray-900">Top Contributor</Text>
                                <Text className="text-gray-600 text-sm">Most helpful community member</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="bg-white rounded-2xl p-6 shadow-sm">
                    <Text className="text-lg font-bold text-gray-900 mb-4">About Me</Text>
                    <Text className="text-gray-600 leading-6">
                        Passionate mobile developer with 5+ years of experience in React Native and Expo.
                        Love creating beautiful, performant apps that users enjoy. Always learning and sharing knowledge with the community.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}
