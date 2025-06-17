import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface ColorGroup {
  colors: string[];
  label?: string;
}

interface ColorChoiceProps {
  question: string;
  description: string;
  colorGroups: ColorGroup[];
  selectedColor: number | null;
  onSelect: (index: number) => void;
  lowStrengthLabel?: string;
  highStrengthLabel?: string;
}

export function ColorChoice({
  question,
  description,
  colorGroups,
  selectedColor,
  onSelect,
  lowStrengthLabel = "Low strength",
  highStrengthLabel = "High strength",
}: ColorChoiceProps) {
  // 将所有颜色展平为一个数组
  const allColors = colorGroups.reduce((acc, group, groupIndex) => {
    return acc.concat(
      group.colors.map((color, strengthIndex) => ({
        color,
        groupIndex,
        strengthIndex,
      }))
    );
  }, [] as Array<{ color: string; groupIndex: number; strengthIndex: number }>);

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.colorGrid}>
        {allColors.map((item, index) => (
          <View
            style={styles.colorBoxContainer}
            key={`${item.groupIndex}-${item.strengthIndex}`}
          >
            <TouchableOpacity
              style={[
                styles.colorBox,
                { backgroundColor: item.color },
                selectedColor
                  ? selectedColor - 1 === index && styles.selectedColorBox
                  : null,
              ]}
              activeOpacity={0.7}
              onPress={() => onSelect(index + 1)}
            />
          </View>
        ))}
      </View>

      <View style={styles.labelContainer}>
        <Text style={styles.label}>{lowStrengthLabel}</Text>
        <Text style={styles.label}>{highStrengthLabel}</Text>
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
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  colorBoxContainer: {
    width: "12.5%",
    aspectRatio: 1,
    padding: 1.5,
  },
  colorBox: {
    width: "100%",
    height: "100%",
  },
  selectedColorBox: {
    transform: [{ scale: 2 }],
    shadowColor: "rgba(36, 164, 179, 0.32)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 1,
    shadowRadius: 22,
    elevation: 8,
    zIndex: 10,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "400",
    color: "#7F909F",
    textTransform: "uppercase",
    fontFamily: "Outfit",
  },
});
