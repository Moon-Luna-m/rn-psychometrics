import { Tabs } from "@/components/ui/Tabs";
import {
  GetUserTestHistoryResponse,
  testService,
} from "@/services/testServices";
import { formatDate, formatDateTime, px2hp, px2wp } from "@/utils/common";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// 自定义 hook 用于管理列表数据和加载状态
const useReviewList = (
  type: "completed" | "incomplete",
  onCountChange: (count: number) => void
) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<GetUserTestHistoryResponse["list"]>([]);

  // 重置状态
  const resetState = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setLoading(false);
    setRefreshing(false);
  }, []);

  // 刷新数据
  const onRefresh = useCallback(
    async (loading?: boolean) => {
      if (loading) return;
      setRefreshing(loading ?? true);
      try {
        const res = await testService.getUserTestHistory({
          status: type === "completed" ? 1 : 0,
          page: 1,
          size: 20,
        });
        if (res.code === 200) {
          setData(res.data.list);
          setPage(1);
          setHasMore(res.data.list.length < res.data.count);
          onCountChange(res.data.count);
        }
      } catch (error) {
        console.error(`Refresh error for ${type}:`, error);
      } finally {
        setRefreshing(loading ?? true);
      }
    },
    [type, loading, onCountChange]
  );

  // 加载更多
  const onLoadMore = useCallback(async () => {
    if (loading || !hasMore || refreshing) return;

    setLoading(true);
    try {
      const res = await testService.getUserTestHistory({
        status: type === "completed" ? 1 : 0,
        page: page + 1,
        size: 20,
      });

      if (res.code === 200) {
        const newData = res.data.list || [];
        setData((prev) => [...prev, ...newData]);
        setPage((prev) => prev + 1);
        setHasMore(data.length + newData.length < res.data.count);
        onCountChange(res.data.count);
      }
    } catch (error) {
      console.error(`Load more error for ${type}:`, error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, type, refreshing, data.length, onCountChange]);

  return {
    data,
    refreshing,
    loading,
    hasMore,
    onRefresh,
    onLoadMore,
    resetState,
  };
};

export default function Review() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeTab, setActiveTab] = useState<"completed" | "incomplete">(
    "completed"
  );
  const [completedCount, setCompletedCount] = useState(0);
  const [incompleteCount, setIncompleteCount] = useState(0);
  const isFirstLoad = useRef(true);

  // 使用自定义 hook 管理不同 tab 的数据
  const completedList = useReviewList("completed", setCompletedCount);
  const incompleteList = useReviewList("incomplete", setIncompleteCount);

  // 初始化数据
  useEffect(() => {
    async function initData() {
      await completedList.onRefresh(false);
      await incompleteList.onRefresh(false);
      isFirstLoad.current = false;
    }
    initData();
  }, []);

  const tabs = useMemo(
    () => [
      {
        key: "completed",
        title: t("review.tabs.completed", { count: completedCount }),
      },
      {
        key: "incomplete",
        title: t("review.tabs.incomplete", { count: incompleteCount }),
      },
    ],
    [t, completedCount, incompleteCount]
  );

  // 根据当前激活的 tab 获取对应的数据和方法
  const currentList =
    activeTab === "completed" ? completedList : incompleteList;

  // 处理滚动事件
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;

      // 只有当内容高度大于视图高度时才检查是否需要加载更多
      if (contentSize.height <= layoutMeasurement.height) {
        return;
      }

      const distanceFromBottom =
        contentSize.height - layoutMeasurement.height - contentOffset.y;

      if (
        distanceFromBottom < 50 &&
        !currentList.loading &&
        currentList.hasMore
      ) {
        currentList.onLoadMore();
      }
    },
    [currentList]
  );

  // 处理 tab 切换
  const handleTabChange = useCallback(
    (key: string) => {
      // 重置当前列表状态
      currentList.resetState();
      // 切换标签
      setActiveTab(key as "completed" | "incomplete");
      // 立即滚动到顶部，不需要动画
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
    },
    [currentList]
  );

  // 监听标签变化，重新请求数据（仅在非首次加载时执行）
  useEffect(() => {
    if (!isFirstLoad.current) {
      currentList.onRefresh(false);
    }
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#B7FFDD", "#F5F7FA"]} style={styles.gradient} />
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backContainer}
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons name="arrow-back-outline" size={24} color="black" />
          <Text style={styles.backText}>{t("review.title")}</Text>
        </TouchableOpacity>
        <Tabs
          tabs={tabs}
          activeKey={activeTab}
          onChange={handleTabChange}
          containerStyle={styles.typeSwitch}
        />
        <ScrollView
          ref={scrollViewRef}
          style={[
            styles.scrollView,
            Platform.OS === "web" && styles.webScrollView,
          ]}
          refreshControl={
            Platform.OS !== "web" ? (
              <RefreshControl
                refreshing={currentList.refreshing}
                onRefresh={currentList.onRefresh}
                colors={["#19DBF2"]}
                tintColor="#19DBF2"
                titleColor="#19DBF2"
              />
            ) : undefined
          }
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          {currentList.data.map((item) => (
            <ReviewCard key={item.id} item={item} type={activeTab} />
          ))}
          {currentList.loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#19DBF2" />
              <Text style={styles.loadingText}>{t("common.loading")}</Text>
            </View>
          )}
          {!currentList.hasMore && currentList.data.length > 0 && (
            <Text style={styles.noMoreText}>{t("common.noMoreData")}</Text>
          )}
          <View style={{ height: insets.bottom + 0 }} />
        </ScrollView>
      </View>
    </View>
  );
}

