import React, { useMemo } from "react";
import {
    View,
    Text,
    Image,
    ImageBackground,
    Pressable,
    ScrollView,
    SafeAreaView,
    Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const A = {
    topWave:  require("../../assets/images/donation_type_top_bg.png"),
    back:     require("../../assets/icons/Chevron_Left.png"),
    resImg:   require("../../assets/icons/People holding a charity box.png"),
    svcImg:   require("../../assets/icons/Girl donates money to  man.png"),
    moneyImg: require("../../assets/icons/Donating money to a cause with coin box.png"),
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/** Optional nudges if you want to fine-tune position/scale */
const TOP_TUNE = { scale: 1.0, dx: 0, dy: 0 }; // change if you need micro adjustments

export default function UserType() {
    const router = useRouter();

    // Compute a “cover-width” header height from the image’s real aspect ratio
    const sizes = useMemo(() => {
        const src = Image.resolveAssetSource(A.topWave);
        const aspect = src.width / src.height; // w/h
        const topWidth = SCREEN_WIDTH * TOP_TUNE.scale;
        const topHeight = topWidth / aspect;

        return {
            topWidth,
            topHeight,
            topDx: TOP_TUNE.dx,
            topDy: TOP_TUNE.dy,
        };
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-[#E8F5FB]">
            {/* HEADER WRAPPER: gives layout height for an absolutely-positioned image */}
            <View className="w-full" style={{ height: sizes.topHeight }}>
                {/* Top wave image — absolutely anchored to RIGHT and TOP */}
                <Image
                    source={A.topWave}
                    resizeMode="cover"
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 0,                   // <- right-anchored like Figma
                        width: sizes.topWidth,
                        height: sizes.topHeight,
                        transform: [
                            { translateX: sizes.topDx },
                            { translateY: sizes.topDy },
                        ],
                        borderBottomLeftRadius: 28,
                        borderBottomRightRadius: 28,
                        overflow: "hidden",
                    }}
                />

                {/* Back chevron */}
                <Pressable
                    onPress={() => router.back()}
                    className="absolute left-4 top-4 h-10 w-10 items-center justify-center"
                    hitSlop={10}
                >
                    <Image source={A.back} style={{ width: 22, height: 22, tintColor: "#FFFFFF" }} />
                </Pressable>

                {/* Title centered over the wave */}
                <View className="absolute inset-0 items-center justify-center">
                    <Text className="text-white text-[18px] font-semibold">Donation Type</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 140 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Subtitle */}
                <Text className="text-[16px] text-[#1B1E28] mt-6 text-center">
                    Select type of your donation
                </Text>

                {/* Cards */}
                <View className="mt-6 items-center space-y-10">
                    <DonateCard
                        colors={["#FF6C51", "#FF7E1F"]}
                        image={A.resImg}
                        title="Donate Resource"
                    />
                    <DonateCard
                        colors={["#6E66F7", "#1C8DFE"]}
                        image={A.svcImg}
                        title="Donate Service"
                    />
                    <DonateCard
                        colors={["#13D39D", "#09B67F"]}
                        image={A.moneyImg}
                        title="Donate Monitary"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

/* ---------- Card component (square, soft shadow like Figma) ---------- */
const CARD = 178;   // set to your exact Figma size if different
const RADIUS = 18;

function DonateCard({
                        colors,
                        image,
                        title,
                        onPress,
                    }: {
    colors: string[];
    image: any;
    title: string;
    onPress?: () => void;
}) {
    return (
        <Pressable onPress={onPress} className="active:opacity-90">
            <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="items-center justify-center"
                style={{
                    width: CARD,
                    height: CARD,
                    borderRadius: RADIUS,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.18,
                    shadowRadius: 10,
                    elevation: 10,
                }}
            >
                <Image
                    source={image}
                    resizeMode="contain"
                    style={{ width: 116, height: 98 }}
                />
                <Text className="text-white font-semibold mt-3">{title}</Text>
            </LinearGradient>
        </Pressable>
    );
}
