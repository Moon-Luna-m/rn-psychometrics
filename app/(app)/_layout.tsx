import { selectIsLoading, selectUserInfo } from "@/store/slices/userSlice";
import { Redirect, Stack, usePathname } from "expo-router";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

export default function AppLayout() {
  const userInfo = useSelector(selectUserInfo);
  const loading = useSelector(selectIsLoading);
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (!userInfo) {
    return <Redirect href="/user/signIn" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="(tabs)"
    />
  );
}
