import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';

export default function DiscoverScreen() {
    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-6">
                <Text className="text-3xl font-bold text-gray-900 mb-6">🔍 Discover</Text>

                <View className="mb-6">
                    <TextInput
                        placeholder="Search trending topics..."
                        className="bg-white border-2 border-gray-200 rounded-2xl px-6 py-4 text-gray-900 shadow-sm"
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                <Text className="text-xl font-bold text-gray-900 mb-4">🔥 Trending Now</Text>
                <View className="space-y-4 mb-6">
                    <TouchableOpacity className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <View className="flex-row items-center mb-3">
                            <Text className="text-2xl mr-3">🚀</Text>
                            <Text className="text-lg font-bold text-red-500">#Technology</Text>
                        </View>
                        <Text className="text-gray-700 mb-2">Latest breakthroughs in AI and machine learning</Text>
                        <Text className="text-sm text-gray-500">152.3k discussions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <View className="flex-row items-center mb-3">
                            <Text className="text-2xl mr-3">🌱</Text>
                            <Text className="text-lg font-bold text-green-500">#Sustainability</Text>
                        </View>
                        <Text className="text-gray-700 mb-2">Eco-friendly solutions for a better future</Text>
                        <Text className="text-sm text-gray-500">89.7k discussions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <View className="flex-row items-center mb-3">
                            <Text className="text-2xl mr-3">🎨</Text>
                            <Text className="text-lg font-bold text-purple-500">#Design</Text>
                        </View>
                        <Text className="text-gray-700 mb-2">Creative inspiration and modern aesthetics</Text>
                        <Text className="text-sm text-gray-500">67.2k discussions</Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-xl font-bold text-gray-900 mb-4">📱 Categories</Text>
                <View className="flex-row flex-wrap gap-3">
                    {['Tech', 'Design', 'Business', 'Health', 'Travel', 'Food'].map((category) => (
                        <TouchableOpacity key={category} className="bg-blue-100 rounded-full px-6 py-3">
                            <Text className="text-blue-700 font-semibold">{category}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
