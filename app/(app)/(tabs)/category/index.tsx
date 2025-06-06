import SearchResultCard from "@/components/home/SearchResultCard";
import {
  GetTestListByTypeResponse,
  testService,
} from "@/services/testServices";
import { px2hp, px2wp } from "@/utils/common";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Route, TabBar, TabView } from "react-native-tab-view";

interface TabRoute extends Route {
  title: string;
}

const initialLayout = {
  width: Dimensions.get("window").width,
};

const TabContent = ({ route }: { route: TabRoute }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<GetTestListByTypeResponse["list"]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const resetState = useCallback(() => {
    setData([]);
    setCurrentPage(1);
    setHasMore(true);
    setIsLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      resetState();
      fetchData(1, true);
      return () => {
        // 页面失焦时清理状态
        resetState();
      };
    }, [resetState])
  );

  const fetchData = async (page: number, isRefresh = false) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await testService.getTestListByType({
        type_id: Number(route.key),
        page,
        size: 20,
      });
      if (res.code === 200) {
        const newData = res.data.list;
        if (isRefresh) {
          setData(newData);
        } else {
          setData((prev) => [...prev, ...newData]);
        }
      }
      setHasMore(res.data.list.length > 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    if (isLoading) return;
    setRefreshing(true);
    resetState();
    fetchData(1, true);
  }, [isLoading, resetState]);

  const loadMore = () => {
    if (isLoading || !hasMore) return;
    fetchData(currentPage + 1);
  };

  useEffect(() => {
    resetState();
    fetchData(1, true);
  }, [route.key, resetState]);

  const renderItem = ({
    item,
  }: {
    item: GetTestListByTypeResponse["list"][0];
  }) => (
    <View style={styles.cardContainer}>
      <SearchResultCard
        item={item}
        onPress={() => {
          console.log("Selected test:", item.id);
        }}
      />
    </View>
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator color="#0C0A09" />
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.resultList}
      showsVerticalScrollIndicator={false}
      onEndReached={loadMore}
      onEndReachedThreshold={0.2}
      ListFooterComponent={renderFooter}
      numColumns={2}
      columnWrapperStyle={styles.row}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const renderScene = ({ route }: { route: TabRoute }) => (
  <TabContent route={route} />
);