function ReviewCard({
  item,
  type,
}: {
  item: GetUserTestHistoryResponse["list"][0];
  type: "completed" | "incomplete";
}) {
  const { t } = useTranslation();

  const date = formatDate(item.start_time);
  const time = formatDateTime(item.start_time, "HH:mm:ss");

  if (type === "incomplete") {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.test_name}
            </Text>
            <Text style={styles.cardDescription} numberOfLines={2}>
              {item.test_desc}
            </Text>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{date}</Text>
              <Text style={styles.timeText}>{time}</Text>
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.5}>
            <View style={styles.warningIcon}>
              <MaterialIcons name="delete-outline" size={24} color="#EB5735" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.progressSection}>
          <LinearGradient
            colors={["#FAFEFF", "#E2FBFF"]}
            style={styles.progressGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View style={styles.progressWrapper}>
              <View style={styles.progressHeader}>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressLabel}>
                    {t("review.card.progress")}:
                  </Text>
                  <View style={styles.progressNumbers}>
                    <Text style={styles.progressCurrent}>
                      {item.progress || 0}
                    </Text>
                    <Text style={styles.progressSeparator}>/</Text>
                    <Text style={styles.progressTotal}>
                      {item.question_count || 0}
                    </Text>
                  </View>
                </View>
                <Text style={styles.progressPercentage}>
                  {Math.round(
                    ((item.progress || 0) / (item.question_count || 0)) * 100
                  )}
                  %
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${Math.round(
                        ((item.progress || 0) / (item.question_count || 0)) *
                          100
                      )}%`,
                    },
                  ]}
                />
              </View>
            </View>
            <Button
              mode="contained"
              style={styles.continueButton}
              contentStyle={styles.continueButtonContent}
              labelStyle={styles.continueButtonText}
              onPress={() => {}}
            >
              {t("review.card.continue")}
            </Button>
          </LinearGradient>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.test_name}
          </Text>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.test_desc}
          </Text>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{date}</Text>
            <Text style={styles.timeText}>{time}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.detailsButton} activeOpacity={0.5}>
          <Text style={styles.detailsText}>{t("review.card.details")}</Text>
          <AntDesign name="arrowright" size={16} color="#19DBF2" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardActions}>
        <Button
          mode="outlined"
          style={styles.generateButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.generateButtonText}
          rippleColor="rgba(0, 0, 0, 0.03)"
          onPress={() => {
            router.push(`/test/result/${item.test_id}`);
          }}
        >
          {t("review.card.generateReport")}
        </Button>
        <Button
          mode="contained"
          style={styles.testAgainButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.testAgainButtonText}
          onPress={() => {
            router.push(`/test/start/${item.test_id}`);
          }}
        >
          {t("review.card.testAgain")}
        </Button>
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
    width: px2wp(375),
    height: px2hp(375),
    left: 0,
    top: 0,
  },
  content: {
    flex: 1,
  },
  backContainer: {
    position: "relative",
    height: px2hp(44),
    width: "100%",
    paddingHorizontal: px2wp(16),
    justifyContent: "center",
  },
  backText: {
    position: "absolute",
    inset: 0,
    textAlign: "center",
    paddingVertical: px2hp(10),
    fontSize: 18,
    color: "#0C0A09",
    fontWeight: "700",
  },
  typeSwitch: {
    marginHorizontal: px2hp(24),
    marginTop: px2hp(12),
    marginBottom: px2hp(20),
  },
  scrollView: {
    flex: 1,
    gap: px2hp(20),
    paddingHorizontal: px2wp(16),
  },
  card: {
    height: 161,
    backgroundColor: "#FFFFFF",
    borderRadius: px2wp(20),
    padding: px2wp(12),
    marginBottom: px2hp(20),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: px2hp(12),
    gap: px2wp(12),
  },
  cardInfo: {
    flex: 1,
    gap: px2hp(4),
  },
  cardTitle: {
    fontFamily: "Outfit",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600",
    color: "#0C0A09",
  },
  cardDescription: {
    height: 32,
    fontFamily: "Outfit",
    fontSize: 12,
    lineHeight: 15,
    color: "#7F909F",
  },
  timeContainer: {
    flexDirection: "row",
    gap: px2wp(8),
    marginTop: px2hp(12),
  },
  timeText: {
    fontFamily: "Outfit",
    fontSize: 10,
    lineHeight: 13,
    color: "rgba(12, 10, 9, 0.16)",
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: px2wp(100),
    paddingVertical: px2hp(8),
    paddingLeft: px2wp(12),
    paddingRight: px2wp(6),
    gap: px2wp(2),
  },
  detailsText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    color: "#19DBF2",
  },
  cardActions: {
    flexDirection: "row",
    gap: px2wp(8),
  },
  generateButton: {
    flex: 1,
    borderRadius: px2wp(78),
    borderColor: "#19DBF2",
  },
  testAgainButton: {
    flex: 1,
    borderRadius: px2wp(78),
    backgroundColor: "#19DBF2",
  },
  buttonContent: {
    height: px2hp(40),
  },
  generateButtonText: {
    fontFamily: "Outfit",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600",
    color: "#19DBF2",
    textTransform: "capitalize",
  },
  testAgainButtonText: {
    fontFamily: "Outfit",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textTransform: "capitalize",
  },
  loadingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: px2hp(12),
    gap: px2wp(8),
  },
  loadingText: {
    fontSize: 14,
    color: "#7F909F",
    fontFamily: "Outfit",
  },
  noMoreText: {
    textAlign: "center",
    fontSize: 14,
    color: "#7F909F",
    fontFamily: "Outfit",
    padding: px2hp(12),
  },
  webScrollView: {
    paddingTop: 0,
    marginTop: 0,
  },
  progressSection: {
    flexDirection: "row",
    alignContent: "center",
    borderRadius: px2wp(12),
    borderWidth: 1,
    borderColor: "#F5F7FA",
  },
  progressGradient: {
    flex: 1,
    flexDirection: "row",
    padding: px2hp(12),
    borderRadius: px2wp(12),
    gap: px2wp(24),
  },
  progressWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: px2hp(4),
  },
  progressInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: px2wp(4),
  },
  progressLabel: {
    fontFamily: "Outfit",
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "700",
    color: "#0C0A09",
  },
  progressNumbers: {
    flexDirection: "row",
    alignItems: "center",
    gap: px2wp(2),
  },
  progressCurrent: {
    fontFamily: "Outfit",
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "600",
    color: "#0C0A09",
  },
  progressSeparator: {
    fontFamily: "Outfit",
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "500",
    color: "rgba(12, 10, 9, 0.16)",
  },
  progressTotal: {
    fontFamily: "Outfit",
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "400",
    color: "rgba(12, 10, 9, 0.16)",
  },
  progressPercentage: {
    fontFamily: "Outfit",
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "400",
    color: "#19DBF2",
  },
  progressBarContainer: {
    height: px2hp(6),
    backgroundColor: "#FFFFFF",
    borderRadius: px2wp(8),
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#19DBF2",
    borderRadius: px2wp(8),
  },
  continueButton: {
    height: px2hp(32),
    borderRadius: px2wp(100),
    backgroundColor: "#19DBF2",
  },
  continueButtonContent: {
    margin: 0,
  },
  continueButtonText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 14,
    marginHorizontal: px2wp(10),
  },
  warningIcon: {
    width: px2wp(32),
    height: px2hp(32),
    borderRadius: px2wp(100),
    backgroundColor: "#F5F7FA",
    justifyContent: "center",
    alignItems: "center",
  },
});
