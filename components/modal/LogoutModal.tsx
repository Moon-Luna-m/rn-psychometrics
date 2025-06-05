import { BottomSheet } from "@/components/ui/BottomSheet";
import { px2hp, px2wp } from "@/utils/common";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({
  visible,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  const { t } = useTranslation();

  return (
    <BottomSheet visible={visible} onClose={onClose} initialY={500}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.handle} />
          <View style={styles.body}>
            <Image
              source={require("@/assets/images/setting/logout.png")}
              style={styles.image}
              resizeMode="contain"
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{t("settings.logout.title")}</Text>
              <Text style={styles.description}>
                {t("settings.logout.description")}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttons}>
          <Button
            mode="outlined"
            style={styles.button}
            labelStyle={styles.buttonText}
            contentStyle={styles.buttonContent}
            onPress={onClose}
            textColor="#19DBF2"
            rippleColor="rgba(0, 0, 0, 0.03)"
          >
            {t("settings.logout.cancel")}
          </Button>
          <Button
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonText}
            contentStyle={styles.buttonContent}
            onPress={onConfirm}
            buttonColor="#19DBF2"
            textColor="#FFFFFF"
          >
            {t("settings.logout.confirm")}
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: px2hp(24),
    paddingHorizontal: px2wp(16),
    paddingBottom: px2hp(8),
  },
  content: {
    alignItems: "center",
    gap: px2hp(16),
  },
  handle: {
    width: px2wp(48),
    height: px2hp(5),
    backgroundColor: "#F3F4F6",
    borderRadius: px2wp(50),
  },
  body: {
    alignItems: "center",
    gap: px2hp(32),
  },
  image: {
    width: px2wp(100),
    height: px2wp(100),
  },
  textContainer: {
    alignItems: "center",
    gap: px2hp(8),
  },
  title: {
    fontFamily: "Outfit",
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.08,
    color: "#0C0A09",
    fontWeight: "700",
  },
  description: {
    fontFamily: "Outfit",
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.07,
    color: "#48484A",
    textAlign: "center",
    width: px2wp(279),
  },
  buttons: {
    flexDirection: "row",
    gap: px2wp(12),
  },
  button: {
    flex: 1,
    borderRadius: px2wp(78),
    borderColor: "#19DBF2",
  },
  buttonContent: {
    height: px2hp(48),
  },
  buttonText: {
    fontFamily: "Outfit",
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
