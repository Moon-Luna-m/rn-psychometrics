import { ColorChoice } from "@/components/test/start/ColorChoice";
import { EmotionChoice } from "@/components/test/start/EmotionChoice";
import { ExitTestModal } from "@/components/test/start/ExitTestModal";
import { ImageTextChoice } from "@/components/test/start/ImageTextChoice";
import { ImageTextChoice2 } from "@/components/test/start/ImageTextChoice2";
import { PercentageSlider } from "@/components/test/start/PercentageSlider";
import { SingleChoice } from "@/components/test/start/SingleChoice";
import { SingleEmotionChoice } from "@/components/test/start/SingleEmotionChoice";
import { SliderChoice } from "@/components/test/start/SliderChoice";
import { SortChoice } from "@/components/test/start/SortChoice";
import { DEFAULT_COLOR_GROUPS } from "@/constants/Colors";
import { testService } from "@/services/testServices";
import { padZero } from "@/utils/common";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
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
  content: string;
  dimension: string;
  id: number;
  image?: string;
  score: number;
}

interface SingleChoiceQuestion {
  type: 1;
  content: string;
  options: Option[];
}

interface MultipleChoiceQuestion {
  type: 2;
  content: string;
  options: Option[];
  maxSelect?: number; // 最大可选数量，可选
}

interface SliderQuestion {
  type: 3;
  content: string;
  options: Option[];
}

interface SingleEmotionQuestion {
  type: 5;
  content: string;
  options: Option[];
}

interface EmotionQuestion {
  type: 6;
  content: string;
  options: Option[];
}

interface SortQuestion {
  type: 4;
  content: string;
  options: Option[];
}

interface PercentageQuestion {
  type: 7;
  content: string;
  options: Option[];
}

interface ColorQuestion {
  type: 8;
  content: string;
  options: Option[];
}

interface ImageTextQuestion {
  type: 9;
  content: string;
  options: Option[];
}

interface ImageText2Question {
  type: 10;
  content: string;
  options: Option[];
}

type Question =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | SliderQuestion
  | EmotionQuestion
  | SortQuestion
  | PercentageQuestion
  | SingleEmotionQuestion
  | ColorQuestion
  | ImageTextQuestion
  | ImageText2Question;

// 更新模拟题目数据
const mockQuestions: Question[] = [
  {
    type: 6,
    content: "Role Preference Assessment",
    options: [
      { id: 1, content: "领导者", dimension: "L", score: 5 },
      { id: 2, content: "执行者", dimension: "E", score: 4 },
      { id: 3, content: "思考者", dimension: "T", score: 3 },
      { id: 4, content: "协调者", dimension: "C", score: 2 },
    ]
  },
  {
    type: 5,
    content: "情绪状态评估",
    options: [
      { id: 1, content: "高兴", dimension: "P", score: 5 },
      { id: 2, content: "悲伤", dimension: "N", score: 2 },
      { id: 3, content: "愤怒", dimension: "N", score: 1 },
      { id: 4, content: "恐惧", dimension: "N", score: 1 },
      { id: 5, content: "惊讶", dimension: "N", score: 3 },
    ],
  },
  {
    type: 2,
    content: "兴趣爱好评估",
    options: [
      { id: 1, content: "艺术与创作", dimension: "A", score: 5 },
      { id: 2, content: "科技与创新", dimension: "T", score: 5 },
      { id: 3, content: "运动与健康", dimension: "S", score: 5 },
      { id: 4, content: "阅读与写作", dimension: "L", score: 5 },
      { id: 5, content: "音乐与表演", dimension: "M", score: 5 },
    ],
    maxSelect: 3,
  },
  {
    type: 7,
    content: "时间分配评估",
    options: [
      { id: 1, content: "工作和学习", dimension: "W", score: 5 },
      { id: 2, content: "社交娱乐", dimension: "S", score: 4 },
      { id: 3, content: "个人爱好", dimension: "H", score: 3 },
      { id: 4, content: "休息放松", dimension: "R", score: 2 },
    ],
  },
  {
    type: 3,
    content: "工作动力评估",
    options: [
      { id: 1, content: "非常积极", dimension: "M", score: 5 },
      { id: 2, content: "比较积极", dimension: "M", score: 4 },
      { id: 3, content: "一般", dimension: "M", score: 3 },
      { id: 4, content: "比较消极", dimension: "M", score: 2 },
      { id: 5, content: "非常消极", dimension: "M", score: 1 },
    ],
  },
  {
    type: 10,
    content: "情绪色彩测试",
    options: [
      { id: 1, content: "热情红", dimension: "E", score: 5 },
      { id: 2, content: "平静蓝", dimension: "C", score: 4 },
      { id: 3, content: "自然绿", dimension: "N", score: 3 },
      { id: 4, content: "智慧蓝", dimension: "W", score: 5 },
      { id: 5, content: "阳光黄", dimension: "P", score: 4 },
      { id: 6, content: "梦幻紫", dimension: "D", score: 3 },
    ],
  },
  {
    type: 9,
    content: "图形偏好测试",
    options: [
      { id: 1, content: "圆形组合", dimension: "C", score: 5 },
      { id: 2, content: "方形组合", dimension: "S", score: 4 },
      { id: 3, content: "三角形组合", dimension: "T", score: 3 },
      { id: 4, content: "菱形组合", dimension: "D", score: 2 },
    ],
  },
  {
    type: 1,
    content: "性格类型测试",
    options: [
      { id: 1, content: "主动承担领导角色", dimension: "L", score: 5 },
      { id: 2, content: "积极参与讨论", dimension: "P", score: 4 },
      { id: 3, content: "默默支持团队", dimension: "S", score: 3 },
      { id: 4, content: "独立完成任务", dimension: "I", score: 2 },
    ],
  },
  {
    type: 8,
    content: "色彩偏好测试",
    options: [
      { id: 1, content: "热情红", dimension: "E", score: 5 },
      { id: 2, content: "平静蓝", dimension: "C", score: 4 },
      { id: 3, content: "自然绿", dimension: "N", score: 3 },
      { id: 4, content: "智慧蓝", dimension: "W", score: 5 },
      { id: 5, content: "阳光黄", dimension: "P", score: 4 },
      { id: 6, content: "梦幻紫", dimension: "D", score: 3 },
    ],
  },
  {
    type: 4,
    content: "工作价值观评估",
    options: [
      { id: 1, content: "成就感", dimension: "A", score: 5 },
      { id: 2, content: "工作稳定性", dimension: "S", score: 4 },
      { id: 3, content: "团队协作", dimension: "T", score: 3 },
      { id: 4, content: "创新机会", dimension: "I", score: 2 },
    ],
  },
];

