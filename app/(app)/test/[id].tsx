import SearchResultCard from "@/components/home/SearchResultCard";
import AnalysisCard from "@/components/test/AnalysisCard";
import AvatarCard from "@/components/test/AvatarCard";
import BadgeCard from "@/components/test/BadgeCard";
import FAQCard from "@/components/test/FAQCard";
import GrowthPathCard from "@/components/test/GrowthPathCard";
import Header from "@/components/test/Header";
import PersonalizedAdvice from "@/components/test/PersonalizedAdvice";
import RadarCard from "@/components/test/RadarCard";
import ShareSheet from "@/components/test/ShareSheet";
import SpiritualInspiration from "@/components/test/SpiritualInspiration";
import TestInfoCard from "@/components/test/TestInfoCard";
import TextProgressCard from "@/components/test/TextProgressCard";
import TraitCard from "@/components/test/TraitCard";
import VisualDashboard from "@/components/test/VisualDashboard";
import { mockDataFn } from "@/constants/MockData";
import { shareService } from "@/services/shareServices";
import {
  BlockType,
  TestDetailResponse,
  testService,
} from "@/services/testServices";
import { formatDuration, px2hp, setLocalCache } from "@/utils/common";
import { getTestTypeKey } from "@/utils/reportTransformer";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const SCROLL_THRESHOLD = Platform.OS === "web" ? 180 : 120;

