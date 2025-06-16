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
  selectedColor: {
    groupIndex: number;
    strengthIndex: number;
  } | null;
  onSelect: (color: { groupIndex: number; strengthIndex: number }) => void;
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
  
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.colorGrid}>
        {colorGroups.map((group, groupIndex) => (
          <View 
            key={groupIndex} 
            style={[
              styles.colorRow,
              selectedColor?.groupIndex === groupIndex && { zIndex: 1 }
            ]}
          >
            {group.colors.map((color, strengthIndex) => (
              <TouchableOpacity
                key={`${groupIndex}-${strengthIndex}`}
                style={[
                  styles.colorBox,
                  { backgroundColor: color },
                  selectedColor?.groupIndex === groupIndex &&
                    selectedColor?.strengthIndex === strengthIndex &&
                    styles.selectedColorBox,
                ]}
                activeOpacity={0.7}
                onPress={() => onSelect({ groupIndex, strengthIndex })}
              />
            ))}
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
    gap: 3,
  },
  colorRow: {
    flexDirection: "row",
    gap: 3,
    overflow: "visible",
  },
  colorBox: {
    flex: 1,
    aspectRatio: 1,
    height: 38.25,
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