interface TestAnswer {
  question_id: number;
  option_ids: number[];
}

interface TestSubmission {
  user_test_id: number;
  answers: TestAnswer[];
}

// 组件选项接口
interface ComponentOption {
  key: string;
  text: string;
}

interface SortComponentOption {
  id: string;
  text: string;
}

interface PercentageComponentOption {
  id: string;
  title: string;
}

interface ImageTextComponentOption {
  key: string;
  text: string;
  color: string;
  shadowColor: string;
  pattern: "circle" | "square" | "triangle" | "diamond";
}

interface ImageText2ComponentOption {
  key: string;
  title: string;
  subtitle: string;
  color: string;
  icon: "heart" | "smile" | "leaf" | "brain" | "sun" | "star";
}

// 转换选项格式的辅助函数
const mapOptionsToComponentFormat = (options: Option[]): ComponentOption[] => {
  return options.map(opt => ({
    key: String(opt.id),
    text: opt.content
  }));
};

const mapOptionsToSortFormat = (options: Option[]): SortComponentOption[] => {
  return options.map(opt => ({
    id: String(opt.id),
    text: opt.content
  }));
};

const mapOptionsToPercentageFormat = (options: Option[]): PercentageComponentOption[] => {
  return options.map(opt => ({
    id: String(opt.id),
    title: opt.content
  }));
};

const mapOptionsToImageTextFormat = (options: Option[]): ImageTextComponentOption[] => {
  const patterns: ("circle" | "square" | "triangle" | "diamond")[] = ["circle", "square", "triangle", "diamond"];
  const colors = ["#FB6F7A", "#FED441", "#22C46F", "#C591FF"];
  const shadowColors = ["rgba(205, 47, 60, 0.48)", "rgba(206, 169, 40, 0.48)", "rgba(34, 196, 111, 0.48)", "rgba(117, 73, 165, 0.48)"];
  
  return options.map((opt, index) => ({
    key: String(opt.id),
    text: opt.content,
    color: colors[index % colors.length],
    shadowColor: shadowColors[index % shadowColors.length],
    pattern: patterns[index % patterns.length]
  }));
};

