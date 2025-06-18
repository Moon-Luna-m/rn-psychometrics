import InputField from "@/components/InputField";
import { UserInfo, userService } from "@/services/userService";
import { setUserInfo } from "@/store/slices/userSlice";
import {
  decrypt,
  encrypt,
  getLocalCache,
  imgProxy,
  px2hp,
  setLocalCache,
} from "@/utils/common";
import { setToken } from "@/utils/http/request";
import { getValidationSchemas } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import {
  Image,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { z } from "zod";
import CustomCheckbox from "./CustomCheckbox";
import SocialLogin from "./SocialLogin";

interface ExtendedUserInfo extends UserInfo {
  password: string;
  email: string;
  nickname?: string;
}

export default function LoginForm() {
  const { t } = useTranslation();
  const { emailSchema, passwordSchema } = getValidationSchemas();
  const [isLoading, setIsLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  const [filteredUserList, setFilteredUserList] = useState<
    Record<string, ExtendedUserInfo>
  >({});
  const [isSelectingEmail, setIsSelectingEmail] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [userList, setUserList] = useState<Record<string, ExtendedUserInfo>>({});
  const dropdownRef = useRef<View>(null);

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
    setValue,
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
      try {
      const userInfoList = await getLocalCache("user_info");
        if (!userInfoList) {
          return;
        }

        try {
          const decryptedData = JSON.parse(decrypt(userInfoList));
          if (typeof decryptedData !== 'object' || decryptedData === null) {
            throw new Error('Invalid user data format');
          }
          setUserList(decryptedData);
        } catch (decryptError) {
          console.error('Failed to decrypt or parse user data:', decryptError);
          // 清除损坏的数据
          await setLocalCache("user_info", "");
          setUserList({});
        }
      } catch (error) {
        console.error('Failed to get user list from cache:', error);
        setUserList({});
      }
    };
    getUserList();
  }, []);

  // 监听邮箱输入变化
  useEffect(() => {
    if (isSelectingEmail) {
      return;
    }

    try {
      const emailValue = watch("email");
      if (!emailValue) {
        setFilteredUserList(userList);
        return;
      }

      const filtered = Object.entries(userList).reduce((acc, [email, user]) => {
        if (email.toLowerCase().includes(emailValue.toLowerCase())) {
          acc[email] = user;
        }
        return acc;
      }, {} as Record<string, ExtendedUserInfo>);

      setFilteredUserList(filtered);
      
      // 如果有匹配项且输入框聚焦，显示下拉列表
      if (Object.keys(filtered).length > 0) {
        setShowEmailDropdown(true);
      } else {
        setShowEmailDropdown(false);
      }
    } catch (error) {
      console.error('Failed to filter email list:', error);
      setFilteredUserList({});
      setShowEmailDropdown(false);
    }
  }, [watch("email"), userList, isSelectingEmail]);

  const handleEmailSelect = (email: string, password: string) => {
    try {
      setIsSelectingEmail(true);
      setValue("email", email, { shouldValidate: true });
      setValue("password", password, { shouldValidate: true });
      setShowEmailDropdown(false);
    } catch (error) {
      console.error('Failed to select email:', error);
      setIsSelectingEmail(false);
      setShowEmailDropdown(false);
    }
  };

  useEffect(() => {
    if (Platform.OS === "web" && showEmailDropdown) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
          dropdownRef.current &&
          !(dropdownRef.current as any).contains(target)
        ) {
          setShowEmailDropdown(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showEmailDropdown]);

  const renderEmailDropdown = () => {
    const hasUsers = Object.keys(filteredUserList).length > 0;
    const itemHeight = px2hp(46); // 每个列表项的高度
    const contentHeight = Math.min(
      Object.keys(filteredUserList).length * itemHeight + px2hp(16),
      px2hp(184)
    );

    const animatedStyle = useAnimatedStyle(() => {
      return {
        opacity: withTiming(showEmailDropdown ? 1 : 0, { duration: 200 }),
        height: withTiming(showEmailDropdown && hasUsers ? contentHeight : 0, {
          duration: 200,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
      };
    });

    if (!hasUsers) return null;

    return (
      <Animated.View style={[styles.dropdownContainer, animatedStyle]}>
        <ScrollView
          style={styles.dropdownList}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {Object.entries(filteredUserList).map(([email, user]) => (
            <TouchableOpacity
              key={email}
              style={styles.dropdownItem}
              onPress={() => handleEmailSelect(email, user.password)}
              activeOpacity={1}
            >
              <Image
                source={{ uri: imgProxy(user.avatar) }}
                style={styles.avatar}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.username || "Echo"}</Text>
                <Text style={styles.userEmail}>{email}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    );
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => Platform.OS !== "web" && setShowEmailDropdown(false)}
    >
    <View style={styles.formContainer}>
        <View style={[styles.inputGroup, { zIndex: 10 }]}>
        <Text style={styles.inputLabel}>{t("form.email.label")}</Text>
          <TouchableWithoutFeedback>
            <View ref={dropdownRef}>
        <InputField
          control={control}
          name="email"
          placeholder={t("form.email.placeholder")}
          errors={errors}
          returnKeyType="next"
          blurOnSubmit={false}
                containerStyle={[
                  styles.inputContainer,
                  showEmailDropdown && styles.inputContainerActive,
                ]}
          inputStyle={styles.input}
                onFocusChange={(focused) => {
                  if (focused && Object.keys(userList).length > 0) {
                    setShowEmailDropdown(true);
                    setIsSelectingEmail(false);
                  }
                }}
                handleBlur={() => {
                  setShowEmailDropdown(false);
                }}
                showArrow={Object.keys(userList).length > 0}
              />
              {renderEmailDropdown()}
            </View>
          </TouchableWithoutFeedback>
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
          onPress={() => {
            router.push("/user/forgot");
          }}
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
            (isLoading ||
              !watch("email") ||
              !watch("password") ||
              !isAgreed) && {
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
    </TouchableWithoutFeedback>
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
  inputContainerActive: {
    borderColor: "#19DBF2",
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
  dropdownContainer: {
    position: "absolute",
    top: px2hp(64),
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: px2hp(12),
    marginTop: px2hp(4),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
    overflow: "hidden",
  },
  dropdownList: {
    flex: 1,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: px2hp(12),
    height: px2hp(46),
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  avatar: {
    width: px2hp(32),
    height: px2hp(32),
    borderRadius: px2hp(16),
  },
  userInfo: {
    marginLeft: px2hp(12),
    flex: 1,
  },
  userName: {
    fontFamily: "Outfit",
    fontSize: 14,
    fontWeight: "600",
    color: "#272829",
  },
  userEmail: {
    fontFamily: "Outfit",
    fontSize: 12,
    fontWeight: "400",
    color: "#7F909F",
    marginTop: px2hp(2),
  },
});
