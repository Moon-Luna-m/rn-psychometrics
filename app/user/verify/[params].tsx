import ErrorMessage from "@/components/ErrorMessage";
import InputField from "@/components/InputField";
import { userService } from "@/services/userService";
import {
  clearLocalCache,
  decrypt,
  getLocalCache,
  px2hp,
  px2wp,
} from "@/utils/common";
import { getValidationSchemas } from "@/utils/validation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Image,
  ImageBackground,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

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
          {params !== "reset" ? (
            <>
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
            </>
          ) : (
            <Reset />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const Reset = () => {
  const { t } = useTranslation();
  const { passwordSchema } = getValidationSchemas();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const formSchema = z
    .object({
      password: passwordSchema,
      confirmPassword: z.string().min(1, t("form.confirmPassword.required")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("form.confirmPassword.match"),
      path: ["confirmPassword"],
    });

  type FormData = z.infer<typeof formSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setError("");
      const code = await getLocalCache("user_forgot_captcha");
      const email = await getLocalCache("user_forgot_info");

      if (code && email) {
        const { code: codeData } = JSON.parse(decrypt(code));
        const { email: emailData } = JSON.parse(decrypt(email));
        const res = await userService.reset({
          email: emailData,
          new_password: data.password,
          code: codeData,
        });
        if (res.code === 200) {
          await clearLocalCache("user_forgot_captcha");
          await clearLocalCache("user_forgot_info");
          router.replace({
            pathname: "/user/verify/[params]",
            params: { params: "password" },
          });
        } else {
          setError(res.message);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.resetContainer}>
      <View>
        <View style={styles.resetTitleContainer}>
          <Text style={styles.resetTitle}>{t("form.reset.title")}</Text>
          <Text style={styles.resetSubtitle}>{t("form.reset.subtitle")}</Text>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t("form.reset.newPassword")}</Text>
          <InputField
            control={control}
            name="password"
            placeholder={t("form.password.placeholder")}
            secureTextEntry
            showPasswordToggle
            errors={errors}
            returnKeyType="next"
            blurOnSubmit={false}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            {t("form.confirmPassword.label")}
          </Text>
          <InputField
            control={control}
            name="confirmPassword"
            placeholder={t("form.confirmPassword.placeholder")}
            secureTextEntry
            showPasswordToggle
            errors={errors}
            returnKeyType="done"
            onSubmitEditing={() => {
              Keyboard.dismiss();
              handleSubmit(onSubmit)();
            }}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
          />
        </View>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={[
            styles.resetSubmitButton,
            (isLoading || !watch("password") || !watch("confirmPassword")) && {
              opacity: 0.5,
            },
          ]}
          contentStyle={styles.resetSubmitButtonContent}
          labelStyle={styles.resetSubmitButtonText}
          loading={isLoading}
          disabled={
            isLoading || !watch("password") || !watch("confirmPassword")
          }
        >
          {isLoading ? t("common.loading") : t("form.reset.button")}
        </Button>
        <View style={styles.errorContainer}>
          <ErrorMessage message={error} visible={!!error} />
        </View>
      </View>
    </View>
  );
};

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
  resetContainer: {
    width: "100%",
  },
  resetTitleContainer: {
    gap: px2hp(16),
  },
  resetTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#0C0A09",
  },
  resetSubtitle: {
    marginBottom: px2hp(56),
    fontSize: 14,
    fontWeight: "500",
    color: "#7F909F",
    lineHeight: 20,
  },
  inputGroup: {
    gap: px2hp(8),
  },
  inputLabel: {
    fontFamily: "Outfit",
    fontSize: 16,
    fontWeight: "600",
    color: "#272829",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: px2hp(12),
    paddingVertical: px2hp(10),
    borderRadius: px2hp(40),
    borderWidth: 1,
    borderColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    fontFamily: "Outfit",
    fontSize: 14,
    fontWeight: "500",
    color: "#272829",
  },
  resetSubmitButton: {
    marginTop: px2hp(32),
    borderRadius: px2hp(78),
    backgroundColor: "#19DBF2",
  },
  resetSubmitButtonContent: {
    height: px2hp(56),
  },
  resetSubmitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
    color: "#FFFFFF",
    fontFamily: "Outfit",
  },
  errorContainer: {
    alignItems: "center",
  },
});
