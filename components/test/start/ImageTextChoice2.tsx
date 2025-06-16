import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface ImageTextChoice2Props {
  question: string;
  description: string;
  options: Array<{
    key: string;
    title: string;
    subtitle: string;
    color: string;
    icon: "heart" | "smile" | "leaf" | "brain" | "sun" | "star";
  }>;
  selectedOption: string | null;
  onSelect: (key: string) => void;
}

const IconSvg = ({
  icon,
  color = "#FFFFFF",
}: {
  icon: "heart" | "smile" | "leaf" | "brain" | "sun" | "star";
  color?: string;
}) => {
  const size = 24;

  switch (icon) {
    case "heart":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M17.04 21.98c-.47 0-.93-.12-1.35-.35l-4.85-2.68c-.51-.28-1.16-.28-1.67 0l-4.85 2.68c-.9.5-2 .5-2.9 0-.9-.5-1.46-1.45-1.46-2.47V7.15c0-3.53 2.87-6.4 6.4-6.4h8.27c3.53 0 6.4 2.87 6.4 6.4v12.01c0 1.02-.56 1.97-1.46 2.47-.42.23-.88.35-1.35.35h-.18z"
            fill={color}
          />
        </Svg>
      );
    case "smile":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M22.5 12c0 5.52-4.48 10-10 10S2.5 17.52 2.5 12s4.48-10 10-10 10 4.48 10 10z"
            fill={color}
          />
        </Svg>
      );
    case "leaf":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M20 3c-2 0-6 1-9 4s-4 7-4 9 1 3 3 3 7-1 10-4 4-7 4-9-2-3-4-3z"
            fill={color}
          />
        </Svg>
      );
    case "brain":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10z"
            fill={color}
          />
        </Svg>
      );
    case "sun":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
            stroke={color}
            strokeWidth={2}
            fill="none"
          />
          <Path
            d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case "star":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12.86 3.46L14.89 7.6c.23.47.67.79 1.18.86l4.46.65c1.28.19 1.79 1.76.86 2.67l-3.23 3.15c-.37.36-.54.88-.45 1.38l.76 4.44c.22 1.27-1.12 2.24-2.26 1.64l-3.99-2.1c-.45-.24-.99-.24-1.44 0l-3.99 2.1c-1.14.6-2.48-.37-2.26-1.64l.76-4.44c.09-.5-.08-1.02-.45-1.38l-3.23-3.15c-.93-.91-.42-2.48.86-2.67l4.46-.65c.51-.07.95-.39 1.18-.86l2.03-4.14c.57-1.17 2.24-1.17 2.81 0z"
            fill={color}
          />
        </Svg>
      );
    default:
      return null;
  }
};

export function ImageTextChoice2({
  question,
  description,
  options,
  selectedOption,
  onSelect,
}: ImageTextChoice2Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.key}
            activeOpacity={0.7}
            style={[
              styles.optionCard,
              {
                borderColor: selectedOption === option.key ? "#19DBF2" : "#F3F4F6",
                backgroundColor: "#FFFFFF",
              },
            ]}
            onPress={() => onSelect(option.key)}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: option.color },
              ]}
            >
              <IconSvg icon={option.icon} />
            </View>
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.title,
                  { color: option.color },
                ]}
              >
                {option.title}
              </Text>
              <Text style={styles.subtitle}>{option.subtitle}</Text>
            </View>
          </TouchableOpacity>
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
    gap: 12,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 43,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
    fontFamily: "Outfit",
  },
  subtitle: {
    fontSize: 16,
    color: "#7F909F",
    fontFamily: "Outfit",
  },
}); 