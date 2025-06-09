import CustomCheckbox from "@/components/CustomCheckbox";
import { selectUserInfo } from "@/store/slices/userSlice";
import { imgProxy, px2hp, px2wp } from "@/utils/common";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ColorValue,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import PaymentSheet from "../../../components/payment/PaymentSheet";

type SubscriptionType = "monthly" | "quarterly" | "annual" | "lifetime";

export default function Vip() {
  const { t } = useTranslation();
  const userInfo = useSelector(selectUserInfo);
  const [selectedType, setSelectedType] = useState<SubscriptionType>("monthly");
  const [isAgreed, setIsAgreed] = useState(false);
  const insets = useSafeAreaInsets();
  const [paymentVisible, setPaymentVisible] = useState(false);

  const vipInfo = useMemo<
    { bg: readonly [ColorValue, ColorValue, ...ColorValue[]]; icon: any }[]
  >(
    () => [
      {
        icon: require("@/assets/images/vip/0.png"),
        bg: ["#EEEFF8", "#9EA6D0"],
      },
      {
        icon: require("@/assets/images/vip/1.png"),
        bg: ["#FCFFC7", "#FF7B00"],
      },
      {
        icon: require("@/assets/images/vip/2.png"),
        bg: ["#FDDAE9", "#FF506A"],
      },
      {
        icon: require("@/assets/images/vip/3.png"),
        bg: ["#FFFCAB", "#5E00FF"],
      },
      {
        icon: require("@/assets/images/vip/4.png"),
        bg: ["#A1F2FF", "#F4FF60", "#FF60E7"],
      },
    ],
    []
  );

  const subscriptions = useMemo(
    () => [
      {
        type: "monthly" as const,
        gradient: ["#BBF1FF", "#FFFFFF"] as readonly [ColorValue, ColorValue],
        borderColor: "#19DBF2",
        borderWidth: 2,
        priceColor: "#19DBF2",
      },
      {
        type: "quarterly" as const,
        gradient: ["#FFFFFF", "#FFFFFF"] as readonly [ColorValue, ColorValue],
        borderColor: "#F3F4F6",
        borderWidth: 1,
        priceColor: "#0C0A09",
      },
      {
        type: "annual" as const,
        gradient: ["#FFFFFF", "#FFFFFF"] as readonly [ColorValue, ColorValue],
        borderColor: "#F3F4F6",
        borderWidth: 1,
        priceColor: "#0C0A09",
      },
      {
        type: "lifetime" as const,
        gradient: ["#FFFFFF", "#FFFFFF"] as readonly [ColorValue, ColorValue],
        borderColor: "#F3F4F6",
        borderWidth: 1,
        priceColor: "#0C0A09",
      },
    ],
    []
  );

  const handleSubscriptionSelect = (type: SubscriptionType) => {
    setSelectedType(type);
  };

  const getSubscriptionStyle = (type: SubscriptionType) => {
    if (type === selectedType) {
      return {
        gradient: ["#BBF1FF", "#FFFFFF"] as readonly [ColorValue, ColorValue],
        borderColor: "#19DBF2",
        borderWidth: 2,
        priceColor: "#19DBF2",
      };
    }
    return {
      gradient: ["#FFFFFF", "#FFFFFF"] as readonly [ColorValue, ColorValue],
      borderColor: "#F3F4F6",
      borderWidth: 2,
      priceColor: "#0C0A09",
    };
  };

  const getAutoRenewalText = () => {
    if (selectedType === "lifetime") {
      return t("vip.agreement.oneTimePayment");
    }
    return t("vip.agreement.autoRenewal", {
      price: t(`vip.subscriptions.${selectedType}.price`),
    });
  };

  const handleConfirm = async () => {
    setPaymentVisible(true);
  };

  const handlePaymentConfirm = (method: string) => {
    setPaymentVisible(false);
    // TODO: 处理支付逻辑
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TouchableOpacity
        style={styles.backContainer}
        onPress={() => {
          router.back();
        }}
      >
        <Ionicons name="arrow-back-outline" size={24} color="black" />
        <Text style={styles.backText}>{t("vip.title")}</Text>
      </TouchableOpacity>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={vipInfo[userInfo?.vip || 0].bg}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardBackground}
          >
            <View style={styles.cardContent}>
              <View style={styles.userInfo}>
                <Image
                  source={{ uri: imgProxy(userInfo?.avatar) }}
                  style={styles.avatar}
                />
                <Text style={styles.username}>{userInfo?.username}</Text>
              </View>
              <Text style={styles.status}>{t("vip.notActivated")}</Text>
            </View>
          </LinearGradient>
          <Image
            source={vipInfo[userInfo?.vip || 0].icon}
            style={styles.cardDecoration}
            resizeMode="contain"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subscriptionContainer}
        >
          {subscriptions.map((subscription) => {
            const style = getSubscriptionStyle(subscription.type);
            return (
              <TouchableOpacity
                key={subscription.type}
                style={[styles.subscriptionItem]}
                onPress={() => handleSubscriptionSelect(subscription.type)}
              >
                <LinearGradient
                  colors={style.gradient}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={[
                    styles.subscriptionContent,
                    {
                      borderColor: style.borderColor,
                      borderWidth: style.borderWidth,
                    },
                  ]}
                >
                  <Text
                    style={[styles.subscriptionTitle, { color: "#0C0A09" }]}
                  >
                    {t(`vip.subscriptions.${subscription.type}.title`)}
                  </Text>
                  <View style={styles.priceContainer}>
                    <Text
                      style={[
                        styles.currencySymbol,
                        { color: style.priceColor },
                      ]}
                    >
                      $
                    </Text>
                    <Text style={[styles.price, { color: style.priceColor }]}>
                      {t(`vip.subscriptions.${subscription.type}.price`)}
                    </Text>
                  </View>
                  <Text style={styles.perMonth}>
                    {t(`vip.subscriptions.${subscription.type}.perMonth`)}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={styles.agreementContainer}>
          <View style={styles.agreementCard}>
            <Text style={styles.autoRenewal}>{getAutoRenewalText()}</Text>
            <View style={styles.agreementRow}>
              <TouchableOpacity
                style={styles.agreementContent}
                onPress={() => setIsAgreed(!isAgreed)}
                activeOpacity={0.8}
              >
                <CustomCheckbox
                  checked={isAgreed}
                  onPress={() => setIsAgreed(!isAgreed)}
                  size={16}
                  shape="circle"
                />
                <View style={styles.agreementTextContainer}>
                  <Text style={styles.agreementText}>
                    {t("vip.agreement.prefix")}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={(e) => {
                      e.stopPropagation();
                      // 处理会员协议点击
                      router.push("/protocol/login");
                    }}
                  >
                    <Text style={styles.agreementLink}>
                      {t("vip.agreement.membershipAgreement")}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.agreementText}>
                    {t("vip.agreement.and")}{" "}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={(e) => {
                      e.stopPropagation();
                      // 处理订阅协议点击
                      router.push("/protocol/login");
                    }}
                  >
                    <Text style={styles.agreementLink}>
                      {t("vip.agreement.subscriptionAgreement")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Button
          mode="contained"
          style={[styles.submitButton]}
          contentStyle={styles.submitButtonContent}
          labelStyle={styles.confirmButtonText}
          onPress={handleConfirm}
        >
          {t("common.confirm")}
        </Button>
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitsHeader}>
            <View style={styles.benefitsLine} />
            <Text style={styles.benefitsTitle}>{t("vip.benefits.title")}</Text>
            <View style={styles.benefitsLine} />
          </View>
          <View style={styles.benefitsList}>
            <View style={styles.benefitCard}>
              <View style={styles.benefitIconContainer}>
                <Image
                  source={require("@/assets/images/vip/unlimited.png")}
                  style={styles.benefitIcon}
                />
              </View>
              <View style={styles.benefitTextContainer}>
                <Text style={styles.benefitTitle}>
                  {t("vip.benefits.items.unlimitedTests.title")}
                </Text>
                <Text style={styles.benefitDesc}>
                  {t("vip.benefits.items.unlimitedTests.desc")}
                </Text>
              </View>
            </View>
            <View style={styles.benefitCard}>
              <View style={styles.benefitIconContainer}>
                <Image
                  source={require("@/assets/images/vip/exclusive.png")}
                  style={styles.benefitIcon}
                />
              </View>
              <View style={styles.benefitTextContainer}>
                <Text style={styles.benefitTitle}>
                  {t("vip.benefits.items.exclusiveContent.title")}
                </Text>
                <Text style={styles.benefitDesc}>
                  {t("vip.benefits.items.exclusiveContent.desc")}
                </Text>
              </View>
            </View>
            <View style={styles.benefitCard}>
              <View style={styles.benefitIconContainer}>
                <Image
                  source={require("@/assets/images/vip/support.png")}
                  style={styles.benefitIcon}
                />
              </View>
              <View style={styles.benefitTextContainer}>
                <Text style={styles.benefitTitle}>
                  {t("vip.benefits.items.prioritySupport.title")}
                </Text>
                <Text style={styles.benefitDesc}>
                  {t("vip.benefits.items.prioritySupport.desc")}
                </Text>
              </View>
            </View>
            <View style={styles.benefitCard}>
              <View style={styles.benefitIconContainer}>
                <Image
                  source={require("@/assets/images/vip/no-ads.png")}
                  style={styles.benefitIcon}
                />
              </View>
              <View style={styles.benefitTextContainer}>
                <Text style={styles.benefitTitle}>
                  {t("vip.benefits.items.noAds.title")}
                </Text>
                <Text style={styles.benefitDesc}>
                  {t("vip.benefits.items.noAds.desc")}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <PaymentSheet
        visible={paymentVisible}
        onClose={() => setPaymentVisible(false)}
        onConfirm={handlePaymentConfirm}
        price={t(`vip.subscriptions.${selectedType}.price`)}
        title={t(`vip.subscriptions.${selectedType}.title`)}
      />
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
    paddingHorizontal: px2wp(16),
  },
  cardContainer: {
    position: "relative",
    width: "100%",
    height: px2hp(140),
    marginTop: px2hp(16),
  },
  cardBackground: {
    position: "absolute",
    top: px2hp(40),
    width: "100%",
    height: px2hp(100),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  cardContent: {
    paddingHorizontal: px2wp(16),
    paddingVertical: px2hp(13),
    gap: px2hp(12),
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: px2wp(8),
  },
  avatar: {
    width: px2wp(48),
    height: px2wp(48),
    borderRadius: px2wp(24),
    backgroundColor: "#F3F4F6",
  },
  username: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0C0A09",
    fontFamily: "Outfit",
  },
  status: {
    fontSize: 12,
    fontWeight: "500",
    color: "#7F909F",
    fontFamily: "Outfit",
  },
  cardDecoration: {
    position: "absolute",
    right: 0,
    top: 0,
    width: px2wp(150),
    height: px2wp(150),
  },
  subscriptionContainer: {
    flexDirection: "row",
    gap: px2wp(8),
    paddingVertical: px2hp(20),
  },
  subscriptionItem: {
    width: px2wp(106),
  },
  subscriptionContent: {
    borderRadius: 20,
    padding: px2wp(12),
    alignItems: "center",
    gap: px2hp(12),
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  subscriptionTitle: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Outfit",
    textAlign: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: px2wp(2),
  },
  currencySymbol: {
    marginBottom: 2,
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Outfit",
  },
  price: {
    fontSize: 24,
    fontWeight: "500",
    fontFamily: "Outfit",
  },
  perMonth: {
    fontSize: 12,
    fontWeight: "400",
    color: "#7F909F",
    fontFamily: "Outfit",
  },
  agreementContainer: {
    paddingBottom: px2hp(24),
  },
  agreementCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    padding: px2wp(12),
    gap: px2hp(12),
  },
  autoRenewal: {
    fontSize: 14,
    fontWeight: "400",
    color: "#7F909F",
    fontFamily: "Outfit",
    lineHeight: 14,
  },
  agreementRow: {
    flexDirection: "row",
  },
  agreementContent: {
    flex: 1,
    flexDirection: "row",
    gap: px2wp(4),
    alignItems: "flex-start",
  },
  agreementTextContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  agreementText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#7F909F",
    fontFamily: "Outfit",
  },
  agreementLink: {
    fontSize: 12,
    fontWeight: "400",
    color: "#19DBF2",
    fontFamily: "Outfit",
  },
  submitButton: {
    marginBottom: 24,
    borderRadius: px2hp(78),
    backgroundColor: "#19DBF2",
  },
  submitButtonContent: {
    height: px2hp(48),
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Outfit",
    textTransform: "capitalize",
  },
  benefitsContainer: {
    paddingVertical: px2hp(24),
    marginBottom: 40,
  },
  benefitsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: px2wp(6),
  },
  benefitsLine: {
    width: px2wp(40),
    height: 1,
    backgroundColor: "#19DBF2",
    opacity: 0.5,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0C0A09",
    fontFamily: "Outfit",
  },
  benefitsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: px2wp(16),
    paddingTop: px2hp(24),
  },
  benefitCard: {
    width: "100%",
    backgroundColor: "#E6F2FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    paddingHorizontal: px2wp(12),
    paddingVertical: px2wp(8),
    flexDirection: "row",
    alignItems: "center",
    gap: px2wp(9),
  },
  benefitIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  benefitIcon: {
    width: 36,
    height: 36,
  },
  benefitTextContainer: {
    flex: 1,
    gap: px2hp(6),
  },
  benefitTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "500",
    color: "#0C0A09",
    fontFamily: "Outfit",
  },
  benefitDesc: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "400",
    color: "#7F909F",
    fontFamily: "Outfit",
  },
});