export default function TestDetailsPage() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [showShare, setShowShare] = useState(false);
  const scrollY = useSharedValue(0);
  const [testData, setTestData] = useState<TestDetailResponse | null>(null);
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerBackgroundAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      ["transparent", "#FFFFFF"]
    );

    return {
      backgroundColor: backgroundColor,
    };
  });

  const headerColorAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      ["#FFFFFF", "#0D120E"]
    );

    return {
      color: color,
    };
  });

  const mockData = mockDataFn(t);
  const renderComponent = (type: BlockType, data?: any) => {
    switch (type) {
      case "MatchingResultBlock":
        return <AvatarCard />;
      case "KeywordTagBlock":
        return <TraitCard traits={mockData.traits} />;
      case "RadarChartBlock":
        return <RadarCard data={mockData.radar} />;
      case "QuoteImageBlock":
        return <SpiritualInspiration />;
      case "RecommendationBox":
        return (
          <PersonalizedAdvice
            title={mockData.recommendations.title}
            adviceItems={mockData.recommendations.adviceItems}
          />
        );
      case "BadgeBlock":
        return <BadgeCard badges={mockData.badges} />;
      case "GrowthPathBlock":
        return (
          <GrowthPathCard
            currentStage={mockData.growthPath.currentStage}
            stages={mockData.growthPath.stages}
          />
        );
      case "TextProgressBlock":
        return (
          <TextProgressCard
            title={mockData.textProgress.title}
            subtitle={mockData.textProgress.subtitle}
            items={mockData.textProgress.items}
          />
        );
      case "VisualMeterBlock":
        return (
          <VisualDashboard
            title={mockData.visualDashboard.title}
            value={mockData.visualDashboard.value}
            level={mockData.visualDashboard.level}
            // completionRate={
            //   data?.completionRate ?? mockData.visualDashboard.completionRate
            // }
          />
        );
      case "MultiDimensionalBlock":
        return <AnalysisCard dimensions={mockData.dimensions} />;
    }
  };

  const handleShare = async (method: string) => {
    try {
      // 先关闭分享面板，避免界面卡住
      setShowShare(false);

      // 生成分享链接
      const shareRes = await shareService.generateShareLink({
        platform: method.toUpperCase(),
        target_id: testData?.id || 0,
        target_type: "TEST",
        title: testData?.name || "",
      });

      if (shareRes.code !== 200) {
        throw new Error(shareRes.message);
      }

      // 执行系统分享
      const result = await Share.share({
        message: t("test.share.message"),
        url: shareRes.data.share_link,
        title: testData?.name || t("test.share.title"),
      });

      // 处理分享结果
      if (result.action === Share.sharedAction) {
        // 记录分享点击
        await shareService.clickShare({
          share_code: Number(shareRes.data.share_code),
        });
      }
    } catch (error: any) {
      console.error("Share failed:", error.message);
    }
  };

  const handleHeaderPress = async (type: "share" | "collect") => {
    if (type === "share") {
      setShowShare(true);
    } else if (type === "collect") {
      if (!testData) return;
      let res: any;
      if (testData?.is_favorited) {
        res = await testService.deleteTestFromFavorite({
          test_id: testData.id,
        });
      } else {
        res = await testService.addTestToFavorite({ test_id: testData.id });
      }
      if (res.code === 200) {
        setTestData({ ...testData, is_favorited: !testData.is_favorited });
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const getTestData = async () => {
      const response = await testService.getTestList({ id: Number(id) });
      if (response.code === 200) {
        setTestData(response.data);
      }
    };
    getTestData();
    setIsLoading(false);
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#19DBF2" />
        </View>
      ) : (
        <>
          <Header
            insetTop={insets.top}
            bg={mockData.header.bg}
            color={mockData.header.color}
            onPress={handleHeaderPress}
            headerBackgroundAnimatedStyle={headerBackgroundAnimatedStyle}
            headerColorAnimatedStyle={headerColorAnimatedStyle}
            isCollect={testData?.is_favorited}
            title={t("test.testDetail")}
          />
          <Animated.ScrollView
            style={[styles.scrollView, { marginTop: insets.top + 44 }]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
          >
            {testData && (
              <>
                {
                  <SearchResultCard
                    showIcon={false}
                    item={{
                      id: testData?.id,
                      type_id: testData?.type_id,
                      name: testData?.name,
                      desc: testData?.desc,
                      image: testData?.image,
                      price: testData?.price,
                      discount_price: testData?.discount_price,
                      question_count: testData?.question_count,
                      answer_time: testData?.answer_time,
                      star: testData?.star,
                      total: testData?.total,
                      user_avatars: testData?.user_avatars,
                    }}
                    disabled={true}
                  />
                }
                <TestInfoCard
                  questionCount={testData?.question_count}
                  estimatedTime={formatDuration(testData?.answer_time)}
                  tags={[
                    t(`test.types.${getTestTypeKey(testData?.type_id)}.name`),
                  ]}
                />
                {testData?.component_types.map((type) => (
                  <Fragment key={type}>{renderComponent(type)}</Fragment>
                ))}
                <FAQCard faqs={mockData.faqs} />
                <View style={{ height: 50 + insets.bottom }} />
              </>
            )}
          </Animated.ScrollView>
          <LinearGradient
            colors={["rgba(255,255,255,0)", "#FFFFFF"]}
            style={styles.buttonContainer}
            locations={[0, 0.7]}
          >
            <TouchableHighlight
              style={styles.buyButton}
              underlayColor="#19DBF2"
              activeOpacity={0.5}
              onPress={async () => {
                await setLocalCache("user_test_way", "system");
                router.push(`/test/start/${testData?.id}`);
              }}
            >
              <Text style={styles.buyButtonText}>{t("test.start")}</Text>
            </TouchableHighlight>
          </LinearGradient>
        </>
      )}

      <ShareSheet
        isVisible={showShare}
        onClose={() => setShowShare(false)}
        onShare={handleShare}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS !== "web" ? 120 : 180,
  },
  content: {
    gap: px2hp(20),
    paddingBottom: 90, // 为底部按钮留出空间
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 34, // 适配底部安全区域
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  shareButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 78,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#19DBF2",
  },
  shareButtonText: {
    color: "#19DBF2",
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
    fontFamily: "Outfit",
  },
  buyButton: {
    height: 48,
    backgroundColor: "#19DBF2",
    borderRadius: 78,
    alignItems: "center",
    justifyContent: "center",
  },
  buyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
    fontFamily: "Outfit",
  },
});
