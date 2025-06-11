import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View
} from "react-native";

interface Trait {
  icon: ImageSourcePropType;
  label: string;
  value: number;
  color: string;
  description: string;
}

interface TraitCardProps {
  traits: Trait[];
}


export default function TraitCard({ traits }: TraitCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>What is your characteristic label?</Text>
      <View style={styles.traitsContainer}>
        {traits.map((trait, index) => (
          <View
            key={index}
            style={[
              styles.traitItem,
              index === traits.length - 1 && {
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
              },
              index !== traits.length - 1 && {
                width: "48.2%",
              },
            ]}
          >
            <View style={styles.iconContainer}>
              <Image source={trait.icon} style={styles.icon} />
            </View>
            <View style={styles.traitContent}>
              <Text style={styles.label}>{trait.label}</Text>
              <Text style={styles.description}>{trait.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    gap: 12,
    shadowColor: "rgba(100, 100, 111, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 33,
    shadowOpacity: 1,
    elevation: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: "Outfit",
    fontWeight: "600",
    color: "#0C0A09",
    textAlign: "center",
    textTransform: "capitalize",
  },
  traitsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 11,
  },
  traitItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    gap: 8,
    shadowColor: "rgba(100, 100, 111, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 33,
    shadowOpacity: 1,
    elevation: 5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#FAFAF9",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 32,
    height: 32,
  },
  traitContent: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontFamily: "Outfit",
    fontWeight: "600",
    color: "#0C0A09",
    letterSpacing: 0.14,
  },
  description: {
    fontSize: 12,
    fontFamily: "Outfit",
    color: "#7F909F",
    textTransform: "capitalize",
  },
});
