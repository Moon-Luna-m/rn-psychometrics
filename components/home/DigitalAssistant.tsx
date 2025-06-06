import { px2hp, px2wp } from "@/utils/common";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DigitalAssistant() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* 数字人头像 */}
      <Image
        source={require("@/assets/images/home/digital-human.png")}
        style={styles.avatar}
        resizeMode="cover"
      />
      <View style={[styles.robotIconContainer, { top: insets.top +20 }]}>
        <Image
          source={require("@/assets/images/home/robot.png")}
          style={styles.robotIcon}
          resizeMode="contain"
        />
      </View>

      {/* 文字内容 */}
      <View style={styles.content}>
        <View>
          <Text style={styles.greeting}>{t('home.digitalAssistant.greeting')}</Text>
          <Text style={styles.question}>{t('home.digitalAssistant.question')}</Text>
        </View>

        <View style={styles.askButtonWrapper}>
          <Pressable>
            <LinearGradient
              colors={["#64FFFA", "#F59EFF"]}
              start={{ x: 0.03, y: 0.29 }}
              end={{ x: 0.91, y: 0.84 }}
              style={styles.gradient}
            >
              <Text style={styles.buttonText}>{t('home.digitalAssistant.askButton')}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: px2wp(375),
    height: px2hp(260),
    position: "relative",
  },
  avatar: {
    width: px2wp(200),
    height: px2hp(200),
    position: "absolute",
    right: px2wp(0),
    bottom: px2hp(0),
  },
  content: {
    position: "absolute",
    left: px2wp(20),
    bottom: px2hp(40),
    gap: px2hp(14),
  },
  greeting: {
    fontFamily: "Outfit",
    fontSize: px2hp(12),
    color: "#7F909F",
    marginBottom: px2hp(6),
  },
  question: {
    fontFamily: "Outfit",
    fontSize: px2hp(16),
    fontWeight: "700",
    color: "#0C0A09",
  },
  askButtonWrapper: {
    marginTop: px2hp(8),
    alignSelf: 'flex-start',
  },
  gradient: {
    paddingHorizontal: px2wp(24),
    paddingVertical: px2hp(8),
    borderRadius: px2hp(40),
  },
  buttonText: {
    fontFamily: "Outfit",
    fontSize: px2hp(14),
    fontWeight: "600",
    color: "#0C0A09",
  },
  robotIconContainer: {
    position: "absolute",
    left: px2wp(20),
    width: px2wp(36),
    height: px2wp(36),
    backgroundColor: "#FFFFFF",
    borderRadius: px2wp(33),
    justifyContent: "center",
    alignItems: "center",
  },
  robotIcon: {
    width: px2wp(28),
    height: px2wp(28),
  },
});
