import {
  useFocusEffect,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, Text } from "react-native";

export default function StartTest() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const params = useLocalSearchParams();

  // 监听页面焦点变化
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (Platform.OS === "web") {
          console.log("Page unfocused");
          // 在这里添加页面离开时的业务逻辑
        }
      };
    }, [])
  );

  useEffect(() => {
    if (Platform.OS === "web") {
      // 处理页面刷新
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        console.log("beforeunload");
      };
      // 添加事件监听
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        // 清理事件监听
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, []);

  return (
    <Pressable onPress={() => router.back()}>
    <Text>StartTest</Text>
  </Pressable>
  );
}