const mapOptionsToImageText2Format = (options: Option[]): ImageText2ComponentOption[] => {
  const icons: ("heart" | "smile" | "leaf" | "brain" | "sun" | "star")[] = ["heart", "smile", "leaf", "brain", "sun", "star"];
  const colors = ["#F75C5C", "#5FD1E3", "#3EDB7F", "#3A7DFF", "#FFD43B", "#C17CFF"];
  
  return options.map((opt, index) => ({
    key: String(opt.id),
    title: opt.content,
    subtitle: opt.dimension,
    color: colors[index % colors.length],
    icon: icons[index % icons.length]
  }));
};

export default function StartTest() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{
    [questionId: string]: {
      type: number;
      option_ids: number[];
    };
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const [showExitModal, setShowExitModal] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    console.log(answers);
  }, [answers]);

  // 从服务器加载测试进度
  useEffect(() => {
    const loadTestProgress = async () => {
      try {
        setIsLoading(true);
        const [, res] = await Promise.all([
          await testService.startTest({ test_id: Number(params.id) }),
          // TODO: 从服务器获取测试进度
          await testService.getTestList({ id: Number(params.id) }),
        ]);
        if (res.code === 200) {
        }
        // 模拟加载完成
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading test progress:", error);
        setIsLoading(false);
      }
    };

    loadTestProgress();
  }, [params.id]);

  // 格式化答案为提交格式
  const formatAnswersForSubmission = (): TestSubmission => {
    return {
      user_test_id: Number(params.id),
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        question_id: Number(questionId.replace("question_", "")),
        option_ids: answer.option_ids,
      })),
    };
  };

  // 更新答案的辅助函数
  const updateAnswer = (
    type: number,
    questionId: string,
    optionIds: number[]
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        type,
        option_ids: optionIds,
      },
    }));
  };

  const handleNextQuestion = async () => {
    // 保存当前进度
    await saveProgress();
    // 移动到下一题
    setCurrentQuestion((prev) => prev + 1);
  };

  const handleExitSave = async () => {
    const saved = await saveProgress();
    if (saved) {
      router.back();
    } else {
      // TODO: 显示保存失败提示
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#19DBF2" />
      </View>
    );
  }

  const renderQuestion = () => {
    const currentQuestionData = mockQuestions[currentQuestion % mockQuestions.length];
    const questionId = `question_${currentQuestion}`;
    const currentAnswer = answers[questionId]?.option_ids || [];

    if (currentQuestionData.type === 1) {
      return (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <SingleChoice
            question={currentQuestionData.content}
            options={mapOptionsToComponentFormat(currentQuestionData.options)}
            selectedOption={currentAnswer[0]?.toString()}
            onSelect={(value) => {
              const selectedOption = currentQuestionData.options.find(opt => String(opt.id) === value);
              if (selectedOption) {
                updateAnswer(1, questionId, [selectedOption.id]);
              }
            }}
            multiple={false}
          />
          <View style={styles.bottomSpace} />
        </ScrollView>
      );
    } else if (currentQuestionData.type === 2) {
      return (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <SingleChoice
            question={currentQuestionData.content}
            options={mapOptionsToComponentFormat(currentQuestionData.options)}
            selectedOptions={currentAnswer.map(String)}
            onSelect={(value) => {
              const selectedOption = currentQuestionData.options.find(opt => String(opt.id) === value);
              if (selectedOption) {
                const newSelected = currentAnswer.includes(selectedOption.id)
                  ? currentAnswer.filter(v => v !== selectedOption.id)
                  : [...currentAnswer, selectedOption.id];
                updateAnswer(2, questionId, newSelected);
              }
            }}
            multiple={true}
            maxSelect={currentQuestionData.maxSelect}
          />
          <View style={styles.bottomSpace} />
        </ScrollView>
      );
    } else if (currentQuestionData.type === 7) {
      return (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <PercentageSlider
            question={currentQuestionData.content}
            description=""
            options={mapOptionsToPercentageFormat(currentQuestionData.options)}
            values={Object.fromEntries(
              currentAnswer.map((id, index) => [
                currentQuestionData.options[index].id,
                id,
              ])
            )}
            onValuesChange={(values) => {
              const optionIds = Object.values(values).map(v => Math.round(v));
              updateAnswer(7, questionId, optionIds);
            }}
          />
          <View style={styles.bottomSpace} />
        </ScrollView>
      );
    } else if (currentQuestionData.type === 6) {
      return (
        <>
          <EmotionChoice
            question={currentQuestionData.content}
            description=""
            options={currentQuestionData.options.map(opt => ({
              id: String(opt.id),
              content: opt.content
            }))}
            selectedEmotion={currentAnswer[0]?.toString()}
            onSelect={(value) => {
              const selectedOption = currentQuestionData.options.find(opt => String(opt.id) === value);
              if (selectedOption) {
                updateAnswer(6, questionId, [selectedOption.id]);
              }
            }}
          />
          <View style={styles.bottomSpace} />
        </>
      );
    } else if (currentQuestionData.type === 4) {
      const currentSortedOptions = currentAnswer.length > 0
        ? currentAnswer.map(id => {
            const option = currentQuestionData.options.find(opt => opt.id === id);
            return {
              id: String(id),
              text: option?.content || ''
            };
          })
        : mapOptionsToSortFormat(currentQuestionData.options);

      return (
        <>
          <SortChoice
            question={currentQuestionData.content}
            description=""
            options={mapOptionsToSortFormat(currentQuestionData.options)}
            sortedOptions={currentSortedOptions}
            onSort={(value) => {
              const optionIds = value.map(v => Number(v.id));
              updateAnswer(4, questionId, optionIds);
            }}
          />
        </>
      );
    } else if (currentQuestionData.type === 3) {
      return (
        <>
          <SliderChoice
            question={currentQuestionData.content}
            description=""
            value={currentAnswer[0] ?? 0}
            onValueChange={(value) => {
              updateAnswer(3, questionId, [value]);
            }}
          />
          <View style={styles.bottomSpace} />
        </>
      );
    } else if (currentQuestionData.type === 5) {
      return (
        <>
          <SingleEmotionChoice
            question={currentQuestionData.content}
            description=""
            options={currentQuestionData.options.map(opt => ({
              id: String(opt.id),
              content: opt.content
            }))}
            selectedEmotion={currentAnswer[0]?.toString()}
            onSelect={(value) => {
              const selectedOption = currentQuestionData.options.find(opt => String(opt.id) === value);
              if (selectedOption) {
                updateAnswer(5, questionId, [selectedOption.id]);
              }
            }}
          />
          <View style={styles.bottomSpace} />
        </>
      );
    } else if (currentQuestionData.type === 8) {
      return (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <ColorChoice
            question={currentQuestionData.content}
            description=""
            colorGroups={DEFAULT_COLOR_GROUPS}
            selectedColor={
              currentAnswer[0] !== undefined
                ? {
                    groupIndex: currentAnswer[0],
                    strengthIndex: currentAnswer[1],
                  }
                : null
            }
            onSelect={(value) => {
              // const optionId = value.groupIndex * 10 + value.strengthIndex;
              // const selectedOption = currentQuestionData.options.find(opt => opt.id === optionId);
              // if (selectedOption) {
              //   updateAnswer(8, questionId, [selectedOption.id]);
              // }
              updateAnswer(8, questionId, [value.groupIndex, value.strengthIndex]);
            }}
            lowStrengthLabel="弱"
            highStrengthLabel="强"
          />
          <View style={styles.bottomSpace} />
        </ScrollView>
      );
    } else if (currentQuestionData.type === 9) {
      return (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <ImageTextChoice
            question={currentQuestionData.content}
            description=""
            options={mapOptionsToImageTextFormat(currentQuestionData.options)}
            selectedOption={currentAnswer[0]?.toString()}
            onSelect={(value) => {
              const selectedOption = currentQuestionData.options.find(opt => String(opt.id) === value);
              if (selectedOption) {
                updateAnswer(9, questionId, [selectedOption.id]);
              }
            }}
          />
          <View style={styles.bottomSpace} />
        </ScrollView>
      );
    } else if (currentQuestionData.type === 10) {
      return (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <ImageTextChoice2
            question={currentQuestionData.content}
            description=""
            options={mapOptionsToImageText2Format(currentQuestionData.options)}
            selectedOption={currentAnswer[0]?.toString()}
            onSelect={(value) => {
              const selectedOption = currentQuestionData.options.find(opt => String(opt.id) === value);
              if (selectedOption) {
                updateAnswer(10, questionId, [selectedOption.id]);
              }
            }}
          />
          <View style={styles.bottomSpace} />
        </ScrollView>
      );
    }

    return null;
  };

  const renderBottomBar = () => (
    <View style={styles.bottomBar}>
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
    </View>
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

  const handleExit = () => {
    setShowExitModal(true);
  };

  const handleExitConfirm = () => {
    router.back();
  };

  const getCurrentAnswer = () => {
    const currentQuestionData = mockQuestions[currentQuestion % mockQuestions.length];
    const questionId = `question_${currentQuestion}`;
    const currentAnswer = answers[questionId];

    if (!currentAnswer) return null;

    switch (currentQuestionData.type) {
      case 1:
        return currentAnswer.option_ids.length === 1 ? currentAnswer : null;
      case 2:
        return currentAnswer.option_ids.length > 0 ? currentAnswer : null;
      case 7:
        const total = currentAnswer.option_ids.reduce(
          (sum, value) => sum + value,
          0
        );
        return total === 100 ? currentAnswer : null;
      case 6:
        return currentAnswer.option_ids.length === 1 ? currentAnswer : null;
      case 4:
        return currentAnswer.option_ids.length > 0 ? currentAnswer : null;
      case 3:
        return currentAnswer.option_ids.length === 1 ? currentAnswer : null;
      case 5:
        return currentAnswer.option_ids.length === 1 ? currentAnswer : null;
      case 8:
        return currentAnswer.option_ids.length > 0 ? currentAnswer : null;
      case 9:
        return currentAnswer.option_ids.length === 1 ? currentAnswer : null;
      case 10:
        return currentAnswer.option_ids.length === 1 ? currentAnswer : null;
      default:
        return null;
    }
  };

  // 保存进度到服务器
  const saveProgress = async () => {
    try {
      const submission = formatAnswersForSubmission();
      // TODO: 保存进度到服务器
      // await api.saveTestProgress(submission);
      return true;
    } catch (error) {
      console.error("Error saving test progress:", error);
      return false;
    }
  };

  // 检查指定题目是否已回答
  const isQuestionAnswered = (questionIndex: number) => {
    const questionId = `question_${questionIndex}`;
    const currentQuestionData =
      mockQuestions[questionIndex % mockQuestions.length];

    switch (currentQuestionData.type) {
      case 1:
        return answers[questionId]?.option_ids.length > 0;
      case 2:
        return answers[questionId]?.option_ids.length > 0;
      case 7:
        return answers[questionId]?.option_ids.length > 0;
      case 6:
        return answers[questionId]?.option_ids.length > 0;
      case 4:
        return answers[questionId]?.option_ids.length > 0;
      case 3:
        return answers[questionId]?.option_ids.length > 0;
      case 5:
        return answers[questionId]?.option_ids.length > 0;
      case 8:
        return answers[questionId]?.option_ids.length > 0;
      case 9:
        return answers[questionId]?.option_ids.length > 0;
      case 10:
        return answers[questionId]?.option_ids.length > 0;
      default:
        return false;
    }
  };

  // 检查是否可以前进
  const canGoForward = () => {
    return (
      currentQuestion < TOTAL_QUESTIONS - 1 &&
      isQuestionAnswered(currentQuestion)
    );
  };

  // 检查是否可以后退
  const canGoBack = () => {
    return currentQuestion > 0;
  };

  // 处理前进
  const handleForward = () => {
    if (canGoForward()) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  // 处理后退
  const handleBack = () => {
    if (canGoBack()) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#19DBF2" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#19DBF2" }}>
      <View style={[styles.container, { marginTop: insets.top + 12 }]}>
        <View style={{ flex: 1, paddingTop: 12 }}>
          <View style={styles.bgCard}></View>
          <View style={styles.scrollViewContainer}>
            <View style={styles.scrollViewHeader}>
              <Text style={styles.scrollViewTitle} numberOfLines={1}>
                {mockQuestions[currentQuestion % mockQuestions.length].content}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  position: "absolute",
                  top: 22,
                  right: 16,
                }}
                onPress={handleExit}
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
                  style={[
                    styles.iconContainer,
                    !canGoBack() && styles.iconContainerDisabled,
                  ]}
                  onPress={handleBack}
                  disabled={!canGoBack()}
                >
                  <MaterialIcons
                    name="arrow-back-ios"
                    size={24}
                    color={canGoBack() ? "#19DBF2" : "rgba(25, 219, 242, 0.3)"}
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
                  style={[
                    styles.iconContainer,
                    !canGoForward() && styles.iconContainerDisabled,
                  ]}
                  onPress={handleForward}
                  disabled={!canGoForward()}
                >
                  <MaterialIcons
                    name="arrow-forward-ios"
                    size={24}
                    color={
                      canGoForward() ? "#19DBF2" : "rgba(25, 219, 242, 0.3)"
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

      <ExitTestModal
        visible={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirm={handleExitConfirm}
        onSave={handleExitSave}
      />
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
    height: 150,
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
  iconContainerDisabled: {
    opacity: 0.5,
  },
});