export default function Category() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState<TabRoute[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const progress = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const getTestTypeList = async () => {
    const res = await testService.getTestTypeList({
      page: 1,
      size: 20,
    });
    if (res.code === 200) {
      setRoutes(
        res.data.list.map((item) => ({
          key: item.id.toString(),
          title: item.name,
        }))
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        // 重置分类页的状态
        setIndex(0);
        setShowAllCategories(false);
        progress.value = 0;
        getTestTypeList();
      };
    }, [])
  );

  useEffect(() => {
    progress.value = withTiming(showAllCategories ? 1 : 0, {
      duration: 200,
    });
  }, [showAllCategories]);

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(
          progress.value,
          [0, 1],
          [0, 180],
          Extrapolation.CLAMP
        )}deg`,
      },
    ],
  }));

  const toggleExpand = useCallback(() => {
    setShowAllCategories((prev) => !prev);
  }, []);

  const handleCategoryPress = useCallback(
    (key: string) => {
      const newIndex = routes.findIndex((route) => route.key === key);
      setIndex(newIndex);
      setShowAllCategories(false);
    },
    [routes]
  );

  const renderTabBar = useCallback(
    (props: any) => (
      <View style={styles.tabBarContainer}>
        <TabBar
          {...props}
          scrollEnabled
          style={styles.tabBar}
          tabStyle={styles.tab}
          activeColor="#0C0A09"
          inactiveColor="#7F909F"
          indicatorStyle={styles.indicator}
          renderLabel={({
            route,
            focused,
          }: {
            route: TabRoute;
            focused: boolean;
          }) => (
            <Text style={[styles.label, focused && styles.labelActive]}>
              {route.title}
            </Text>
          )}
          pressColor="transparent"
          pressOpacity={1}
          gap={16}
        />
        <LinearGradient
          colors={["rgba(245, 247, 250, 0)", "rgba(245, 247, 250, 1)"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 0.5, y: 0.5 }}
          style={styles.gradient}
          pointerEvents="none"
        />
        <TouchableOpacity
          style={styles.expandButton}
          onPress={toggleExpand}
          activeOpacity={0.7}
        >
          <Animated.View style={arrowStyle}>
            <AntDesign name="down" size={24} color="#333333" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabViewContainer}>
        {routes.length > 0 && (
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
          />
        )}
        <Modal
          visible={showAllCategories}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAllCategories(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.overlay}
              activeOpacity={1}
              onPress={() => setShowAllCategories(false)}
            />
            <Animated.View
              style={[
                styles.expandPanel,
                {
                  paddingTop: insets.top,
                },
              ]}
            >
              <View style={styles.expandHeader}>
                <Text style={styles.expandTitle}>All Categories</Text>
                <TouchableOpacity
                  style={styles.expandButton}
                  onPress={() => setShowAllCategories(false)}
                  activeOpacity={0.7}
                >
                  <Animated.View style={arrowStyle}>
                    <AntDesign name="down" size={24} color="#333333" />
                  </Animated.View>
                </TouchableOpacity>
              </View>
              <View style={styles.categoryList}>
                {routes.map((tab) => {
                  const isActive =
                    index ===
                    routes.findIndex((route) => route.key === tab.key);
                  return (
                    <TouchableOpacity
                      key={tab.key}
                      style={[
                        styles.categoryItem,
                        isActive && styles.categoryItemActive,
                      ]}
                      onPress={() => handleCategoryPress(tab.key)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          isActive && styles.categoryTextActive,
                        ]}
                      >
                        {tab.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Animated.View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  tabViewContainer: {
    flex: 1,
    paddingHorizontal: px2wp(16),
  },
  scene: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBarContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    height: px2hp(44),
    backgroundColor: "#F5F7FA",
    flex: 1,
  },
  tab: {
    width: "auto",
    padding: 0,
    minHeight: px2hp(44),
  },
  indicator: {
    bottom: 12,
    backgroundColor: "#19DBF2",
  },
  label: {
    fontFamily: "Outfit",
    fontSize: px2wp(16),
    lineHeight: px2wp(20),
    textTransform: "none",
    textAlign: "center",
    fontWeight: "400",
  },
  labelActive: {
    fontWeight: "600",
  },
  gradient: {
    position: "absolute",
    right: 0,
    width: px2wp(44),
    height: "100%",
    zIndex: 100,
  },
  expandButton: {
    zIndex: 101,
  },
  modalContainer: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  expandHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: px2wp(16),
    height: px2hp(44),
  },
  expandTitle: {
    flex: 1,
    fontFamily: "Outfit",
    fontSize: px2wp(18),
    lineHeight: px2wp(22.68),
    fontWeight: "600",
    color: "#0C0A09",
  },
  expandPanel: {
    backgroundColor: "#F5F7FA",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  categoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: px2wp(12),
    padding: px2wp(16),
    paddingVertical: px2wp(20),
    backgroundColor: "#F5F7FA",
  },
  categoryItem: {
    backgroundColor: "#FFFFFF",
    paddingVertical: px2hp(6),
    paddingHorizontal: px2wp(12),
    borderRadius: px2wp(44),
  },
  categoryItemActive: {
    backgroundColor: "#19DBF2",
  },
  categoryText: {
    fontFamily: "Outfit",
    fontSize: px2wp(14),
    lineHeight: px2wp(17.64),
    fontWeight: "500",
    color: "#7F909F",
  },
  categoryTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  cardContainer: {
    flex: 1,
  },
  resultList: {
    paddingTop: px2wp(12),
  },
  row: {
    gap: px2wp(12),
    marginBottom: px2wp(12),
  },
  footer: {
    paddingVertical: px2wp(16),
    alignItems: "center",
  },
});
