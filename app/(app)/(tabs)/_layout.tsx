import CategoryIcon from "@/components/tabs/CategoryIcon";
import HomeIcon from "@/components/tabs/HomeIcon";
import ProfileIcon from "@/components/tabs/ProfileIcon";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      initialRouteName="(home)/index"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 64,
          paddingHorizontal: 24,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: "#FFFFFF",
          borderTopColor: "#F3F4F6",
          borderTopWidth: 1,
          marginBottom: insets.bottom,
        },
        tabBarItemStyle: {
          gap: 2,
        },
        tabBarActiveTintColor: "#19DBF2",
        tabBarInactiveTintColor: "#0C0A09",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "400",
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="(home)/index"
        options={{
          title: "首页",
          tabBarIcon: () => <HomeIcon />,
        }}
      />
      <Tabs.Screen
        name="category"
        options={{
          title: "分类",
          tabBarIcon: () => <CategoryIcon />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "我的",
          tabBarIcon: () => <ProfileIcon />,
        }}
      />
    </Tabs>
  );
}
