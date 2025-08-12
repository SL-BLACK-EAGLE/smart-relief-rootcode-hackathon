import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as SplashScreen from 'expo-splash-screen';

interface VideoSplashScreenProps {
    onFinish: () => void;
}

const { width, height } = Dimensions.get('window');

export default function VideoSplashScreen({ onFinish }: VideoSplashScreenProps) {
    const video = useRef<Video>(null);

    useEffect(() => {
        // Hide the default splash screen when component mounts
        SplashScreen.hideAsync();
    }, []);

    const handlePlaybackStatusUpdate = (status: any) => {
        if (status.didJustFinish) {
            onFinish();
        }
    };

    return (
        <View style={styles.container}>
            <Video
                ref={video}
                style={styles.video}
                source={require('../assets/videos/splashscreen_animation.mp4')}
                shouldPlay
                isLooping={false}
                resizeMode={ResizeMode.COVER}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width,
        height,
    },
});
