import CustomCheckbox from "@/components/CustomCheckbox";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { paymentService } from "@/services/paymentServices";
import { selectUserInfo } from "@/store/slices/userSlice";
import { formatCurrency, px2hp, px2wp } from "@/utils/common";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

interface RechargeOption {
  description: string;
  amount: number;
  coins_amount: number;
  bonus: number;
  is_popular: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
  iconBg?: string;
}

export default function Wallet() {
  const { t } = useTranslation();
  const userInfo = useSelector(selectUserInfo);
  const [selectedOption, setSelectedOption] = useState<number | null>(0);
  const [selectedPayment, setSelectedPayment] = useState<string>("mastercard");
  const [showInstructionSheet, setShowInstructionSheet] = useState(false);
  const [rechargeOptions, setRechargeOptions] = useState<RechargeOption[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRechargeOptions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await paymentService.getRechargeList();
      if (res.code === 200) {
        setRechargeOptions(res.data || []);
      }
    } catch (error) {
      console.error("获取充值档位失败:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRechargeOptions();
  }, [fetchRechargeOptions]);

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
  };

  const handleSelectPayment = (id: string) => {
    setSelectedPayment(id);
  };

  const handleConfirm = async () => {
    if (selectedOption === null) return;
    setShowInstructionSheet(true);
  };

  const paymentMethods: PaymentMethod[] = [
    {
      id: "mastercard",
      name: t("wallet.paymentMethods.mastercard"),
      icon: require("@/assets/images/wallet/mastercard.png"),
    },
    {
      id: "paypal",
      name: t("wallet.paymentMethods.paypal"),
      icon: require("@/assets/images/wallet/paypal.png"),
    },
  ];

  const instructions = [
    t("wallet.instructions.0"),
    t("wallet.instructions.1"),
    t("wallet.instructions.2"),
    t("wallet.instructions.3"),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backContainer}
        onPress={() => {
          router.back();
        }}
      >
        <Ionicons name="arrow-back-outline" size={24} color="black" />
        <Text style={styles.backText}>{t("wallet.title")}</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <LinearGradient
          colors={["#2277FF", "#34D9FA"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.balanceCard}
        >
          <View style={styles.circles}>
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />
            <View style={[styles.circle, styles.circle3]} />
          </View>
          <View style={styles.balanceContent}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceTitle}>
                {t("wallet.currentBalance")}
              </Text>
              <Ionicons name="help-circle-outline" size={16} color="white" />
            </View>
            <View style={styles.balanceAmount}>
              <Image
                source={require("@/assets/images/wallet/coin.png")}
                style={styles.coinIcon}
              />
              <Text style={styles.amount}>
                {formatCurrency(userInfo?.balance, "")}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.detailsButton}
            activeOpacity={0.8}
            onPress={() => router.push("/profile/wallet/details")}
          >
            <Text style={styles.detailsText}>{t("wallet.coinDetails")}</Text>
            <AntDesign name="arrowright" size={16} color="white" />
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView>
          <Text style={styles.rechargeTitle}>{t("wallet.rechargeAmount")}</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#19DBF2" />
            </View>
          ) : (
            <View style={styles.rechargeGrid}>
              {rechargeOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.rechargeOption,
                    selectedOption === index && styles.rechargeOptionSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleSelectOption(index)}
                >
                  <View style={styles.rechargeContent}>
                    <View style={styles.coinAmount}>
                      <Image
                        source={require("@/assets/images/wallet/coin.png")}
                        style={styles.smallCoinIcon}
                      />
                      <Text style={styles.coinText}>{option.coins_amount}</Text>
                    </View>
                    <View style={styles.priceTag}>
                      <Text style={styles.priceText}>${option.amount}</Text>
                    </View>
                  </View>
                  {option.is_popular && (
                    <View style={[styles.tag, styles.limitedTag]}>
                      <Text style={styles.tagText}>{option.description}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.rechargeTitle}>{t("wallet.rechargeMethod")}</Text>
          <View style={styles.paymentMethods}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethod,
                  selectedPayment === method.id && styles.paymentMethodSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => handleSelectPayment(method.id)}
              >
                <View
                  style={[
                    styles.paymentIcon,
                    method.iconBg && { backgroundColor: method.iconBg },
                  ]}
                >
                  <Image source={method.icon} style={styles.methodIcon} />
                </View>
                <View style={styles.paymentDetails}>
                  <Text style={styles.paymentName}>{method.name}</Text>
                </View>
                <CustomCheckbox
                  checked={selectedPayment === method.id}
                  onPress={() => handleSelectPayment(method.id)}
                  size={24}
                  activeColor="#19DBF2"
                  inactiveColor="#C1C7D0"
                  shape="circle"
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <Button
          mode="contained"
          style={[
            styles.submitButton,
            selectedOption === null && styles.submitButtonDisabled,
          ]}
          contentStyle={styles.submitButtonContent}
          labelStyle={styles.confirmButtonText}
          onPress={handleConfirm}
          disabled={selectedOption === null}
        >
          {t("common.confirm")}
        </Button>
      </View>

      <BottomSheet
        visible={showInstructionSheet}
        onClose={() => setShowInstructionSheet(false)}
        containerStyle={{ height: 314 }}
        initialY={500}
      >
        <View style={styles.sheetContainer}>
          <View style={styles.sheetContent}>
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            <View style={styles.instructionContainer}>
              <Text style={styles.instructionTitle}>
                {t("wallet.rechargeInstructions")}
              </Text>
              {instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionRow}>
                  <View style={styles.instructionDot} />
                  <Text style={styles.instructionText}>
                    {instruction}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.buttonGroup}>
              <Button
                mode="outlined"
                style={styles.cancelButton}
                contentStyle={styles.buttonContent}
                labelStyle={[styles.buttonText, { color: "#19DBF2" }]}
                rippleColor="rgba(0,0,0,0.03)"
                onPress={() => setShowInstructionSheet(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button
                mode="contained"
                style={styles.confirmButton}
                contentStyle={styles.buttonContent}
                labelStyle={[styles.buttonText, styles.whiteText]}
                onPress={() => {
                  // TODO: 处理支付逻辑
                  setShowInstructionSheet(false);
                }}
              >
                {t("common.confirm")}
              </Button>
            </View>
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
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
    paddingTop: 12,
  },
  balanceCard: {
    height: px2hp(100),
    borderRadius: 20,
    padding: px2wp(22),
    overflow: "hidden",
    position: "relative",
  },
  circles: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  circle: {
    position: "absolute",
    borderRadius: 999,
  },
  circle1: {
    width: px2wp(186),
    height: px2wp(186),
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    right: px2wp(-49),
    top: px2wp(-49),
  },
  circle2: {
    width: px2wp(136),
    height: px2wp(136),
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    right: px2wp(-44),
    top: px2wp(-44),
  },
  circle3: {
    width: px2wp(110),
    height: px2wp(110),
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    right: px2wp(-55),
    top: px2wp(-55),
  },
  balanceContent: {
    gap: px2wp(8),
  },
  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: px2wp(4),
  },
  balanceTitle: {
    fontFamily: "Outfit",
    fontSize: 14,
    lineHeight: px2wp(18),
    color: "#FFFFFF",
    fontWeight: "500",
  },
  eyeImage: {
    width: "100%",
    height: "100%",
  },
  balanceAmount: {
    flexDirection: "row",
    alignItems: "center",
    gap: px2wp(4),
  },
  coinIcon: {
    width: px2wp(24),
    height: px2wp(24),
  },
  amount: {
    fontFamily: "Outfit",
    fontSize: px2wp(24),
    lineHeight: px2wp(30),
    color: "#FFFFFF",
    fontWeight: "500",
  },
  detailsButton: {
    position: "absolute",
    right: 12,
    top: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingVertical: px2wp(8),
    paddingLeft: px2wp(12),
    paddingRight: px2wp(6),
    borderRadius: px2wp(100),
    borderWidth: 1,
    borderColor: "#FFFEFE",
  },
  detailsText: {
    fontFamily: "DM Sans",
    fontSize: px2wp(12),
    lineHeight: px2wp(16),
    color: "#FFFFFF",
    fontWeight: "600",
  },
  rechargeTitle: {
    fontFamily: "Outfit",
    fontSize: px2wp(14),
    lineHeight: px2wp(18),
    color: "#0C0A09",
    fontWeight: "700",
    marginTop: 20,
  },
  rechargeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: px2wp(12),
    marginTop: 12,
  },
  rechargeOption: {
    width: (px2wp(375) - px2wp(56)) / 3,
    backgroundColor: "#FFFFFF",
    borderRadius: px2wp(12),
    borderWidth: 2,
    borderColor: "#F3F4F6",
    padding: px2wp(12),
    paddingTop: px2wp(20),
    alignItems: "center",
    gap: px2wp(4),
    position: "relative",
  },
  rechargeOptionSelected: {
    borderColor: "#19DBF2",
  },
  rechargeContent: {
    alignItems: "center",
    gap: px2wp(4),
    width: "100%",
  },
  coinAmount: {
    flexDirection: "row",
    alignItems: "center",
    gap: px2wp(4),
    justifyContent: "center",
  },
  smallCoinIcon: {
    width: px2wp(20),
    height: px2wp(20),
  },
  coinText: {
    fontFamily: "Outfit",
    fontSize: px2wp(16),
    lineHeight: px2wp(20),
    color: "#0C0A09",
    fontWeight: "500",
  },
  priceTag: {
    backgroundColor: "#F5F7FA",
    paddingHorizontal: px2wp(12),
    paddingVertical: px2wp(4),
    borderRadius: px2wp(28),
  },
  priceText: {
    fontFamily: "Outfit",
    fontSize: px2wp(10),
    lineHeight: px2wp(13),
    color: "#0C0A09",
    fontWeight: "500",
  },
  tag: {
    position: "absolute",
    top: 0,
    right: -1,
    paddingHorizontal: px2wp(10),
    paddingVertical: px2wp(2),
    borderBottomLeftRadius: px2wp(8),
    borderTopRightRadius: px2wp(12),
  },
  firstTag: {
    backgroundColor: "#EA6AEA",
  },
  limitedTag: {
    backgroundColor: "#F28919",
  },
  tagText: {
    fontFamily: "Outfit",
    fontSize: px2wp(8),
    lineHeight: px2wp(10),
    color: "#FFFFFF",
    fontWeight: "600",
  },
  paymentMethods: {
    marginTop: px2hp(12),
    gap: px2wp(12),
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 48,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 16,
    borderWidth: 2,
    borderColor: "#F3F4F6",
  },
  paymentMethodSelected: {
    borderColor: "#19DBF2",
  },
  paymentIcon: {
    borderRadius: px2wp(36),
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  methodIcon: {
    width: 36,
    height: 36,
    resizeMode: "contain",
  },
  paymentDetails: {
    flex: 1,
    justifyContent: "center",
  },
  paymentName: {
    fontFamily: "Outfit",
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.2,
    color: "#0D0D12",
    fontWeight: "500",
  },
  submitButton: {
    marginBottom: 20,
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
  submitButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  sheetContainer: {
    height: "100%",
  },
  sheetContent: {
    flex: 1,
    height: "100%",
    paddingHorizontal: px2wp(20),
  },
  handleContainer: {
    alignItems: "center",
    marginBottom: px2hp(16),
  },
  handle: {
    width: px2wp(48),
    height: px2hp(5),
    backgroundColor: "#F3F4F6",
    borderRadius: 50,
  },
  instructionContainer: {
    alignItems: "center",
    alignSelf: "stretch",
    gap: px2hp(8),
  },
  instructionTitle: {
    fontFamily: "Outfit",
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
    fontWeight: "700",
    color: "#0C0A09",
  },
  instructionRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    gap: px2wp(8),
  },
  instructionDot: {
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: "#19DBF2",
  },
  instructionText: {
    flex: 1,
    fontFamily: "Outfit",
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.5,
    color: "#48484A",
    fontWeight: "400",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: px2wp(12),
    marginTop: "auto",
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
    color: "#FFFFFF",
  },
  cancelButton: {
    flex: 1,
    borderRadius: px2hp(78),
    borderColor: "#19DBF2",
    borderWidth: 1,
  },
  confirmButton: {
    flex: 1,
    borderRadius: px2hp(78),
    backgroundColor: "#19DBF2",
  },
  whiteText: {
    color: "#FFFFFF",
  },
  loadingContainer: {
    height: px2hp(120),
    justifyContent: "center",
    alignItems: "center",
  },
});
