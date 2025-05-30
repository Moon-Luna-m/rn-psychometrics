import InputField from "@/components/InputField";
import { userService } from "@/services/userService";
import { encrypt, px2hp, px2wp, setLocalCache } from "@/utils/common";
import { getValidationSchemas } from "@/utils/validation";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
    ImageBackground,
    Keyboard,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Button } from "react-native-paper";
import { z } from "zod";

export default function ForgotScreen() {
  const { t } = useTranslation();
  const { emailSchema } = getValidationSchemas();
  // 创建一个对象schema来包装email字段
  const formSchema = z.object({
    email: emailSchema,
  });
  const [isLoading, setIsLoading] = useState(false);
  type FormData = z.infer<typeof formSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      Keyboard.dismiss();
      const res = await userService.getCaptcha({
        email: data.email,
        type: "reset",
      });
      if (res.code === 200) {
        await setLocalCache(
          "user_forgot_info",
          encrypt(
            JSON.stringify({
              email: data.email,
            })
          )
        );
        router.push(`/user/verify?from=forgot`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{t("form.forgot.title")}</Text>
            <Text style={styles.subtitle}>{t("form.forgot.subtitle")}</Text>
          </View>
          <View style={styles.inputGroup}>
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
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            style={[
              styles.submitButton,
              (isLoading || !watch("email")) && {
                opacity: 0.5,
              },
            ]}
            contentStyle={styles.submitButtonContent}
            labelStyle={styles.submitButtonText}
            loading={isLoading}
            disabled={isLoading || !watch("email")}
          >
            {isLoading ? t("common.loading") : t("form.forgot.button")}
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
    paddingTop: px2hp(56),
    paddingHorizontal: px2wp(24),
  },
  titleContainer: {
    gap: px2hp(16),
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#0C0A09",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#7F909F",
    lineHeight: 20,
  },
  inputGroup: {
    marginTop: px2hp(12),
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
  },
  input: {
    flex: 1,
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
});
