import React, { useMemo, useState } from "react";
import {
    Dimensions,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    View,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity, SafeAreaView,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import { useRouter } from 'expo-router';

const topBg = require("../../assets/images/top_bg.png");
const bottomBg = require("../../assets/images/bottom_bg.png");

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/** Figma frame used for the top artwork */
const TOP_FIGMA = { w: 439.7, h: 575.5 };


const TOP_TUNE = { scale: 1.05, dx: 14, dy: 50 }; // <- tweak here if needed

export default function SignIn() {
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const router = useRouter();

    const sizes = useMemo(() => {
        // Base scale from Figma width to device width
        const base = SCREEN_WIDTH / TOP_FIGMA.w;
        const s = base * TOP_TUNE.scale;

        const topWidth = SCREEN_WIDTH * TOP_TUNE.scale;
        const topHeight = TOP_FIGMA.h * s;

        // Use the real bottom image ratio so it never stretches
        const bSrc = Image.resolveAssetSource(bottomBg);
        const bottomHeight = SCREEN_WIDTH / (bSrc.width / bSrc.height);

        return {
            topWidth,
            topHeight,
            topDx: TOP_TUNE.dx * base,
            topDy: TOP_TUNE.dy * base,
            bottomHeight,
        };
    }, []);

    // Positions the content inside the white area like in Figma
    const CONTENT_TOP_INSET = sizes.topHeight * 0.40;

    return (
        <SafeAreaView className="flex-1 bg-[#EBF8FF}">
            <StatusBar barStyle="dark-content" />

            {/* === TOP BG (right-anchored, exact ratio, tuned) === */}
            <Image
                source={topBg}
                resizeMode="cover"
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0, // anchor to RIGHT like the Figma composition
                    width: sizes.topWidth,
                    height: sizes.topHeight,
                    transform: [
                        { translateX: sizes.topDx }, // fine-tune horizontal
                        { translateY: sizes.topDy }, // fine-tune vertical
                    ],
                }}
            />

            {/* === BOTTOM BG (already perfect) === */}
            <ImageBackground
                source={bottomBg}
                resizeMode="contain"
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: SCREEN_WIDTH,
                    height: sizes.bottomHeight,
                }}
            >
                <View className="flex-1 items-center justify-end pb-4 mb-4">
                    <View className="flex-row items-center">
                        <Text className="text-[14px] text-white">
                            Don't have an account?{" "}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/SignUp')}>
                            <Text className="text-[14px] font-extrabold text-white">
                                Register Now
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.select({ ios: "padding", android: undefined })}
            >
                <View className="flex-1 px-6" style={{ paddingTop: CONTENT_TOP_INSET }}>
                    {/* Header */}
                    <View className="items-center">
                        <Text className="text-4xl  tracking-wide text-black font-manuale-medium" >
                            HELLO
                        </Text>
                        <Text className="mt-2 text-2xl text-black font-manuale-medium">
                            Sign into your Account
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="mt-20 space-y-6">
                        {/* Mobile */}
                        <View className={' ml-4' } style={{ width: 320}}>
                            <Text className="mb-2 text-[16px] font-manuale-semibold text-black font-semibold">Mobile</Text>
                            <View className="rounded-xl border border-[#3C8FEF] bg-white shadow-sm" style={{ width: 320, height: 45 }}>
                                <TextInput
                                    placeholder="Enter Your Mobile"
                                    placeholderTextColor="#6D6E6E"
                                    keyboardType="phone-pad"
                                    value={mobile}
                                    onChangeText={setMobile}
                                    className="px-4 py-3 text-[14px] font-poppins-regular text-black flex-1"
                                />
                            </View>
                        </View>

                        {/* Password */}
                        <View className={'mt-8 ml-4' } style={{ width: 320}}>
                            <Text className="mb-2  text-[16px] font-manuale-semibold text-black font-semibold">Password</Text>
                            <View className="flex-row items-center rounded-xl border border-[#3C8FEF] bg-white shadow-sm" style={{ width: 320, height: 45 }}>
                                <TextInput
                                    placeholder="Enter Your Password"
                                    placeholderTextColor="#6D6E6E"
                                    secureTextEntry={!show}
                                    value={password}
                                    onChangeText={setPassword}
                                    className="flex-1 px-4 text-[14px] text-black font-poppins-regular"
                                />
                                <TouchableOpacity
                                    onPress={() => setShow((s) => !s)}
                                    accessibilityLabel={show ? "Hide password" : "Show password"}
                                    className="px-4"
                                >
                                    <Ionicons
                                        name={show ? "eye" : "eye-off"}
                                        size={22}
                                        color="#1A1A1A"
                                    />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity className="self-end mt-1" onPress={() => router.push('/(auth)/ForgotPassword')}>
                                <Text className="text-[14px] text-[#3C8FEF] font-manuale-regular">
                                    Forgot your Password?
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Space so the button clears the bottom wave, matching Figma */}
                    <View style={{ height: sizes.bottomHeight * 0.52 }} />

                    {/* Login button */}
                    <TouchableOpacity className="self-center" onPress={()=> router.push('/')}>
                        <View className="w-[191px] h-[45px] rounded-full bg-[#3072bf] items-center justify-center">
                            <Text className="text-white text-[16px] font-semibold">Login</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

