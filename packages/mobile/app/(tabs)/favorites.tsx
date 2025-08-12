import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function FavoritesScreen() {
    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-6">
                <Text className="text-3xl font-bold text-gray-900 mb-6">❤️ Favorites</Text>

                <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <Text className="text-xl font-bold text-gray-900 mb-4">📊 Your Stats</Text>
                    <View className="flex-row justify-between">
                        <View className="items-center">
                            <Text className="text-2xl font-bold text-red-500">23</Text>
                            <Text className="text-gray-600 text-sm">Liked</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-2xl font-bold text-blue-500">15</Text>
                            <Text className="text-gray-600 text-sm">Saved</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-2xl font-bold text-green-500">8</Text>
                            <Text className="text-gray-600 text-sm">Shared</Text>
                        </View>
                    </View>
                </View>

                <Text className="text-xl font-bold text-gray-900 mb-4">💖 Recent Favorites</Text>

                <View className="space-y-4">
                    <TouchableOpacity className="bg-white rounded-2xl p-5 shadow-sm">
                        <View className="flex-row justify-between items-start mb-3">
                            <Text className="text-lg font-bold text-gray-900 flex-1">Amazing UI Design Tips</Text>
                            <Text className="text-red-500 text-xl">❤️</Text>
                        </View>
                        <Text className="text-gray-600 mb-2">Learn the fundamentals of modern UI design</Text>
                        <Text className="text-sm text-gray-400">Saved 2 days ago</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-white rounded-2xl p-5 shadow-sm">
                        <View className="flex-row justify-between items-start mb-3">
                            <Text className="text-lg font-bold text-gray-900 flex-1">React Native Best Practices</Text>
                            <Text className="text-red-500 text-xl">❤️</Text>
                        </View>
                        <Text className="text-gray-600 mb-2">Advanced techniques for mobile development</Text>
                        <Text className="text-sm text-gray-400">Saved 1 week ago</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-white rounded-2xl p-5 shadow-sm">
                        <View className="flex-row justify-between items-start mb-3">
                            <Text className="text-lg font-bold text-gray-900 flex-1">Tailwind CSS Guide</Text>
                            <Text className="text-red-500 text-xl">❤️</Text>
                        </View>
                        <Text className="text-gray-600 mb-2">Complete styling solution for modern apps</Text>
                        <Text className="text-sm text-gray-400">Saved 2 weeks ago</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity className="bg-blue-500 rounded-2xl p-4 mt-6">
                    <Text className="text-white font-bold text-center text-lg">View All Favorites</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
