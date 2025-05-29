import { logout, selectUserInfo } from "@/store/slices/userSlice";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function () {
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();

  return (
    <SafeAreaView>
      <Text
        style={{ color: "red" }}
        onPress={async () => {
          dispatch(logout());
        }}
      >
        {JSON.stringify(userInfo)}
      </Text>
    </SafeAreaView>
  );
}
