import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  ColorValue,
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 240;
const IMAGE_WIDTH = width * 0.888; // 333/375
const IMAGE_HEIGHT = HEADER_HEIGHT * 1.085; // 260.54/240

interface HeaderProps {
  insetTop: number;
  bg: ImageSourcePropType;
  color: readonly [ColorValue, ColorValue];
  onPress?: (type: "share" | "collect") => void;
}

export default function Header({ insetTop, bg, color, onPress }: HeaderProps) {
  return (
    <>
      <LinearGradient
        colors={color}
        locations={[0, 1]}
        style={styles.gradient}
        start={{ x: 0, y: 0.1053 }}
        end={{ x: 0, y: 1 }}
      >
        <Image source={bg} style={styles.image} resizeMode="cover" />
      </LinearGradient>
      <View style={[styles.header, { top: insetTop }]}>
        <TouchableOpacity
          style={styles.backContainer}
          onPress={() => router.back()}
          activeOpacity={0.5}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.titleText}>Test Details</Text>
        <View style={styles.right}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => onPress?.("collect")}
          >
            <Image
              source={require("@/assets/images/test/collect.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => onPress?.("share")}
          >
            <Image
              source={require("@/assets/images/test/share.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    height: HEADER_HEIGHT,
    width: "100%",
    alignItems: "center",
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    marginTop: -HEADER_HEIGHT * 0.0856,
  },
  header: {
    flexDirection: "row",
    height: 44,
    width: "100%",
    position: "absolute",
    left: 0,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  backContainer: {
    height: 44,
    justifyContent: "center",
  },
  titleText: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingVertical: 10,
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  } as TextStyle,
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
