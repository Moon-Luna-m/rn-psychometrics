import LogoutModal from "@/components/modal/LogoutModal";
import { showNotification } from "@/store/slices/notificationSlice";
import { logout } from "@/store/slices/userSlice";
import { clearCache, getCacheSize, px2hp, px2wp } from "@/utils/common";
import i18n, { LANGUAGES } from "@/utils/i18n";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

interface SettingItemProps {
  title: string;
  hint?: string;
  onPress: () => void;
}

const SettingItem = ({ title, hint, onPress }: SettingItemProps) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      style={styles.settingItem}
      activeOpacity={0.5}
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        <Text style={styles.settingText}>{t(title)}</Text>
      </View>
      <View style={styles.settingRight}>
        {hint && <Text style={styles.settingHint}>{hint}</Text>}
        <AntDesign name="right" size={12} color="#333333" />
      </View>
    </TouchableOpacity>
  );
};

const SettingCard = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.settingsCard}>{children}</View>
);

export default function Setting() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [cacheSize, setCacheSize] = useState<string>("0.00M");
  const dispatch = useDispatch();

  const handleLogout = useCallback(() => {
    setLogoutVisible(true);
  }, []);

  const handleLogoutConfirm = useCallback(() => {
    setLogoutVisible(false);
    // TODO: 处理退出登录逻辑
    dispatch(logout());
  }, []);

  const handleLogoutCancel = useCallback(() => {
    setLogoutVisible(false);
  }, []);

  const getCacheLocalCache = useCallback(async () => {
    const size = await getCacheSize();
    setCacheSize(size);
  }, []);

  const handleSettingPress = useCallback(async (type: string) => {
    // 处理各种设置项点击
    switch (type) {
      case "account":
        // 处理账号设置
        break;
      case "customer_service":
        router.push("/profile/setting/privacy");
        // 处理客服联系
        break;
      case "agreement":
        // 处理用户协议
        router.push("/profile/setting/privacy");
        break;
      case "privacy":
        // 处理隐私政策
        router.push("/profile/setting/privacy");
        break;
      case "disclaimer":
        // 处理免责声明
        router.push("/profile/setting/privacy");
        break;
      case "language":
        // 处理语言切换
        router.push("/profile/setting/languages");
        break;
      case "update":
        // 处理检查更新
        break;
      case "cache":
        // 处理清除缓存
        const isSuccess = await clearCache();
        if (isSuccess) {
          dispatch(
            showNotification({
              message: t("settings.clearCacheSuccess"),
              type: "default",
            })
          );
          getCacheLocalCache();
        } else {
          dispatch(
            showNotification({
              message: t("settings.clearCacheFailed"),
              type: "error",
            })
          );
        }
        break;
    }
  }, []);

  useEffect(() => {
    getCacheLocalCache();
  }, []);

  const settingGroups = useMemo(
    () => [
      {
        items: [
          //   { type: "account", title: "settings.account" },
          { type: "customer_service", title: "settings.customerService" },
          { type: "agreement", title: "settings.userAgreement" },
          { type: "privacy", title: "settings.privacyPolicy" },
          { type: "disclaimer", title: "settings.disclaimer" },
        ],
      },
      {
        items: [
          {
            type: "language",
            title: "settings.language",
            hint: LANGUAGES[i18n.language].label,
          },
          { type: "update", title: "settings.checkUpdate" },
          { type: "cache", title: "settings.clearCache", hint: cacheSize },
        ],
      },
    ],
    [i18n.language, cacheSize]
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#ABF1FF", "#F5F7FA"]} style={styles.gradient} />
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backContainer}
          onPress={() => router.back()}
          activeOpacity={0.5}
        >
          <Ionicons name="arrow-back-outline" size={24} color="black" />
          <Text style={styles.backText}>{t("settings.title")}</Text>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <View style={styles.logoTextContainer}>
              <Text style={styles.logoText}>{Constants.expoConfig?.name}</Text>
              <Text style={styles.versionText}>
                v{Constants.expoConfig?.version}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.settingsContainer}>
          {settingGroups.map((group, groupIndex) => (
            <SettingCard key={groupIndex}>
              {group.items.map((item) => (
                <SettingItem
                  key={item.type}
                  title={item.title}
                  hint={item.hint}
                  onPress={() => handleSettingPress(item.type)}
                />
              ))}
            </SettingCard>
          ))}

          <Button
            mode="contained"
            style={styles.logoutButton}
            labelStyle={styles.logoutText}
            contentStyle={styles.logoutButtonContent}
            onPress={handleLogout}
            buttonColor="#FFFFFF"
            textColor="#EB5735"
            rippleColor="rgba(0, 0, 0, 0.03)"
          >
            {t("settings.logout.button")}
          </Button>
        </View>
      </View>

      <LogoutModal
        visible={logoutVisible}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  gradient: {
    position: "absolute",
    width: px2wp(375),
    height: px2hp(375),
    left: 0,
    top: 0,
  },
  content: {
    flex: 1,
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
  logoContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: px2hp(40),
  },
  logoWrapper: {
    alignItems: "center",
    gap: px2hp(8),
  },
  logoImage: {
    width: px2wp(80),
    height: px2wp(80),
  },
  logoTextContainer: {
    alignItems: "center",
    gap: px2hp(4),
  },
  logoText: {
    fontFamily: "Outfit",
    fontSize: 16,
    lineHeight: 20,
    color: "#0C0A09",
    fontWeight: "700",
  },
  versionText: {
    fontFamily: "Outfit",
    fontSize: 14,
    lineHeight: 18,
    color: "#7F909F",
  },
  settingsContainer: {
    paddingHorizontal: px2wp(16),
    marginTop: px2hp(20),
    gap: px2hp(20),
  },
  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: px2wp(20),
    padding: px2wp(16),
    gap: px2hp(16),
  },
  settingItem: {
    height: px2hp(24),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: px2wp(12),
  },
  settingText: {
    fontFamily: "Outfit",
    fontSize: 14,
    lineHeight: 18,
    color: "#0C0A09",
    fontWeight: "500",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: px2wp(4),
  },
  settingHint: {
    fontFamily: "Outfit",
    fontSize: 12,
    lineHeight: 15,
    color: "rgba(12, 10, 9, 0.16)",
    fontWeight: "500",
  },
  logoutButton: {
    borderRadius: px2wp(78),
  },
  logoutButtonContent: {
    height: px2hp(52),
  },
  logoutText: {
    fontFamily: "Outfit",
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
