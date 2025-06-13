import React, { useState } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const windowWidth = Dimensions.get("window").width;

interface EmotionOption {
  id: string;
  label: string;
  size: number;
  position: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
}

interface EmotionChoiceProps {
  question: string;
  description: string;
  onSelect?: (value: string) => void;
}

const EMOTIONS: EmotionOption[] = [
  {
    id: "communicator",
    label: "Communicator",
    size: 120,
    position: { top: 20, left: 13 },
  },
  {
    id: "collaborator",
    label: "Collaborator",
    size: 100,
    position: { top: 195, left: 33 },
  },
  {
    id: "executor",
    label: "Executor",
    size: 100,
    position: { top: 175, right: 55 },
  },
  {
    id: "thinker",
    label: "Thinker",
    size: 99,
    position: { top: 10, right: 49 },
  },
  {
    id: "innovator",
    label: "Innovator",
    size: 80,
    position: { top: 113, left: 133 },
  },
  {
    id: "leader",
    label: "Leader",
    size: 60,
    position: { top: 95, right: -5 },
  },
];

export const EmotionChoice: React.FC<EmotionChoiceProps> = ({
  question,
  description,
  onSelect,
}) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedEmotion(id);
    onSelect?.(id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.question}>{question}</Text>
      </View>

      <View style={styles.emotionsContainer}>
        <View style={styles.centerCircle}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />
        </View>

        {EMOTIONS.map((emotion) => (
          <TouchableOpacity
            key={emotion.id}
            style={[
              styles.emotionButton,
              {
                width: emotion.size,
                height: emotion.size,
                ...emotion.position,
              },
              selectedEmotion === emotion.id && styles.selectedEmotion,
            ]}
            activeOpacity={0.7}
            onPress={() => handleSelect(emotion.id)}
          >
            <Text
              style={[
                styles.emotionText,
                {
                  fontSize: emotion.size <= 60 ? 9 : emotion.size <= 80 ? 12 : 14,
                },
                selectedEmotion === emotion.id && styles.selectedEmotionText,
              ]}
            >
              {emotion.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    gap: 12,
    paddingHorizontal: 24,
  },
  question: {
    fontWeight: "600",
    fontSize: 18,
    color: "#0C0A09",
    textTransform: "capitalize",
  },
  description: {
    fontWeight: "400",
    fontSize: 14,
    color: "#7F909F",
    textTransform: "capitalize",
  },
  emotionsContainer: {
    width: 375,
    height: 375,
    alignSelf: "center",
    marginTop: 44,
  },
  centerCircle: {
    position: "absolute",
    top: 66,
    left: 66,
    width: 243,
    height: 243,
    borderRadius: 121.5,
    borderWidth: 1,
    borderColor: "rgba(234, 236, 240, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  circle1: {
    width: 175,
    height: 175,
    borderRadius: 87.5,
    borderWidth: 1,
    borderColor: "rgba(234, 236, 240, 0.4)",
  },
  circle2: {
    position: "absolute",
    width: 115,
    height: 115,
    borderRadius: 57.5,
    borderWidth: 1,
    borderColor: "rgba(234, 236, 240, 0.4)",
    top: 64,
    left: 64,
  },
  emotionButton: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#F1F9FF",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedEmotion: {
    backgroundColor: "#19DBF2",
  },
  emotionText: {
    fontFamily: "Outfit",
    fontWeight: "900",
    color: "#7F909F",
    textTransform: "capitalize",
  },
  selectedEmotionText: {
    color: "#FFFFFF",
  },
}); 