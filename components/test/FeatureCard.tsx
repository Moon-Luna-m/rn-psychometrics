import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function FeatureCard() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image
          source={require("@/assets/images/test/emoj.png")}
          style={styles.icon}
        />
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>What is your personality type?</Text>
        <Text style={styles.subtitle}>
          Get your own personality tag and detailed analysis
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    alignItems: "center",
    gap: 16,
    shadowColor: "rgba(100, 100, 111, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 33,
    shadowOpacity: 1,
    elevation: 10,
  },
  header: {
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: "Outfit",
    fontWeight: "600",
    color: "#0C0A09",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Outfit",
    color: "#7F909F",
    textTransform: "uppercase",
    textAlign: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#FAFAF9",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 32,
    height: 32,
  },
  textContainer: {
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontFamily: "Outfit",
    fontWeight: "600",
    color: "#0C0A09",
    letterSpacing: 0.14,
    textAlign: "center",
  },
  description: {
    fontSize: 12,
    fontFamily: "Outfit",
    color: "#7F909F",
    textTransform: "capitalize",
    textAlign: "center",
  },
});
