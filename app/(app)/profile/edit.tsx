import { router } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Edit() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", position: "relative", height: "100%" }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#000" }} onPress={() => router.back()}>
          编辑个人资料
        </Text>
      </View>
    </SafeAreaView>
  );
}
