import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Option {
  key: string;
  text: string;
}

interface SingleChoiceProps {
  question: string;
  options: Option[];
  selectedOption?: string | null;
  selectedOptions?: string[];
  onSelect: (value: string) => void;
  multiple?: boolean;
  maxSelect?: number;
}

export const SingleChoice: React.FC<SingleChoiceProps> = ({
  question,
  options,
  selectedOption,
  selectedOptions = [],
  onSelect,
  multiple = false,
  maxSelect,
}) => {
  const isSelected = (key: string) => {
    return multiple 
      ? selectedOptions.includes(key)
      : selectedOption === key;
  };

  return (
    <View style={styles.container}>
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{question}</Text>
        {multiple && maxSelect && (
          <Text style={styles.maxSelectHint}>
            {`请选择${maxSelect}项`}
          </Text>
        )}
      </View>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.optionItem,
              isSelected(option.key) && styles.optionItemSelected,
            ]}
            onPress={() => onSelect(option.key)}
            activeOpacity={0.7}
          >
            <View style={[styles.optionCircle]}>
              <Text
                style={[
                  styles.optionLetter,
                  isSelected(option.key) && styles.optionLetterSelected,
                ]}
              >
                {option.key}
              </Text>
            </View>
            <Text
              style={[
                styles.optionText,
                isSelected(option.key) && styles.optionTextSelected,
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
  },
  questionContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  question: {
    fontWeight: "600",
    fontSize: 18,
    color: "#0C0A09",
    textTransform: "capitalize",
  },
  maxSelectHint: {
    marginTop: 8,
    fontSize: 14,
    color: "#7F909F",
  },
  optionsContainer: {
    paddingHorizontal: 24,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(36, 164, 179, 0.12)",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 11,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  optionItemSelected: {
    backgroundColor: "#19DBF2",
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F5F7FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionLetter: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0C0A09",
  },
  optionLetterSelected: {
    color: "#FFFFFF",
    backgroundColor: "#19DBF2",
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: "#0C0A09",
  },
  optionTextSelected: {
    color: "#FFFFFF",
  },
});
