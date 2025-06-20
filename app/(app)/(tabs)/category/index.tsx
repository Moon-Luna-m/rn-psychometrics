import SearchResultCard from "@/components/home/SearchResultCard";
import {
  GetTestListByTypeResponse,
  testService,
} from "@/services/testServices";
import { px2hp, px2wp } from "@/utils/common";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import {
  useSafeAreaInsets
} from "react-native-safe-area-context";
import { Route, TabBar, TabView } from "react-native-tab-view";
import { useCategoryModal } from "../../../../components/providers/CategoryModalProvider";

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

    !isRefresh && setIsLoading(true);
    try {
      const res = await testService.getTestListByType({
        type_id: Number(route.key),
        page,
        size: 20,
      });
      if (res.code === 200) {
        const newData = res.data.list || [];
        if (isRefresh) {
          setData(newData);
        } else {
          setData((prev) => [...prev, ...newData]);
        }
      }
      setHasMore(page * 20 < res.data.count);
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
    fetchData(1, true);
  }, [isLoading, resetState]);

  const loadMore = () => {
    if (isLoading || !hasMore || refreshing) return;
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
    <View style={[styles.cardContainer, { width: "48%" }]}>
      <SearchResultCard
        item={item}
        onPress={() => {
          router.push({
            pathname: "/test/[id]",
            params: {
              id: item.id.toString(),
            },
          });
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
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState<TabRoute[]>([]);
  const progress = useSharedValue(0);
  const { showModal, hideModal, setOnSelect } = useCategoryModal();
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
      getTestTypeList();
      return () => {
        // 重置分类页的状态
        setIndex(0);
        progress.value = 0;
      };
    }, [])
  );
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

  const handleCategoryPress = useCallback(
    (key: string) => {
      const newIndex = routes.findIndex((route) => route.key === key);
      if (newIndex !== -1) {
        setIndex(newIndex);
      }
    },
    [routes, index]
  );

  useEffect(() => {
    setOnSelect(handleCategoryPress);
  }, [handleCategoryPress]);

  const handleExpandPress = useCallback(() => {
    showModal(routes, index);
  }, [routes, index, showModal]);

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
          onTabPress={({ route }) => {
            const newIndex = routes.findIndex((r) => r.key === route.key);
            if (newIndex !== -1) {
              setIndex(newIndex);
            }
          }}
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
          onPress={handleExpandPress}
          activeOpacity={0.7}
        >
          <Animated.View style={arrowStyle}>
            <AntDesign name="down" size={24} color="#333333" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    ),
    [routes, index, handleExpandPress, arrowStyle]
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.tabViewContainer}>
          {routes.length > 0 && (
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              renderTabBar={renderTabBar}
              onIndexChange={setIndex}
              initialLayout={initialLayout}
              swipeEnabled={false}
              animationEnabled={false}
            />
          )}
        </View>
      </View>
    </GestureHandlerRootView>
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
    bottom: 10,
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
  modalWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: -100, // 确保覆盖住底部 TabBar
    zIndex: 1000,
    elevation: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    elevation: 1000,
  },
  overlayTouch: {
    width: "100%",
    height: "100%",
  },
  expandPanel: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F5F7FA",
    borderBottomLeftRadius: px2wp(16),
    borderBottomRightRadius: px2wp(16),
    maxHeight: "80%",
    zIndex: 1001,
    elevation: 1001,
    ...Platform.select({
      android: {
        elevation: 24,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      },
    }),
  },
  expandHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: px2wp(16),
    height: px2hp(44),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  expandTitle: {
    flex: 1,
    fontFamily: "Outfit",
    fontSize: px2wp(18),
    lineHeight: px2wp(22.68),
    fontWeight: "600",
    color: "#0C0A09",
  },
  categoryListWrapper: {
    maxHeight: Dimensions.get("window").height * 0.6,
  },
  categoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: px2wp(12),
    padding: px2wp(16),
    paddingVertical: px2wp(20),
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
    marginBottom: px2wp(12),
  },
  resultList: {
    // paddingTop: px2wp(12),
    // paddingHorizontal: px2wp(8),
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 0,
  },
  footer: {
    paddingVertical: px2wp(16),
    alignItems: "center",
  },
});
