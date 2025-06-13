import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const windowWidth = Dimensions.get("window").width;

interface Option {
  key: string;
  text: string;
}

interface SingleChoiceProps {
  question: string;
  options: Option[];
  selectedOption: string | null;
  onSelect: (key: string) => void;
}

export const SingleChoice: React.FC<SingleChoiceProps> = ({
  question,
  options,
  selectedOption,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{question}</Text>
      </View>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.optionItem,
              selectedOption === option.key && styles.optionItemSelected,
            ]}
            onPress={() => onSelect(option.key)}
            activeOpacity={0.7}
          >
            <View style={[styles.optionCircle]}>
              <Text
                style={[
                  styles.optionLetter,
                  selectedOption === option.key && styles.optionLetterSelected,
                ]}
              >
                {option.key}
              </Text>
            </View>
            <Text
              style={[
                styles.optionText,
                selectedOption === option.key && styles.optionTextSelected,
              ]}
            >
              {option.text}
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
    paddingHorizontal: 24,
  },
  questionContainer: {
    marginBottom: 44,
  },
  question: {
    fontSize: 18,
    color: "#0C0A09",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  optionsContainer: {
    gap: 24,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    boxShadow: "0px 4px 11px 0px rgba(36, 164, 179, 0.12)",
  },
  optionItemSelected: {
    backgroundColor: "#19DBF2",
    borderColor: "#19DBF2",
  },
  optionCircle: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  optionLetter: {
    fontSize: 16,
    color: "#0C0A09",
    lineHeight: 20,
    fontWeight: "900",
  },
  optionLetterSelected: {
    color: "#fff",
  },
  optionText: {
    fontSize: 16,
    color: "#7F909F",
    flex: 1,
    lineHeight: 20,
  },
  optionTextSelected: {
    color: "#FFFFFF",
  },
});
