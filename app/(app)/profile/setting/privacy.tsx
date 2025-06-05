import { px2hp, px2wp } from "@/utils/common";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Privacy() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TouchableOpacity
        style={styles.backContainer}
        onPress={() => {
          router.back();
        }}
      >
        <Ionicons name="arrow-back-outline" size={24} color="black" />
        <Text style={styles.backText}>{t("settings.privacyPolicy")}</Text>
      </TouchableOpacity>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.termsContainer}>
          <View style={styles.termSection}>
            <Text style={styles.termTitle}>{t("privacy.terms.title")}</Text>
            <Text style={styles.termText}>{t("privacy.terms.content1")}</Text>
            <Text style={styles.termText}>{t("privacy.terms.content2")}</Text>
          </View>
          <View style={styles.termSection}>
            <Text style={styles.termTitle}>{t("privacy.changes.title")}</Text>
            <Text style={styles.termText}>{t("privacy.changes.content1")}</Text>
            <Text style={styles.termText}>{t("privacy.changes.content2")}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  backContainer: {
    position: "relative",
    height: px2hp(44),
    width: "100%",
    paddingHorizontal: px2wp(16),
    justifyContent: "center",
  },
  backText: {
    position: "absolute",
    inset: 0,
    textAlign: "center",
    paddingVertical: px2hp(10),
    fontSize: 18,
    color: "#0C0A09",
    fontWeight: "700",
  },
  content: {
    flex: 1,
  },
  termsContainer: {
    paddingHorizontal: px2wp(16),
    paddingVertical: px2hp(20),
  },
  termSection: {
    marginBottom: px2hp(24),
  },
  termTitle: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.08,
    color: "#101010",
    fontFamily: "Inter",
    fontWeight: "700",
    marginBottom: px2hp(12),
  },
  termText: {
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.07,
    color: "#7F909F",
    fontFamily: "Inter",
    fontWeight: "600",
    marginBottom: px2hp(30),
  },
});
