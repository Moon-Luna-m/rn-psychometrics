import { logout, selectUserInfo } from "@/store/slices/userSlice";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function () {
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();

  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{ color: "red" }}
        onPress={async () => {
          dispatch(logout());
        }}
      >
        {JSON.stringify(userInfo)}
      </Text>
    </View>
  );
}

