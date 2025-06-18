import NotificationToast from "@/components/NotificationToast";
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
import { mockQuestionsFn } from "@/constants/MockData";
import { Option, Question, testService } from "@/services/testServices";
import { getLocalCache, imgProxy, padZero } from "@/utils/common";
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
  View
} from "react-native";
import {
  useSafeAreaInsets
} from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

// 更新模拟题目数据
const mockQuestions = mockQuestionsFn();

interface TestAnswer {
  question_id: number;
  option_ids: number[];
  score?: number[];
}

interface TestSubmission {
  user_test_id: number;
  answers: TestAnswer[];
}

// 添加用户测试进度接口
interface SavedTestProgress {
  user_test_id: number;
  answers: {
    question_id: number;
    option_ids: number[];
  }[];
}

interface StartTestResponse {
  user_test_id: number;
  progress?: SavedTestProgress;
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
  imageUrl: string;
}

interface ImageText2ComponentOption {
  key: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

// 转换选项格式的辅助函数
const mapOptionsToComponentFormat = (options: Option[]): ComponentOption[] => {
  return options.map((opt) => ({
    key: String(opt.id),
    text: opt.content,
  }));
};

const mapOptionsToSortFormat = (options: Option[]): SortComponentOption[] => {
  return options.map((opt) => ({
    id: String(opt.id),
    text: opt.content,
  }));
};

const mapOptionsToPercentageFormat = (
  options: Option[]
): PercentageComponentOption[] => {
  return options.map((opt) => ({
    id: String(opt.id),
    title: opt.content,
  }));
};

const mapOptionsToImageTextFormat = (
  options: Option[]
): ImageTextComponentOption[] => {
  return options.map((opt, index) => ({
    key: String(opt.id),
    text: opt.content,
    imageUrl: imgProxy(opt.image),
  }));
};

const mapOptionsToImageText2Format = (
  options: Option[]
): ImageText2ComponentOption[] => {
  return options.map((opt, index) => ({
    key: String(opt.id),
    title: opt.content,
    subtitle: opt.dimension,
    imageUrl: imgProxy(opt.image),
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
      question_id: number;
    };
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const [showExitModal, setShowExitModal] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testId, setTestId] = useState<number | null>(null);
  const [toastInfo, setToastInfo] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info" | "loading";
    duration: number | null;
    onDismiss: () => void;
  }>();

  // 转换服务器答案格式为本地状态格式
  const convertSubmissionToAnswers = (
    submission: TestSubmission,
    questions: Question[]
  ) => {
    const newAnswers: {
      [questionId: string]: {
        type: number;
        option_ids: number[];
        question_id: number;
      };
    } = {};

    let maxQuestionIndex = 0;

    submission.answers.forEach((answer) => {
      // 找到对应的问题以获取type
      const question = questions.find((q) => q.id === answer.question_id);
      if (question) {
        // 使用问题的索引作为key
        const questionIndex = questions.findIndex(
          (q) => q.id === answer.question_id
        );

        // 更新最大问题索引
        maxQuestionIndex = Math.max(maxQuestionIndex, questionIndex);

        // 如果是type 7且有score字段，使用score作为option_ids
        if ([7, 3].includes(question.type) && answer.score) {
          newAnswers[`question_${questionIndex}`] = {
            type: question.type,
            option_ids: answer.score,
            question_id: answer.question_id,
          };
        } else {
          newAnswers[`question_${questionIndex}`] = {
            type: question.type,
            option_ids: answer.option_ids,
            question_id: answer.question_id,
          };
        }
      }
    });

    // 更新当前问题索引
    setCurrentQuestion(maxQuestionIndex);

    return newAnswers;
  };

  // 从服务器加载测试进度
  useEffect(() => {
    const loadTestProgress = async () => {
      try {
        setIsLoading(true);
        const userTestWay = await getLocalCache("user_test_way");
        const userTestId = await getLocalCache("user_test_id");
        const [res1, res2, res3] = await Promise.all([
          userTestWay !== "user"
            ? await testService.startTest({ test_id: Number(params.id) })
            : {
                code: 200,
                data: {
                  user_test_id: Number(userTestId),
                },
              },
          await testService.getTestList({
            id: Number(userTestWay === "user" ? userTestId : params.id),
          }),
          // TODO: 从服务器获取测试进度
          userTestWay === "user"
            ? await testService.getUserTestDetail({ id: Number(params.id) })
            : null,
        ]);
        if (res1.code === 200) {
          setTestId(res1.data.user_test_id);
        } else {
          return router.replace("/");
        }
        if (res2.code === 200) {
          setQuestions(res2.data.questions as Question[]);
          if (res3) {
            setAnswers(
              convertSubmissionToAnswers(
                {
                  user_test_id: res1.data.user_test_id,
                  answers: res3.data.answers,
                },
                res2.data.questions as Question[]
              )
            );
          }
          // setQuestions(mockQuestions);
          // TODO: 如果有已保存的进度，转换格式并设置
        }
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
      user_test_id: testId!,
      answers: Object.entries(answers).map(([questionId, answer]) => {
        // 对于type 7，添加score字段
        if ([7, 3].includes(answer.type)) {
          return {
            question_id: answer.question_id,
            option_ids: questions[
              parseInt(questionId.split("_")[1])
            ].options.map((opt) => opt.id),
            score: answer.option_ids,
          };
        }
        // 其他类型保持不变
        return {
          question_id: answer.question_id,
          option_ids: answer.option_ids,
        };
      }),
    };
  };

  // 更新答案的辅助函数
  const updateAnswer = (
    type: number,
    questionId: string,
    optionIds: number[],
    question_id: number
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        type,
        option_ids: optionIds,
        question_id,
      },
    }));
  };
  const dispatch = useDispatch();
  const handleNextQuestion = async () => {
    // 移动到下一题
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };
  const handleSubmit = async () => {
    const data = formatAnswersForSubmission();
    const res = await testService.submitTestAnswer(data);
    if (res.code === 200) {
      router.push(`/test/result/${Number(params.id)}`);
    }
  };
  const handleExitSave = async () => {
    const saved = await saveProgress();
    if (saved) {
      handleExitConfirm();
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
    const currentQuestionData = questions[currentQuestion % questions.length];
    const questionId = `question_${currentQuestion}`;
    const currentAnswer = answers[questionId]?.option_ids || [];

    if (currentQuestionData.type === 1) {
      return (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <SingleChoice
            question={currentQuestionData.content}
            options={mapOptionsToComponentFormat(currentQuestionData.options)}
            selectedOption={currentAnswer[0]?.toString()}
            onSelect={(value) => {
              const selectedOption = currentQuestionData.options.find(
                (opt) => String(opt.id) === value
              );
              if (selectedOption) {
                updateAnswer(
                  1,
                  questionId,
                  [selectedOption.id],
                  currentQuestionData.id
                );
              }
            }}
            multiple={false}
          />
          <View style={styles.bottomSpace} />
        </ScrollView>
      );
    } else if (currentQuestionData.type === 2) {
      return (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <SingleChoice
            question={currentQuestionData.content}
            options={mapOptionsToComponentFormat(currentQuestionData.options)}
            selectedOptions={currentAnswer.map(String)}
            onSelect={(value) => {
              const selectedOption = currentQuestionData.options.find(
                (opt) => String(opt.id) === value
              );
              if (selectedOption) {
                const newSelected = currentAnswer.includes(selectedOption.id)
                  ? currentAnswer.filter((v) => v !== selectedOption.id)
                  : [...currentAnswer, selectedOption.id];
                updateAnswer(
                  2,
                  questionId,
                  newSelected,
                  currentQuestionData.id
                );
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
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
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
              const optionIds = Object.values(values).map((v) => Math.round(v));
              updateAnswer(7, questionId, optionIds, currentQuestionData.id);
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
            options={currentQuestionData.options.map((opt) => ({
              id: String(opt.id),
              content: opt.content,
            }))}
            selectedEmotion={currentAnswer[0]?.toString()}
            onSelect={(value) => {
              const selectedOption = currentQuestionData.options.find(
                (opt) => String(opt.id) === value
              );
              if (selectedOption) {
                updateAnswer(
                  6,
                  questionId,
                  [selectedOption.id],
                  currentQuestionData.id
                );
              }
            }}
          />
          <View style={styles.bottomSpace} />
        </>
      );
    } else if (currentQuestionData.type === 4) {
      const currentSortedOptions =
        currentAnswer.length > 0
          ? currentAnswer.map((id) => {
              const option = currentQuestionData.options.find(
                (opt) => opt.id === id
              );
              return {
                id: String(id),
                text: option?.content || "",
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
              const optionIds = value.map((v) => Number(v.id));
              updateAnswer(4, questionId, optionIds, currentQuestionData.id);
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
            value={currentAnswer[0] ? currentAnswer[0] / 10 : 0}
            onValueChange={(value) => {
              updateAnswer(3, questionId, [value * 10], currentQuestionData.id);
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
            options={currentQuestionData.options.map((opt) => ({
              id: String(opt.id),
              content: opt.content,
              imgUrl: imgProxy(opt.image),
            }))}
            selectedEmotion={currentAnswer[0]?.toString()}
            onSelect={(value) => {
              const selectedOption = currentQuestionData.options.find(
                (opt) => String(opt.id) === value
              );
              if (selectedOption) {
                updateAnswer(
                  5,
                  questionId,
                  [selectedOption.id],
                  currentQuestionData.id
                );
              }
            }}
          />
          <View style={styles.bottomSpace} />
        </>
      );
    } else if (currentQuestionData.type === 8) {
      return (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <ColorChoice
            question={currentQuestionData.content}
            description=""
            colorGroups={DEFAULT_COLOR_GROUPS}
            selectedColor={currentAnswer[0] || null}
            onSelect={(value) => {
              // const optionId = value.groupIndex * 10 + value.strengthIndex;
              // const selectedOption = currentQuestionData.options.find(opt => opt.id === optionId);
              // if (selectedOption) {
              //   updateAnswer(8, questionId, [selectedOption.id]);
              // }
              updateAnswer(8, questionId, [value], currentQuestionData.id);
            }}
            lowStrengthLabel="弱"
            highStrengthLabel="强"
          />
          <View style={styles.bottomSpace} />
        </ScrollView>
      );
    } else if (currentQuestionData.type === 9) {
      return (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <ImageTextChoice
            question={currentQuestionData.content}
            description=""
            options={mapOptionsToImageTextFormat(currentQuestionData.options)}
            selectedOption={currentAnswer[0]?.toString()}
            onSelect={(value) => {
              const selectedOption = currentQuestionData.options.find(
                (opt) => String(opt.id) === value
              );
              if (selectedOption) {
                updateAnswer(
                  9,
                  questionId,
                  [selectedOption.id],
                  currentQuestionData.id
                );
              }
            }}
          />
          <View style={styles.bottomSpace} />
        </ScrollView>
      );
    } else if (currentQuestionData.type === 10) {
      return (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <ImageTextChoice2
            question={currentQuestionData.content}
            description=""
            options={mapOptionsToImageText2Format(currentQuestionData.options)}
            selectedOption={currentAnswer[0]?.toString()}
            onSelect={(value) => {
              const selectedOption = currentQuestionData.options.find(
                (opt) => String(opt.id) === value
              );
              if (selectedOption) {
                updateAnswer(
                  10,
                  questionId,
                  [selectedOption.id],
                  currentQuestionData.id
                );
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
        <Text style={[styles.submitButtonText]}>
          {currentQuestion < questions.length - 1
            ? t("test.next")
            : t("test.submit")}
        </Text>
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
        {Array.from({ length: questions.length }).map((_, index) => (
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
    const currentQuestionData = questions[currentQuestion % questions.length];
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
      setToastInfo({
        visible: true,
        message: t("test.saving"),
        type: "loading",
        duration: null,
        onDismiss: () => {},
      });
      const res = await testService.saveUserTestProgress({
        ...submission,
        ...{
          test_id: Number(params.id),
          progress: currentQuestion + 1,
        },
      });
      if (res.code === 200) {
        setToastInfo(undefined);
        return true;
      } else {
        setToastInfo({
          visible: true,
          message: res.message,
          type: "error",
          duration: 3000,
          onDismiss: () => {
            setToastInfo(undefined);
          },
        });
      }
      return false;
    } catch (error) {
      console.error("Error saving test progress:", error);
      return false;
    }
  };

  // 检查指定题目是否已回答
  const isQuestionAnswered = (questionIndex: number) => {
    const questionId = `question_${questionIndex}`;
    const currentQuestionData = questions[questionIndex % questions.length];

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
      currentQuestion < questions.length - 1 &&
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
      <NotificationToast />
      {questions.length ? (
        <>
          <View style={[styles.container, { marginTop: insets.top + 12 }]}>
            <View style={{ flex: 1, paddingTop: 12 }}>
              <View style={styles.bgCard}></View>
              <View style={styles.scrollViewContainer}>
                <View style={styles.scrollViewHeader}>
                  <Text style={styles.scrollViewTitle} numberOfLines={1}>
                    {questions[currentQuestion % questions.length].content}
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
                        color={
                          canGoBack() ? "#19DBF2" : "rgba(25, 219, 242, 0.3)"
                        }
                      />
                    </TouchableOpacity>
                    <View style={styles.testTitleTextContainer}>
                      <Text
                        style={[styles.testTitleText, { color: "#0C0A09" }]}
                      >
                        {padZero(currentQuestion + 1)}
                      </Text>
                      <Text style={styles.testTitleText}>/</Text>
                      <Text style={styles.testTitleText}>
                        {padZero(questions.length)}
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
        </>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <ActivityIndicator size="large" color="#19DBF2" />
        </View>
      )}

      <ExitTestModal
        visible={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirm={handleExitConfirm}
        onSave={handleExitSave}
        toastInfo={toastInfo}
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
