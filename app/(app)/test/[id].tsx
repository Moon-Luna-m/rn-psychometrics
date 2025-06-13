import SearchResultCard from "@/components/home/SearchResultCard";
import AnalysisCard from "@/components/test/AnalysisCard";
import AvatarCard from "@/components/test/AvatarCard";
import BadgeCard from "@/components/test/BadgeCard";
import FAQCard from "@/components/test/FAQCard";
import FeatureCard from "@/components/test/FeatureCard";
import GrowthPathCard from "@/components/test/GrowthPathCard";
import Header from "@/components/test/Header";
import PersonalizedAdvice from "@/components/test/PersonalizedAdvice";
import PurchaseSheet from "@/components/test/PurchaseSheet";
import RadarCard from "@/components/test/RadarCard";
import ReportCard from "@/components/test/ReportCard";
import ShareSheet from "@/components/test/ShareSheet";
import SpiritualInspiration from "@/components/test/SpiritualInspiration";
import TestInfoCard from "@/components/test/TestInfoCard";
import TextProgressCard from "@/components/test/TextProgressCard";
import TraitCard from "@/components/test/TraitCard";
import VisualDashboard from "@/components/test/VisualDashboard";
import { px2hp } from "@/utils/common";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
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
  useSharedValue
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const SCROLL_THRESHOLD = Platform.OS === "web" ? 180 : 120;

