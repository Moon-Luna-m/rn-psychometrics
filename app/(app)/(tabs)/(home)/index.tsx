import DigitalAssistant from "@/components/home/DigitalAssistant";
import Popular from "@/components/home/Popular";
import SearchBar from "@/components/home/SearchBar";
import TodayRecommend from "@/components/home/TodayRecommend";
import {
  GetTestListByTypeResponse,
  testService,
} from "@/services/testServices";
import { px2hp, px2wp } from "@/utils/common";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ImageBackground, ScrollView, StyleSheet, View } from "react-native";

export default function () {
  const scrollViewRef = useRef<ScrollView>(null);
  const [recommendList, setRecommendList] = useState<
    GetTestListByTypeResponse["list"]
  >([]);
  const [popularList, setPopularList] = useState<
    GetTestListByTypeResponse["list"]
  >([]);
  const [loading, setLoading] = useState(false);

  const getRecommendList = async () => {
    const res = await testService.getTestListByType({
      rec: true,
      page: 1,
      size: 15,
    });
    if (res.code === 200) {
      setRecommendList(res.data.list);
    }
  };

  const getPopularList = async () => {
    const res = await testService.getTestListByType({
      popular: true,
      page: 1,
      size: 30,
    });
    if (res.code === 200) {
      setPopularList(res.data.list);
    }
  };

  const getList = async () => {
    setLoading(true);
    await Promise.all([getRecommendList(), getPopularList()]);
    setLoading(false);
  };

  const handlePress = () => {
    router.push("/search");
  };

  useFocusEffect(
    useCallback(() => {
      getList();
      // 页面聚焦时滚动到顶部
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/home/bg.png")}
        style={styles.gradient}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <DigitalAssistant onPress={() => {
          // router.push("/chat")
          router.push({
            pathname: "/test/start/[id]",
            params: {
              id: "1",
            },
          });
        }} />
        <View style={styles.searchContainer}>
          <SearchBar handlePress={handlePress} disabled />
        </View>
        <ScrollView ref={scrollViewRef}>
          <TodayRecommend data={recommendList} />
          <Popular data={popularList} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    width: px2wp(375),
    height: px2hp(260),
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: px2wp(16),
    marginTop: px2hp(-20),
    marginBottom: px2hp(12),
  },
});
