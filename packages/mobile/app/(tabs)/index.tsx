import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
    return (
        <ScrollView className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
            <View className="p-6">
                <View className="mb-8">
                    <Text className="text-4xl font-bold text-gray-900 mb-2">Welcome Back!</Text>
                    <Text className="text-lg text-gray-600">Ready to explore something new today?</Text>
                </View>

                <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                    <Text className="text-2xl font-bold text-blue-600 mb-4">📊 Today's Overview</Text>
                    <View className="flex-row justify-between mb-4">
                        <View className="items-center">
                            <Text className="text-3xl font-bold text-green-500">24</Text>
                            <Text className="text-gray-600">Completed</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-3xl font-bold text-orange-500">12</Text>
                            <Text className="text-gray-600">In Progress</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-3xl font-bold text-purple-500">8</Text>
                            <Text className="text-gray-600">Pending</Text>
                        </View>
                    </View>
                </View>

                <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                    <Text className="text-xl font-bold text-gray-900 mb-4">🚀 Quick Actions</Text>
                    <View className="space-y-3">
                        <TouchableOpacity className="bg-blue-500 rounded-xl p-4">
                            <Text className="text-white font-semibold text-center">Start New Project</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-green-500 rounded-xl p-4">
                            <Text className="text-white font-semibold text-center">View Analytics</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl p-6 shadow-lg">
                    <Text className="text-white text-xl font-bold mb-2">✨ Featured</Text>
                    <Text className="text-white opacity-90">
                        Discover amazing features and boost your productivity with our latest updates.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}
