import SearchResultCard from "@/components/home/SearchResultCard";
import AnalysisCard from "@/components/test/AnalysisCard";
import AvatarCard from "@/components/test/AvatarCard";
import BadgeCard from "@/components/test/BadgeCard";
import FAQCard from "@/components/test/FAQCard";
import GrowthPathCard from "@/components/test/GrowthPathCard";
import Header from "@/components/test/Header";
import PersonalizedAdvice from "@/components/test/PersonalizedAdvice";
import PurchaseSheet from "@/components/test/PurchaseSheet";
import RadarCard from "@/components/test/RadarCard";
import ShareSheet from "@/components/test/ShareSheet";
import SpiritualInspiration from "@/components/test/SpiritualInspiration";
import TestInfoCard from "@/components/test/TestInfoCard";
import TextProgressCard from "@/components/test/TextProgressCard";
import TraitCard from "@/components/test/TraitCard";
import VisualDashboard from "@/components/test/VisualDashboard";
import {
  BlockType,
  TestDetailResponse,
  testService,
} from "@/services/testServices";
import { formatDuration, px2hp } from "@/utils/common";
import { getTestTypeKey } from "@/utils/reportTransformer";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
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
  const [showPurchase, setShowPurchase] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const scrollY = useSharedValue(0);
  const [testData, setTestData] = useState<TestDetailResponse | null>(null);
  const { id } = useLocalSearchParams();
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

  // Mock data for demonstration
  const mockData = {
    header: {
      bg: require("@/assets/images/test/bg-1.png"),
      color: ["#8257E5", "#271A45"] as any,
    },
    testInfo: {
      questionCount: 60,
      estimatedTime: "30",
      source: "MBTI",
      tags: [
        t("test.tags.personalityAnalysis"),
        t("test.tags.psychologicalAssessment"),
        t("test.tags.selfAwareness"),
      ],
    },
    avatar: {
      image: require("@/assets/images/test/question.png"),
    },
    report: {
      chartData: {
        labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
        data: [10, 15, 50, 15, 10, 20, 40, 20, 10],
      },
    },
    traits: [
      {
        icon: require("@/assets/images/test/trait1.png"),
        label: t("test.traits.innovativeThinking"),
        value: 85,
        color: "#8257E5",
        description: t("test.traits.innovativeThinkingDesc"),
      },
      {
        icon: require("@/assets/images/test/trait2.png"),
        label: t("test.traits.leadership"),
        value: 75,
        color: "#04D361",
        description: t("test.traits.leadershipDesc"),
      },
      {
        icon: require("@/assets/images/test/trait3.png"),
        label: t("test.traits.teamBuilder"),
        value: 90,
        color: "#FF963A",
        description: t("test.traits.teamBuilderDesc"),
      },
    ],
    dimensions: [
      {
        label: t("test.dimensions.leadership"),
        value: 85,
        color: "#AB8AFF",
        trend: "up" as any,
      },
      {
        label: t("test.dimensions.rolePerception"),
        value: 70,
        color: "#FFD76F",
        trend: "down" as any,
      },
      {
        label: t("test.dimensions.values"),
        value: 90,
        color: "#67C7FF",
        trend: "down" as any,
      },
      {
        label: t("test.dimensions.positiveness"),
        value: 95,
        color: "#00CEB6",
        trend: "up" as any,
      },
      {
        label: t("test.dimensions.emotionalManagement"),
        value: 45,
        color: "#FF8FAF",
        trend: "down" as any,
      },
    ],
    radar: [
      {
        label: t("test.radar.logicalThinking"),
        value: 82.1,
        color: "#8965E5",
      },
      {
        label: t("test.radar.executionAbility"),
        value: 92.3,
        color: "#FF6692",
      },
      {
        label: t("test.radar.decisionMaking"),
        value: 80.5,
        color: "#12B282",
      },
      {
        label: t("test.radar.emotionalManagement"),
        value: 86.2,
        color: "#FF52F3",
      },
      {
        label: t("test.radar.learningAdaptability"),
        value: 88.4,
        color: "#00C3FF",
      },
      {
        label: t("test.radar.teamwork"),
        value: 79.6,
        color: "#5289FF",
      },
      {
        label: t("test.radar.communication"),
        value: 93.6,
        color: "#8DC222",
      },
      {
        label: t("test.radar.innovativeThinking"),
        value: 97.4,
        color: "#FFC966",
      },
    ],
    faqs: [
      {
        icon: require("@/assets/images/test/faq.png"),
        question: t("test.faqs.scientific.question"),
        answer: t("test.faqs.scientific.answer"),
      },
      {
        icon: require("@/assets/images/test/faq.png"),
        question: t("test.faqs.accuracy.question"),
        answer: t("test.faqs.accuracy.answer"),
      },
      {
        icon: require("@/assets/images/test/faq.png"),
        question: t("test.faqs.duration.question"),
        answer: t("test.faqs.duration.answer"),
      },
    ],
    badges: [
      {
        icon: require("@/assets/images/badges/creative-thinking.png"),
        title: t("test.badges.creativeThinking.title"),
        description: t("test.badges.creativeThinking.description"),
      },
      {
        icon: require("@/assets/images/badges/adaptability.png"),
        title: t("test.badges.adaptability.title"),
        description: t("test.badges.adaptability.description"),
      },
      {
        icon: require("@/assets/images/badges/leadership.png"),
        title: t("test.badges.leadership.title"),
        description: t("test.badges.leadership.description"),
      },
      {
        icon: require("@/assets/images/badges/team-builder.png"),
        title: t("test.badges.teamBuilder.title"),
        description: t("test.badges.teamBuilder.description"),
      },
      {
        icon: require("@/assets/images/badges/communicator.png"),
        title: t("test.badges.communicator.title"),
        description: t("test.badges.communicator.description"),
      },
      {
        icon: require("@/assets/images/badges/learner.png"),
        title: t("test.badges.learner.title"),
        description: t("test.badges.learner.description"),
      },
    ],
    textProgress: {
      title: t("test.textProgress.title"),
      subtitle: t("test.textProgress.subtitle"),
      items: [
        {
          text: t("test.textProgress.items.unique"),
          color: "#00A1FF",
        },
        {
          text: t("test.textProgress.items.understanding"),
          color: "#00CEB6",
        },
        {
          text: t("test.textProgress.items.traits"),
          color: "#FFB900",
        },
        {
          text: t("test.textProgress.items.reflection"),
          color: "#FF6692",
        },
        {
          text: t("test.textProgress.items.potential"),
          color: "#8965E5",
        },
      ],
    },
    growthPath: {
      currentStage: 3,
      stages: [
        {
          title: t("test.growthPath.selfAwareness.title"),
          color: "#90FF5D",
          stage: 1,
          description: t("test.growthPath.selfAwareness.description"),
        },
        {
          title: t("test.growthPath.skillDevelopment.title"),
          color: "#39DD72",
          stage: 2,
          description: t("test.growthPath.skillDevelopment.description"),
        },
        {
          title: t("test.growthPath.practicalApplication.title"),
          color: "#29DDED",
          stage: 3,
          description: t("test.growthPath.practicalApplication.description"),
        },
        {
          title: t("test.growthPath.optimization.title"),
          color: "#2C8BFF",
          stage: 4,
          description: t("test.growthPath.optimization.description"),
        },
        {
          title: t("test.growthPath.influence.title"),
          color: "#7550E5",
          stage: 5,
          description: t("test.growthPath.influence.description"),
        },
      ],
    },
    visualDashboard: {
      value: 50,
      level: t("test.components.visualDashboard.level"),
      completionRate: 82,
    },
  };

  const renderComponent = (type: BlockType, data?: any) => {
    switch (type) {
      case "MatchingResultBlock":
        return <AvatarCard />;
      case "KeywordTagBlock":
        return <TraitCard traits={data ?? mockData.traits} />;
      case "RadarChartBlock":
        return <RadarCard data={data ?? mockData.radar} />;
      case "QuoteImageBlock":
        return <SpiritualInspiration />;
      case "RecommendationBox":
        return <PersonalizedAdvice />;
      case "BadgeBlock":
        return <BadgeCard badges={data ?? mockData.badges} />;
      case "GrowthPathBlock":
        return (
          <GrowthPathCard
            currentStage={
              data?.currentStage ?? mockData.growthPath.currentStage
            }
            stages={data?.stages ?? mockData.growthPath.stages}
          />
        );
      case "TextProgressBlock":
        return (
          <TextProgressCard
            title={data?.title ?? mockData.textProgress.title}
            subtitle={data?.subtitle ?? mockData.textProgress.subtitle}
            items={data?.items ?? mockData.textProgress.items}
          />
        );
      case "VisualMeterBlock":
        return (
          <VisualDashboard
            value={data?.value ?? mockData.visualDashboard.value}
            level={data?.level ?? mockData.visualDashboard.level}
            completionRate={
              data?.completionRate ?? mockData.visualDashboard.completionRate
            }
          />
        );
      case "MultiDimensionalBlock":
        return (
          <AnalysisCard dimensions={data?.dimensions ?? mockData.dimensions} />
        );
    }
  };

  const handlePurchase = (method: string) => {
    console.log("Purchase with method:", method);
    setShowPurchase(false);
  };

  const handleShare = async (method: string) => {
    try {
      const result = await Share.share({
        message: t("test.share.message"),
        url: "https://example.com/test",
        title: t("test.share.title"),
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type:", result.activityType);
        } else {
          console.log("Shared");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error: any) {
      console.error(error.message);
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
    const getTestData = async () => {
      const response = await testService.getTestList({ id: Number(id) });
      if (response.code === 200) {
        setTestData(response.data);
        console.log("testData", response.data);
      }
    };
    getTestData();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        insetTop={insets.top}
        bg={mockData.header.bg}
        color={mockData.header.color}
        onPress={handleHeaderPress}
        headerBackgroundAnimatedStyle={headerBackgroundAnimatedStyle}
        headerColorAnimatedStyle={headerColorAnimatedStyle}
        isCollect={testData?.is_favorited}
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
              tags={[t(`test.types.${getTestTypeKey(testData?.type_id)}.name`)]}
            />
            {testData?.component_types.map((type) => (
              <Fragment key={type}>{renderComponent(type)}</Fragment>
            ))}
            <FAQCard faqs={mockData.faqs} />
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
          onPress={() => {
            if (testData?.discount_price) {
              setShowPurchase(true);
            } else {
              router.push(`/test/start/${testData?.id}`);
            }
          }}
        >
          <Text style={styles.buyButtonText}>
            {testData?.discount_price
              ? t("test.button.buyTest")
              : t("test.start")}
          </Text>
        </TouchableHighlight>
      </LinearGradient>

      <PurchaseSheet
        isVisible={showPurchase}
        onClose={() => setShowPurchase(false)}
        price={12}
        onConfirm={handlePurchase}
      />

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
