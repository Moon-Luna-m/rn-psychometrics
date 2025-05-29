import { px2hp, px2wp } from "@/utils/common";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifySuccessScreen() {
  const { t } = useTranslation();
  const { params } = useLocalSearchParams<{ params: string }>();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/login/bg.png")}
        style={styles.bg}
        resizeMode="cover"
      />
      <SafeAreaView style={styles.content}>
        <TouchableOpacity
          style={styles.backContainer}
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.mainContainer}>
          <Image
            source={
              params === "register"
                ? require("@/assets/images/login/success.png")
                : require("@/assets/images/login/password.png")
            }
            style={styles.successImage}
          />
          <Text style={styles.title}>
            {params === "register"
              ? t("form.verify.success")
              : t("form.verify.password")}
          </Text>
          <Text style={styles.subtitle}>
            {t("form.verify.successSubtitle")}
          </Text>
          <Button
            mode="contained"
            onPress={() => {
              router.replace("/user/signIn");
            }}
            style={[styles.submitButton]}
            contentStyle={styles.submitButtonContent}
            labelStyle={styles.submitButtonText}
          >
            {t("form.verify.successButton")}
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#F5F7FA",
  },
  bg: {
    width: "100%",
    height: "auto",
    aspectRatio: 1,
    position: "absolute",
    top: 0,
    left: 0,
  },
  backContainer: {
    height: px2hp(44),
    width: "100%",
    paddingHorizontal: px2wp(16),
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  mainContainer: {
    paddingTop: px2hp(24),
    paddingHorizontal: px2wp(24),
    alignItems: "center",
  },
  title: {
    marginTop: px2hp(20),
    fontSize: 24,
    fontWeight: "600",
    color: "#282828",
  },
  subtitle: {
    marginTop: px2hp(8),
    fontSize: 12,
    fontWeight: "400",
    color: "#B7B7B7",
  },
  successImage: {
    width: px2wp(100),
    height: px2wp(100),
  },
  submitButton: {
    marginTop: px2hp(24),
    borderRadius: px2hp(78),
    backgroundColor: "#19DBF2",
    width: "100%",
  },
  submitButtonContent: {
    height: px2hp(56),
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
    color: "#FFFFFF",
    fontFamily: "Outfit",
  },
});
