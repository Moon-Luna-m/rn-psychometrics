import ErrorMessage from "@/components/ErrorMessage";
import { userService } from "@/services/userService";
import {
  clearLocalCache,
  decrypt,
  getLocalCache,
  px2hp,
  px2wp,
} from "@/utils/common";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [focusIndex, setFocusIndex] = useState<number>(0);
  const inputRef = useRef<TextInput>(null);
  const [error, setError] = useState<boolean>(false);

  // 点击某个输入框
  const handleBoxPress = (index: number) => {
    setFocusIndex(index);
    inputRef.current?.focus();
  };

  // 处理验证码输入
  const handleCodeChange = (text: string) => {
    // 只允许输入数字
    const newText = text.replace(/[^0-9]/g, "");
    if (!newText) return;

    // 获取最后输入的数字
    const lastChar = newText.slice(-1);
    setCode(code.map((_, index) => (index === focusIndex ? lastChar : _)));

    // 如果不是最后一位，自动移动到下一位
    if (focusIndex < 5) {
      setFocusIndex(focusIndex + 1);
    }
  };

  // 处理删除操作
  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === "Backspace") {
      const newCode = [...code];
      if (newCode[focusIndex]) {
        newCode[focusIndex] = "";
        setCode([...newCode]);
      }
      if (focusIndex > 0) {
        setFocusIndex(focusIndex - 1);
      }
    }
  };

  // 验证验证码
  const verifyCode = async () => {
    const verifyCode = code.join("");
    const info = await getLocalCache("user_register_info");
    if (info) {
      const { email, password } = JSON.parse(decrypt(info));
      const res = await userService.register({
        code: verifyCode,
        email,
        password,
      });
      if (res.code === 200) {
        await clearLocalCache("user_register_info");
        router.replace({
          pathname: "/user/verify/[params]",
          params: { params: "register" },
        });
      }
    }
  };

  // 自动聚焦输入框
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const getEmail = async () => {
      const info = await getLocalCache("user_register_info");
      if (info) {
        const { email } = JSON.parse(decrypt(info));
        setEmail(email);
      }
    };
    getEmail();
  }, []);

  useEffect(() => {
    const complete = code.every((item) => item !== "");
    if (complete) {
      verifyCode();
    }
  }, [code]);

  // 渲染单个验证码框
  const renderCodeBox = (index: number) => {
    const digit = code[index];
    const isActive = focusIndex === index;

    const cursorAnimatedStyle = useAnimatedStyle(() => ({
      opacity: withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0, { duration: 500 })
        ),
        -1, // -1 表示无限重复
        true // true 表示反向动画
      ),
    }));

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.8}
        onPress={() => handleBoxPress(index)}
        style={[
          styles.codeBox,
          isActive && styles.codeBoxActive,
          error && styles.codeBoxError,
        ]}
      >
        {digit.trim() ? (
          <Text style={styles.codeText}>{digit}</Text>
        ) : isActive ? (
          <Animated.View
            style={[
              styles.cursor,
              error && styles.cursorError,
              cursorAnimatedStyle,
            ]}
          />
        ) : null}
      </TouchableOpacity>
    );
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
            <Text style={styles.title}>{t("form.verify.title")}</Text>
            <Text style={styles.subtitle}>
              <Trans
                i18nKey="form.verify.subtitle"
                values={{
                  email,
                }}
                components={[<Text style={{ color: "#0C0A09" }}>{email}</Text>]}
              />
            </Text>
          </View>

          {/* 验证码输入区 */}
          <View style={styles.codeContainer}>
            <View style={styles.codeBoxesContainer}>
              {Array(6)
                .fill(null)
                .map((_, index) => renderCodeBox(index))}
            </View>
            <TextInput
              ref={inputRef}
              value=""
              onChangeText={handleCodeChange}
              onKeyPress={handleKeyPress}
              style={styles.hiddenInput}
              keyboardType="number-pad"
              onFocus={() => {
                // 如果没有输入任何内容，从第一个开始
                if (!code) {
                  setFocusIndex(0);
                }
              }}
            />
          </View>
          <View style={styles.errorContainer}>
            <ErrorMessage visible={error} message={t("form.verify.error")} />
          </View>
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
  codeContainer: {
    marginTop: px2hp(56),
  },
  codeBoxesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  codeBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  codeBoxActive: {
    borderColor: "#19DBF2",
  },
  codeBoxError: {
    borderColor: "#EB5735",
  },
  codeText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#0C0A09",
    lineHeight: 28,
  },
  cursor: {
    width: 2,
    height: 18,
    backgroundColor: "#19DBF2",
  },
  cursorError: {
    backgroundColor: "#EB5735",
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
    top: 0,
    left: 0,
  },
  errorContainer: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#EB5735",
  },
});