export default function TestDetailsPage() {
  const insets = useSafeAreaInsets();
  const [showPurchase, setShowPurchase] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const scrollY = useSharedValue(0);

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
        "Personality analysis",
        "Psychological assessment",
        "Self-awareness",
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
        label: "Innovative thinking",
        value: 85,
        color: "#8257E5",
        description: "Your innovative thinking",
      },
      {
        icon: require("@/assets/images/test/trait2.png"),
        label: "Leadership",
        value: 75,
        color: "#04D361",
        description: "You excel in leadership",
      },
      {
        icon: require("@/assets/images/test/trait3.png"),
        label: "Team Builder",
        value: 90,
        color: "#FF963A",
        description: "You are a great team builder",
      },
    ],
    dimensions: [
      {
        label: "Leadership",
        value: 85,
        color: "#AB8AFF",
        trend: "up" as any,
      },
      {
        label: "Role Perception",
        value: 70,
        color: "#FFD76F",
        trend: "down" as any,
      },
      {
        label: "Values",
        value: 90,
        color: "#67C7FF",
        trend: "down" as any,
      },
      {
        label: "Positiveness",
        value: 95,
        color: "#00CEB6",
        trend: "up" as any,
      },
      {
        label: "Emotional Management",
        value: 45,
        color: "#FF8FAF",
        trend: "down" as any,
      },
    ],
    radar: [
      {
        label: "Logical Thinking",
        value: 82.1,
        color: "#8965E5",
      },
      {
        label: "Execution Ability",
        value: 92.3,
        color: "#FF6692",
      },
      {
        label: "Decision-Making and Judgment",
        value: 80.5,
        color: "#12B282",
      },
      {
        label: "Emotional Management",
        value: 86.2,
        color: "#FF52F3",
      },
      {
        label: "Learning and Adaptability",
        value: 88.4,
        color: "#00C3FF",
      },
      {
        label: "Teamwork and Collaboration",
        value: 79.6,
        color: "#5289FF",
      },
      {
        label: "Communication and Expression",
        value: 93.6,
        color: "#8DC222",
      },
      {
        label: "Innovative Thinking / Creativity",
        value: 97.4,
        color: "#FFC966",
      },
    ],
    faqs: [
      {
        icon: require("@/assets/images/test/faq.png"),
        question: "Is the test scientifically based?",
        answer:
          "Our assessment is based on psychological research and expert advice and has a certain reference value.",
      },
      {
        icon: require("@/assets/images/test/faq.png"),
        question: "Are the test results accurate?",
        answer:
          "The test results are for reference only. The real you is more complex and unique than any test.",
      },
      {
        icon: require("@/assets/images/test/faq.png"),
        question: "How long does it take to complete?",
        answer:
          "It takes about 8 minutes. It is recommend to complete it in a quiet environment to obtain more accurate results.",
      },
    ],
    badges: [
      {
        icon: require("@/assets/images/badges/creative-thinking.png"),
        title: "Creative Thinking",
        description: "You excel in Innovative Thinking",
      },
      {
        icon: require("@/assets/images/badges/adaptability.png"),
        title: "Adaptability",
        description: "You excel in Adaptability",
      },
      {
        icon: require("@/assets/images/badges/leadership.png"),
        title: "Leadership",
        description: "You excel in Leadership",
      },
      {
        icon: require("@/assets/images/badges/team-builder.png"),
        title: "Team Builder",
        description: "You excel in Team Building",
      },
      {
        icon: require("@/assets/images/badges/communicator.png"),
        title: "Master Communicator",
        description: "You excel in Communication",
      },
      {
        icon: require("@/assets/images/badges/learner.png"),
        title: "Student Learner",
        description: "You excel in Learning",
      },
    ],
    textProgress: {
      title: "Summary of psychological analysis",
      subtitle: "Analysis and guidance from professional psychologists",
      items: [
        {
          text: "Everyone is unique, and your combination of personality traits makes you who you are today.",
          color: "#00A1FF",
        },
        {
          text: "Understanding your strengths and room for growth is an important starting point for personal development.",
          color: "#00CEB6",
        },
        {
          text: "Remember, personality traits are neither good nor bad, the key is how to play to your strengths.",
          color: "#FFB900",
        },
        {
          text: "Continuous self-reflection and learning will help you go further on the road of life.",
          color: "#FF6692",
        },
        {
          text: "Believe in yourself, embrace change, your potential is far greater than you think",
          color: "#8965E5",
        },
      ],
    },
    growthPath: {
      currentStage: 3,
      stages: [
        {
          title: "Self-awareness",
          color: "#90FF5D",
          stage: 1,
          description: "Understanding yourself and your unique traits",
        },
        {
          title: "Skill Development",
          color: "#39DD72",
          stage: 2,
          description: "Building and enhancing your core competencies",
        },
        {
          title: "Practical application",
          color: "#29DDED",
          stage: 3,
          description: "Applying your skills in real-world situations",
        },
        {
          title: "Continuous optimization",
          color: "#2C8BFF",
          stage: 4,
          description: "Refining and improving your abilities",
        },
        {
          title: "Influencing others",
          color: "#7550E5",
          stage: 5,
          description: "Making a positive impact on those around you",
        },
      ],
    },
    visualDashboard: {
      value: 50,
      level: "Very high",
      completionRate: 82,
    },
  };

  const handlePurchase = (method: string) => {
    console.log("Purchase with method:", method);
    setShowPurchase(false);
  };

  const handleShare = async (method: string) => {
    try {
      const result = await Share.share({
        message: "Check out this amazing personality test!",
        url: "https://example.com/test",
        title: "Personality Test",
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

  const handleHeaderPress = (type: "share" | "collect") => {
    if (type === "share") {
      setShowShare(true);
    } else if (type === "collect") {
      console.log("collect");
    }
  };

  return (
    <View style={styles.container}>
      <Header
        insetTop={insets.top}
        bg={mockData.header.bg}
        color={mockData.header.color}
        onPress={handleHeaderPress}
        headerBackgroundAnimatedStyle={headerBackgroundAnimatedStyle}
        headerColorAnimatedStyle={headerColorAnimatedStyle}
      />
      <Animated.ScrollView
        style={[styles.scrollView, { marginTop: insets.top + 44 }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <SearchResultCard
          showIcon={false}
          item={{
            id: 1,
            type_id: 1,
            name: "Pathways of Personality: MBTI Snapshot",
            desc: "A brief yet insightful assessment that reveals your core MBTI type by examining how you gain energy, process information, make decisions, and organize life.",
            image: "icons/tests/1.png",
            price: 0,
            discount_price: 0,
            question_count: 5,
            answer_time: 600,
            star: 0,
            total: 1,
            user_avatars: ["avatars/100000_1747648721.png"],
          }}
        />
        <TestInfoCard
          questionCount={mockData.testInfo.questionCount}
          estimatedTime={mockData.testInfo.estimatedTime}
          source={mockData.testInfo.source}
          tags={mockData.testInfo.tags}
        />
        <FeatureCard />
        <AvatarCard
          avatar={mockData.avatar.image}
          result={{
            title: "Innovative Leader",
            description:
              "You have strong innovative spirit and leadership potential, are good at guiding the team, and keep an open mind to accept new ideas and challenges.",
          }}
        />
        <BadgeCard badges={mockData.badges} />
        <TextProgressCard
          title={mockData.textProgress.title}
          subtitle={mockData.textProgress.subtitle}
          items={mockData.textProgress.items}
        />
        <VisualDashboard
          value={mockData.visualDashboard.value}
          level={mockData.visualDashboard.level}
          completionRate={mockData.visualDashboard.completionRate}
        />
        <GrowthPathCard
          currentStage={mockData.growthPath.currentStage}
          stages={mockData.growthPath.stages}
        />
        <ReportCard chartData={mockData.report.chartData} />
        <TraitCard traits={mockData.traits} />
        <AnalysisCard dimensions={mockData.dimensions} />
        <RadarCard data={mockData.radar} />
        <FAQCard faqs={mockData.faqs} />
        <PersonalizedAdvice />
        <SpiritualInspiration />
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
            router.push({
              pathname: "/test/start/[id]",
              params: {
                id: "1",
              },
            });
            // setShowPurchase(true)
          }}
        >
          <Text style={styles.buyButtonText}>Buy Test</Text>
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
    textTransform: "uppercase",
    fontFamily: "Outfit",
  },
});
