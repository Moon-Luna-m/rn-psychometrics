import InputField from "@/components/InputField";
import { userService } from "@/services/userService";
import { encrypt, px2hp, setLocalCache } from "@/utils/common";
import { getValidationSchemas } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Button } from "react-native-paper";
import { z } from "zod";
import ErrorMessage from "./ErrorMessage";

export default function RegisterForm() {
  const { t } = useTranslation();
  const { emailSchema, passwordSchema } = getValidationSchemas();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // 创建一个对象schema来包装注册字段
  const formSchema = z
    .object({
      email: emailSchema,
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
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setError("");
      const res = await userService.getCaptcha({
        email: data.email,
        type: "register",
      });
      if (res.code === 200) {
        await setLocalCache(
          "user_register_info",
          encrypt(
            JSON.stringify({
              email: data.email,
              password: data.password,
            })
          )
        );
        router.push("/user/verify");
      } else {
        setError(res.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
      >
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t("form.email.label")}</Text>
            <InputField
              control={control}
              name="email"
              placeholder={t("form.email.placeholder")}
              errors={errors}
              returnKeyType="next"
              blurOnSubmit={false}
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t("form.password.label")}</Text>
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
              styles.submitButton,
              (isLoading ||
                !watch("email") ||
                !watch("password") ||
                !watch("confirmPassword")) && {
                opacity: 0.5,
              },
            ]}
            contentStyle={styles.submitButtonContent}
            labelStyle={styles.submitButtonText}
            loading={isLoading}
            disabled={
              isLoading ||
              !watch("email") ||
              !watch("password") ||
              !watch("confirmPassword")
            }
          >
            {isLoading ? t("common.loading") : t("form.submit.register")}
          </Button>
          <View style={styles.errorContainer}>
            <ErrorMessage message={error} visible={!!error} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: px2hp(24),
    gap: px2hp(8),
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
    paddingVertical: 0,
    borderRadius: px2hp(40),
    borderWidth: 1,
    borderColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    height: px2hp(48),
    paddingVertical: px2hp(10),
    fontFamily: "Outfit",
    fontSize: 14,
    fontWeight: "500",
    color: "#272829",
  },
  submitButton: {
    marginTop: px2hp(32),
    borderRadius: px2hp(78),
    backgroundColor: "#19DBF2",
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
  errorContainer: {
    alignItems: "center",
  },
});
