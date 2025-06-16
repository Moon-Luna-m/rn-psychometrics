import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";

interface EmotionOption {
  id: string;
  content: string;
}

interface SingleEmotionChoiceProps {
  question: string;
  description: string;
  options: EmotionOption[];
  selectedEmotion?: string | null;
  onSelect?: (value: string) => void;
}

export const SingleEmotionChoice: React.FC<SingleEmotionChoiceProps> = ({
  question,
  description,
  options,
  selectedEmotion,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.question}>{question}</Text>
      </View>

      <View style={styles.emotionsContainer}>
        {options.map((emotion) => (
          <TouchableOpacity
            key={emotion.id}
            style={[
              styles.emotionButton,
              selectedEmotion === emotion.id && styles.selectedEmotion,
            ]}
            activeOpacity={0.7}
            onPress={() => onSelect?.(emotion.id)}
          >
            <Text
              style={[
                styles.emotionText,
                selectedEmotion === emotion.id && styles.selectedEmotionText,
              ]}
            >
              {emotion.content}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

type Style = {
  container: ViewStyle;
  question: TextStyle;
  description: TextStyle;
  content: ViewStyle;
  emotionsContainer: ViewStyle;
  emotionButton: ViewStyle;
  emotionText: TextStyle;
  selectedEmotion: ViewStyle;
  selectedEmotionText: TextStyle;
};

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  question: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0C0A09",
    marginBottom: 8,
    fontFamily: "Outfit",
  },
  description: {
    fontSize: 14,
    color: "#7F909F",
    marginBottom: 24,
    fontFamily: "Outfit",
  },
  content: {
    marginBottom: 32,
  },
  emotionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  emotionButton: {
    width: 100,
    height: 100,
    backgroundColor: "#F6F6F8",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    shadowColor: "rgba(36, 164, 179, 0.12)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 11,
  },
  selectedEmotion: {
    backgroundColor: "#19DBF2",
  },
  emotionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7F909F",
    textAlign: "center",
  },
  selectedEmotionText: {
    color: "#FFFFFF",
  },
});
