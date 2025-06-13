import { EmotionChoice } from "@/components/test/start/EmotionChoice";
import { SingleChoice } from "@/components/test/start/SingleChoice";
import { SliderChoice } from "@/components/test/start/SliderChoice";
import { SortChoice } from "@/components/test/start/SortChoice";
import { padZero } from "@/utils/common";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  useFocusEffect,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TOTAL_QUESTIONS = 9;

interface Option {
  key: string;
  text: string;
}

interface SingleChoiceQuestion {
  type: "single";
  title: string;
  question: string;
  options: Option[];
}

interface SliderQuestion {
  type: "slider";
  title: string;
  question: string;
  description: string;
}

interface EmotionQuestion {
  type: "emotion";
  title: string;
  question: string;
  description: string;
}

interface SortQuestion {
  type: "sort";
  title: string;
  question: string;
  description: string;
  options: Array<{
    id: string;
    text: string;
  }>;
}

type Question =
  | SingleChoiceQuestion
  | SliderQuestion
  | EmotionQuestion
  | SortQuestion;

// 模拟题目数据
const mockQuestions: Question[] = [
  {
    type: "single",
    title: "Myers-Briggs Type Indicator",
    question: "In teamwork, you are more likely to:",
    options: [
      { key: "A", text: "Take the initiative to take the leaders role" },
      { key: "B", text: "Actively participate in discussions" },
      { key: "C", text: "Quietly support the team" },
      { key: "D", text: "Complete tasks independently" },
    ],
  },
  {
    type: "slider",
    title: "Work Motivation Assessment",
    question: "How motivated are you at work?",
    description: "Please slide to select the level that best describes you",
  },
  {
    type: "emotion",
    title: "Role Preference Assessment",
    question: "Which role do you feel most comfortable with?",
    description: "Select the role that best matches your personality",
  },
  {
    type: "sort",
    title: "Work Values Assessment",
    question: "Please rank the following work values in order of importance:",
    description:
      "Drag the options below to rank (most important to least important)",
    options: [
      { id: "1", text: "Sense of accomplishment" },
      { id: "2", text: "Job stability" },
      { id: "3", text: "Teamwork" },
      { id: "4", text: "Innovation opportunities" },
    ],
  },
  // 可以添加更多题目...
];

