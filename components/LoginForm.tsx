import InputField from "@/components/InputField";
import { UserInfo, userService } from "@/services/userService";
import { setUserInfo } from "@/store/slices/userSlice";
import {
  decrypt,
  encrypt,
  getLocalCache,
  px2hp,
  setLocalCache,
} from "@/utils/common";
import { setToken } from "@/utils/http/request";
import { getValidationSchemas } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { z } from "zod";
import CustomCheckbox from "./CustomCheckbox";
import SocialLogin from "./SocialLogin";

export default function LoginForm() {
  const { t } = useTranslation();
  const { emailSchema, passwordSchema } = getValidationSchemas();
  const [isLoading, setIsLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [userList, setUserList] = useState<
    (UserInfo & { password: string; email: string })[]
  >([]);
  // 创建一个对象schema来包装email字段
  const formSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
  });

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
      password: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    if (!isAgreed) {
      // TODO: 显示协议未同意提示
      return;
    }

    try {
      setIsLoading(true);
      // 模拟API调用
      const res = await userService.login({
        email: data.email,
        password: data.password,
      });
      if (res.code === 200) {
        await setToken(res.data.token);
        const userInfo = await userService.getUserInfo();
        if (userInfo.code === 200) {
          dispatch(setUserInfo(userInfo.data));
          try {
            const userInfoList = await getLocalCache("user_info");
            const userInfoListObj = userInfoList
              ? JSON.parse(decrypt(userInfoList))
              : {};
            await setLocalCache(
              "user_info",
              encrypt(
                JSON.stringify({
                  ...userInfoListObj,
                  [data.email]: {
                    ...userInfo.data,
                    email: data.email,
                    password: data.password,
                  },
                })
              )
            );
          } catch (error) {
            await setLocalCache(
              "user_info",
              encrypt(
                JSON.stringify({
                  [data.email]: userInfo.data,
                })
              )
            );
          } finally {
            // 重置到根路由
            router.replace({
              pathname: "/",
            });
          }
        }
      } else {
        setError("email", { message: res.message });
        setError("password", { message: res.message });
      }
      // TODO: 处理登录逻辑
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getUserList = async () => {
      const userInfoList = await getLocalCache("user_info");
      setUserList(userInfoList ? JSON.parse(decrypt(userInfoList)) : []);
    };
    getUserList();
  }, []);

  useEffect(() => {
    console.log(userList);
  }, [userList]);

  return (
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
          returnKeyType="done"
          onSubmitEditing={() => {
            Keyboard.dismiss();
            handleSubmit(onSubmit)();
          }}
          containerStyle={styles.inputContainer}
          inputStyle={styles.input}
        />
        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => {}}
          activeOpacity={0.5}
        >
          <Text style={styles.forgotPasswordText}>
            {t("form.login.forgotPassword")}
          </Text>
        </TouchableOpacity>
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        style={[
          styles.submitButton,
          (isLoading || !watch("email") || !watch("password") || !isAgreed) && {
            opacity: 0.5,
          },
        ]}
        contentStyle={styles.submitButtonContent}
        labelStyle={styles.submitButtonText}
        loading={isLoading}
        disabled={
          isLoading || !watch("email") || !watch("password") || !isAgreed
        }
      >
        {isLoading ? t("common.loading") : t("form.submit.login")}
      </Button>
      <View style={styles.agreementContainer}>
        <CustomCheckbox
          checked={isAgreed}
          onPress={() => setIsAgreed(!isAgreed)}
          label={
            <Text style={styles.agreementText}>
              <Trans
                i18nKey="form.login.agreement"
                values={{
                  agreement: t("form.login.agreementLink"),
                }}
                components={[
                  <Text
                    onPress={() => router.push("/user/protocol/login")}
                    style={{ textDecorationLine: "underline" }}
                  >
                    {t("form.login.agreementLink")}
                  </Text>,
                ]}
              />
            </Text>
          }
        />
      </View>

      <SocialLogin />
    </View>
  );
}

const styles = StyleSheet.create({
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -px2hp(8),
  },
  forgotPasswordText: {
    fontFamily: "Outfit",
    fontSize: 12,
    fontWeight: "500",
    color: "#19DBF2",
  },
  agreementContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: px2hp(12),
  },
  agreementText: {
    fontFamily: "Outfit",
    fontSize: 14,
    fontWeight: "500",
    color: "#A9B0B8",
    marginLeft: px2hp(8),
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
