import CustomCheckbox from "@/components/CustomCheckbox";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { px2hp, px2wp } from "@/utils/common";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";

type PaymentMethod = "mastercard" | "paypal" | "wise";

interface PaymentSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (method: PaymentMethod) => void;
  price: string;
  title: string;
}

export default function PaymentSheet({
  visible,
  onClose,
  onConfirm,
  price,
  title,
}: PaymentSheetProps) {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethod>("mastercard");

  const paymentMethods = [
    {
      id: "mastercard" as const,
      icon: require("@/assets/images/wallet/mastercard.png"),
      label: "Mastercard",
    },
    {
      id: "paypal" as const,
      icon: require("@/assets/images/wallet/paypal.png"),
      label: "Paypal",
    },
  ];

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.divider} />
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.price}>${price}</Text>
          </View>

          <View style={styles.methodsContainer}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodItem,
                  selectedMethod === method.id && styles.methodItemSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedMethod(method.id)}
              >
                <View style={[styles.methodIcon]}>
                  <Image source={method.icon} style={styles.icon} />
                </View>
                <View style={styles.methodDetails}>
                  <Text style={styles.methodLabel}>{method.label}</Text>
                </View>
                <CustomCheckbox
                  checked={selectedMethod === method.id}
                  onPress={() => setSelectedMethod(method.id)}
                  size={24}
                  shape="circle"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          mode="contained"
          style={[styles.submitButton]}
          contentStyle={styles.submitButtonContent}
          labelStyle={styles.confirmButtonText}
          onPress={() => onConfirm(selectedMethod)}
        >
          {t("common.confirm")}
        </Button>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 12,
  },
  divider: {
    width: px2wp(48),
    height: 5,
    backgroundColor: "#F3F4F6",
    borderRadius: 50,
  },
  content: {
    gap: px2hp(8),
  },
  titleContainer: {
    alignItems: "center",
    paddingVertical: px2hp(12),
    gap: px2hp(4),
  },
  title: {
    fontFamily: "Outfit",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    letterSpacing: 0.2,
    color: "#0C0A09",
    textAlign: "center",
  },
  price: {
    fontFamily: "Outfit",
    fontSize: 24,
    fontWeight: "500",
    lineHeight: 30,
    color: "#FF6F00",
    textAlign: "center",
  },
  methodsContainer: {
    gap: px2hp(12),
  },
  methodItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    paddingRight: px2wp(16),
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "#F3F4F6",
    gap: px2wp(12),
  },
  methodItemSelected: {
    borderColor: "#19DBF2",
  },
  methodIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 36,
    height: 36,
    resizeMode: "contain",
  },
  methodDetails: {
    flex: 1,
    justifyContent: "center",
  },
  methodLabel: {
    fontFamily: "Outfit",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0.2,
    color: "#0D0D12",
  },
  submitButton: {
    marginTop: 24,
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
});