export default function StartTest() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState<number | null>(null);
  const [emotionValue, setEmotionValue] = useState<string | null>(null);
  const [sortedOptions, setSortedOptions] = useState<Array<{
    id: string;
    text: string;
  }> | null>(null);
  const insets = useSafeAreaInsets();

  // 监听页面焦点变化
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (Platform.OS === "web") {
          console.log("Page unfocused");
        }
      };
    }, [])
  );

  useEffect(() => {
    if (Platform.OS === "web") {
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        console.log("beforeunload");
      };
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, []);

  const handleNextQuestion = () => {
    // 重置所有答案状态
    setSelectedOption(null);
    setSliderValue(null);
    setEmotionValue(null);
    setSortedOptions(null);
    
    // 移动到下一题
    setCurrentQuestion((prev) => prev + 1);
  };

  const getCurrentAnswer = () => {
    const currentQuestionData =
      mockQuestions[currentQuestion % mockQuestions.length];
    if (currentQuestionData.type === "single") {
      return selectedOption;
    } else if (currentQuestionData.type === "slider") {
      return sliderValue;
    } else if (currentQuestionData.type === "emotion") {
      return emotionValue;
    } else if (currentQuestionData.type === "sort") {
      return sortedOptions;
    }
  };

  const renderQuestion = () => {
    const currentQuestionData =
      mockQuestions[currentQuestion % mockQuestions.length];

    if (currentQuestionData.type === "single") {
      return (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <SingleChoice
            question={currentQuestionData.question}
            options={currentQuestionData.options}
            selectedOption={selectedOption}
            onSelect={setSelectedOption}
          />
          <View style={styles.bottomSpace} />
        </ScrollView>
      );
    } else if (currentQuestionData.type === "slider") {
      return (
        <>
          <SliderChoice
            onValueChange={setSliderValue}
            question={currentQuestionData.question}
            description={currentQuestionData.description}
          />
          <View style={styles.bottomSpace} />
        </>
      );
    } else if (currentQuestionData.type === "emotion") {
      return (
        <>
          <EmotionChoice
            question={currentQuestionData.question}
            description={currentQuestionData.description}
            onSelect={setEmotionValue}
          />
          <View style={styles.bottomSpace} />
        </>
      );
    } else if (currentQuestionData.type === "sort") {
      const options = sortedOptions || currentQuestionData.options;
      return (
        <SortChoice
          question={currentQuestionData.question}
          description={currentQuestionData.description}
          options={options}
          onSort={setSortedOptions}
        />
      );
    }

    return null;
  };

  const renderBottomBar = () => (
    <BlurView intensity={80} tint="light" style={styles.bottomBar}>
      <TouchableOpacity
        style={[
          styles.submitButton,
          getCurrentAnswer()
            ? styles.submitButtonActive
            : styles.submitButtonInactive,
        ]}
        disabled={!getCurrentAnswer()}
        onPress={handleNextQuestion}
      >
        <Text style={[styles.submitButtonText]}>Next</Text>
        <Ionicons
          name="arrow-forward"
          size={20}
          color="#FFFFFF"
          style={styles.submitButtonIcon}
        />
      </TouchableOpacity>
    </BlurView>
  );

  const renderProgressBar = () => (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarWrapper}>
        {Array.from({ length: TOTAL_QUESTIONS }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressBarItem,
              index <= currentQuestion
                ? styles.progressBarItemActive
                : styles.progressBarItemInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#19DBF2" }}>
      <View style={[styles.container, { marginTop: insets.top + 12 }]}>
        <View
          style={{
            flex: 1,
            paddingTop: 12,
          }}
        >
          <View style={styles.bgCard}></View>
          <View style={styles.scrollViewContainer}>
            <View style={styles.scrollViewHeader}>
              <Text style={styles.scrollViewTitle} numberOfLines={1}>
                Myers-Briggs Type Indicator
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  position: "absolute",
                  top: 22,
                  right: 16,
                }}
                onPress={() => {
                  router.back();
                }}
              >
                <Image
                  source={require("@/assets/images/common/close-circle.png")}
                  style={{
                    width: 24,
                    height: 24,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.testTitleContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.iconContainer}
                >
                  <MaterialIcons
                    name="arrow-back-ios"
                    size={24}
                    color={currentQuestion > 0 ? "#19DBF2" : "transparent"}
                  />
                </TouchableOpacity>
                <View style={styles.testTitleTextContainer}>
                  <Text style={[styles.testTitleText, { color: "#0C0A09" }]}>
                    {padZero(currentQuestion + 1)}
                  </Text>
                  <Text style={styles.testTitleText}>/</Text>
                  <Text style={styles.testTitleText}>
                    {padZero(TOTAL_QUESTIONS)}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.iconContainer}
                >
                  <MaterialIcons
                    name="arrow-forward-ios"
                    size={24}
                    color={
                      currentQuestion < TOTAL_QUESTIONS - 1
                        ? "#19DBF2"
                        : "transparent"
                    }
                  />
                </TouchableOpacity>
              </View>
              {renderProgressBar()}
              {renderQuestion()}
            </View>
          </View>
        </View>
        {renderBottomBar()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgCard: {
    width: 320,
    height: 486,
    backgroundColor: "#fff",
    borderRadius: 21.6,
    position: "absolute",
    top: 0,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    opacity: 0.6,
  },
  scrollViewContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    boxShadow: "0px -4px 13.6px 0px rgba(15, 113, 124, 0.32)",
  },
  scrollViewHeader: {
    paddingHorizontal: 48,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E4EBF0",
  },
  scrollViewTitle: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    color: "#19DBF2",
    textTransform: "uppercase",
  },
  scrollView: {
    flex: 1,
  },
  testTitleContainer: {
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  testTitleTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  testTitleText: {
    color: "rgba(12, 10, 9, 0.16)",
    fontSize: 18,
    fontWeight: "700",
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  progressBarContainer: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  progressBarWrapper: {
    flexDirection: "row",
    gap: 8,
  },
  progressBarItem: {
    flex: 1,
    height: 6,
  },
  progressBarItemActive: {
    backgroundColor: "#19DBF2",
  },
  progressBarItemInactive: {
    backgroundColor: "rgba(25, 219, 242, 0.23)",
  },
  bottomSpace: {
    height: 100,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
  },
  submitButton: {
    height: 48,
    paddingHorizontal: 10,
    borderRadius: 78,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonActive: {
    backgroundColor: "#19DBF2",
  },
  submitButtonInactive: {
    backgroundColor: "#E4EBF0",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
    color: "#FFFFFF",
  },
  submitButtonIcon: {
    position: "absolute",
    right: 22,
  },
});
