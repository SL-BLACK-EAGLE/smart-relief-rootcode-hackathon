import React from "react";
import {TouchableOpacity, View} from "react-native";
import { ThemedText } from "@/src/components/ThemedText";

import { useRouter } from "expo-router";


export default function Index() {
    const router = useRouter();
    
    const navigateToMainApp = () => {
        // This will be handled by the AppNavigator 
        // This is just a placeholder since we're using direct navigation
    };
    
    return (
        <View className="flex-1 items-center justify-center bg-white dark:bg-primary">
            <ThemedText className="text-5xl text-accent font-bold mb-8">Smart Relief</ThemedText>
            <ThemedText className="mb-8 text-center px-4">
                Welcome to Smart Relief. The navigation setup is working with React Navigation.
            </ThemedText>
            
            <TouchableOpacity 
                className="bg-accent py-4 px-8 rounded-lg"
                onPress={navigateToMainApp}
            >
                <ThemedText className="text-white text-center">Continue to App</ThemedText>
            </TouchableOpacity>
        </View>
    );
}
