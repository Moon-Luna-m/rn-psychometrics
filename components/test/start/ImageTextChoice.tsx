import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

interface ImageTextChoiceProps {
  question: string;
  description: string;
  options: Array<{
    key: string;
    text: string;
    color: string;
    shadowColor: string;
    pattern: "circle" | "square" | "triangle" | "diamond";
  }>;
  selectedOption: string | null;
  onSelect: (key: string) => void;
}

const PatternSvg = ({
  pattern,
  color,
}: {
  pattern: "circle" | "square" | "triangle" | "diamond";
  color: string;
}) => {
  const size = 80;
  const smallSize = 40;
  const opacity = 0.2;

  switch (pattern) {
    case "circle":
      return (
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2}
            fill={color}
            fillOpacity={opacity}
          />
          <Circle
            cx={smallSize / 2}
            cy={size - smallSize / 2}
            r={smallSize / 2}
            fill={color}
            fillOpacity={opacity}
          />
          <Circle
            cx={size - smallSize / 2}
            cy={size - smallSize / 2}
            r={smallSize / 2}
            fill={color}
            fillOpacity={opacity}
          />
        </Svg>
      );
    case "square":
      return (
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Rect
            x={0}
            y={0}
            width={smallSize}
            height={smallSize}
            fill={color}
            fillOpacity={opacity}
          />
          <Rect
            x={smallSize}
            y={0}
            width={smallSize}
            height={smallSize}
            fill={color}
            fillOpacity={opacity}
          />
          <Rect
            x={0}
            y={smallSize}
            width={smallSize}
            height={smallSize}
            fill={color}
            fillOpacity={opacity}
          />
        </Svg>
      );
    case "triangle":
      return (
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Path
            d={`M${size / 2} 0 L${size} ${size} L0 ${size} Z`}
            fill={color}
            fillOpacity={opacity}
          />
          <Path
            d={`M${smallSize / 2} ${size - smallSize} L${smallSize} ${size} L0 ${size} Z`}
            fill={color}
            fillOpacity={opacity}
          />
          <Path
            d={`M${size - smallSize / 2} ${size - smallSize} L${size} ${size} L${size - smallSize} ${size} Z`}
            fill={color}
            fillOpacity={opacity}
          />
        </Svg>
      );
    case "diamond":
      return (
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Path
            d={`M${size / 2} 0 L${size} ${size / 2} L${size / 2} ${size} L0 ${size / 2} Z`}
            fill={color}
            fillOpacity={opacity}
          />
          <Path
            d={`M${smallSize / 2} ${size - smallSize} L${smallSize} ${size - smallSize / 2} L${smallSize / 2} ${size} L0 ${size - smallSize / 2} Z`}
            fill={color}
            fillOpacity={opacity}
          />
          <Path
            d={`M${size - smallSize / 2} ${size - smallSize} L${size} ${size - smallSize / 2} L${size - smallSize / 2} ${size} L${size - smallSize} ${size - smallSize / 2} Z`}
            fill={color}
            fillOpacity={opacity}
          />
        </Svg>
      );
    default:
      return null;
  }
};

export function ImageTextChoice({
  question,
  description,
  options,
  selectedOption,
  onSelect,
}: ImageTextChoiceProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <View key={option.key} style={styles.optionRow}>
            {index % 2 === 0 && options[index + 1] && (
              <>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles.optionCard,
                    { backgroundColor: option.color },
                    {
                      shadowColor: option.shadowColor,
                      shadowOffset: { width: 0, height: 12 },
                      shadowOpacity: 1,
                      shadowRadius: 20,
                      elevation: 12,
                    },
                  ]}
                  onPress={() => onSelect(option.key)}
                >
                  <Text style={styles.optionKey}>{option.key}</Text>
                  <View style={styles.patternContainer}>
                    <PatternSvg pattern={option.pattern} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles.optionCard,
                    { backgroundColor: options[index + 1].color },
                    {
                      shadowColor: options[index + 1].shadowColor,
                      shadowOffset: { width: 0, height: 12 },
                      shadowOpacity: 1,
                      shadowRadius: 20,
                      elevation: 12,
                    },
                  ]}
                  onPress={() => onSelect(options[index + 1].key)}
                >
                  <Text style={styles.optionKey}>{options[index + 1].key}</Text>
                  <View style={styles.patternContainer}>
                    <PatternSvg
                      pattern={options[index + 1].pattern}
                      color="#FFFFFF"
                    />
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 32,
    fontFamily: "Outfit",
  },
  optionsContainer: {
    gap: 24,
  },
  optionRow: {
    flexDirection: "row",
    gap: 11,
  },
  optionCard: {
    flex: 1,
    height: 100,
    borderRadius: 12,
    padding: 8,
  },
  optionKey: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "Outfit",
  },
  patternContainer: {
    position: "absolute",
    right: 39,
    top: 10,
  },
});