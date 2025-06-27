import CustomCheckbox from "@/components/CustomCheckbox";
import { GetVipListResponse, paymentService } from "@/services/paymentServices";
import { userService } from "@/services/userService";
import { showNotification } from "@/store/slices/notificationSlice";
import { selectUserInfo, setUserInfo } from "@/store/slices/userSlice";
import {
  formatCurrency,
  formatDate,
  formatDecimal,
  imgProxy,
  px2hp,
  px2wp,
} from "@/utils/common";
import { Ionicons } from "@expo/vector-icons";
import { useStripe } from "@stripe/stripe-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ColorValue,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function Vip() {
  const { t } = useTranslation();
  const userInfo = useSelector(selectUserInfo);
  const [selectedType, setSelectedType] = useState<number>();
  const [isAgreed, setIsAgreed] = useState(false);
  const insets = useSafeAreaInsets();
  const [plans, setPlans] = useState<GetVipListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const vipInfo = useMemo<
    {
      bg: readonly [ColorValue, ColorValue, ...ColorValue[]];
      icon: any;
      color: ColorValue;
    }[]
  >(
    () => [
      {
        icon: require("@/assets/images/vip/0.png"),
        bg: ["#EEEFF8", "#9EA6D0"],
        color: "#7F909F",
      },
      {
        icon: require("@/assets/images/vip/1.png"),
        bg: ["#FCFFC7", "#FF7B00"],
        color: "#FF7B00",
      },
      {
        icon: require("@/assets/images/vip/2.png"),
        bg: ["#FDDAE9", "#FF506A"],
        color: "#FF506A",
      },
      {
        icon: require("@/assets/images/vip/3.png"),
        bg: ["#FFFCAB", "#5E00FF"],
        color: "#5E00FF",
      },
      {
        icon: require("@/assets/images/vip/4.png"),
        bg: ["#A1F2FF", "#F4FF60", "#FF60E7"],
        color: "#FF60E7",
      },
    ],
    []
  );

  useEffect(() => {
    const getPlans = async () => {
      const res = await paymentService.getVipListNoPrice();
      if (res.code === 200) {
        setPlans(res.data || []);
        setSelectedType((res.data || [])[0]?.id);
      }
      setLoading(false);
    };
    getPlans();
  }, []);

  const handleSubscriptionSelect = (id: number) => {
    setSelectedType(id);
  };

  const getSubscriptionStyle = (id: number) => {
    if (id === selectedType) {
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
    if (selectedType === undefined) return;
    const plan = plans.find((plan) => plan.id === selectedType);
    if (plan?.subscription_type === "lifetime") {
      return t("vip.agreement.oneTimePayment");
    }
    return t("vip.agreement.autoRenewal", {
      price: formatCurrency((plan?.price || 0) / 100),
    });
  };

  const handleConfirm = async () => {
    if (paymentLoading) return;
    try {
      setPaymentLoading(true);
      const plan = plans.find((plan) => plan.id === selectedType);
      // 创建支付订单
      console.log({
        payment_gateway: "STRIPE",
        payment_method: Platform.OS === "web" ? "WEB" : "APP",
        auto_renew: isAgreed,
        subscription_type: plan!.subscription_type,
        vip_level: userInfo?.vip || 0,
      });

      const orderResponse = await paymentService.subscribeVip({
        payment_gateway: "STRIPE",
        payment_method: Platform.OS === "web" ? "WEB" : "APP",
        auto_renew: isAgreed,
        subscription_type: plan!.subscription_type,
        vip_level: userInfo?.vip || 0,
      });

      if (orderResponse.code !== 200 || !orderResponse.data) return;
      const { error } = await initPaymentSheet({
        merchantDisplayName: "ECHO",
        customerId: orderResponse.data.customer,
        customerEphemeralKeySecret: orderResponse.data.ephemeralKey,
        paymentIntentClientSecret: orderResponse.data.sk,
        defaultBillingDetails: {
          name: userInfo?.username,
        },
      });
      const res = await presentPaymentSheet();
      if (res.error) {
        dispatch(
          showNotification({
            message: res.error.message,
            type: "default",
            duration: 2000,
          })
        );
      } else {
        dispatch(
          showNotification({
            type: "success",
            message: t("wallet.success"),
            duration: 2000,
          })
        );
        updateUserInfo();
      }
    } catch (error: any) {
    } finally {
      setPaymentLoading(false);
    }
  };

  const updateUserInfo = async () => {
    const res = await userService.getUserInfo();
    if (res.code === 200) {
      dispatch(setUserInfo(res.data));
    }
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
              <Text
                style={[
                  styles.status,
                  { color: vipInfo[userInfo?.vip || 0].color },
                ]}
              >
                {userInfo?.is_vip_active
                  ? t("vip.expires") +
                    formatDate(userInfo?.vip_expire_at, "YYYY-MM-DD")
                  : t("vip.notActivated")}
              </Text>
            </View>
          </LinearGradient>
          <Image
            source={vipInfo[userInfo?.vip || 0].icon}
            style={styles.cardDecoration}
            resizeMode="contain"
          />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#19DBF2" />
          </View>
        ) : plans.length ? (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.subscriptionContainer}
            >
              {plans.map((plan) => {
                const style = getSubscriptionStyle(plan.id);
                return (
                  <TouchableOpacity
                    key={plan.id}
                    activeOpacity={0.8}
                    style={[styles.subscriptionItem]}
                    onPress={() => handleSubscriptionSelect(plan.id)}
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
                        numberOfLines={2}
                        style={[styles.subscriptionTitle, { color: "#0C0A09" }]}
                      >
                        {plan.name}
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
                        <Text
                          style={[styles.price, { color: style.priceColor }]}
                        >
                          {formatDecimal(plan.price / 100)}
                        </Text>
                      </View>
                      <Text style={styles.perMonth}>
                        {plan.subscription_type === "lifetime"
                          ? t("vip.lifetime")
                          : t(`vip.${plan.subscription_type}`, {
                              n: formatCurrency(plan.price / 100),
                            })}
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
              disabled={paymentLoading}
            >
              {paymentLoading
                ? t("common.camera.processing")
                : t("common.confirm")}
            </Button>
          </>
        ) : null}
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
    position: "absolute",
    bottom: -10,
    left: 16,
    fontSize: 12,
    fontWeight: "500",
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
  loadingContainer: {
    height: px2hp(240),
    justifyContent: "center",
    alignItems: "center",
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
    height: 40,
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
