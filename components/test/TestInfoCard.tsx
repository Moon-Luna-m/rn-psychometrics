import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View
} from "react-native";

interface TestInfoCardProps {
  questionCount: number;
  estimatedTime: string;
  source: string;
  tags: string[];
}

export default function TestInfoCard({
  questionCount,
  estimatedTime,
  source,
  tags,
}: TestInfoCardProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF4C97', '#FF94C1']}
        style={styles.header}
        start={{ x: 0, y: 0.1 }}
        end={{ x: 0, y: 1 }}
      >
        <Text style={styles.headerText}>Test Information</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <View style={[styles.infoItem, styles.borderGreen]}>
            <View style={[styles.iconContainer, styles.greenBg]}>
              <Image 
                source={require('@/assets/images/test/edit.png')} 
                style={styles.icon} 
              />
            </View>
            <View style={styles.textGroup}>
              <Text style={styles.label}>Number of questions</Text>
              <Text style={styles.value}>{questionCount} questions</Text>
            </View>
          </View>

          <View style={[styles.infoItem, styles.borderOrange]}>
            <View style={[styles.iconContainer, styles.orangeBg]}>
              <Image 
                source={require('@/assets/images/test/clock.png')} 
                style={styles.icon} 
              />
            </View>
            <View style={styles.textGroup}>
              <Text style={styles.label}>Estimated time</Text>
              <Text style={styles.value}>{estimatedTime} minutes</Text>
            </View>
          </View>

          <View style={[styles.infoItem, styles.borderPink]}>
            <View style={[styles.iconContainer, styles.pinkBg]}>
              <Image 
                source={require('@/assets/images/test/direct.png')} 
                style={styles.icon} 
              />
            </View>
            <View style={styles.textGroup}>
              <Text style={styles.label}>Data source</Text>
              <Text style={styles.value}>{source}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "rgba(100, 100, 111, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 1,
    shadowRadius: 33,
    elevation: 10,
  },
  header: {
    padding: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerText: {
    fontFamily: "Outfit",
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  content: {
    padding: 12,
    gap: 12,
  },
  infoContainer: {
    gap: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderRadius: 16,
  },
  borderGreen: {
    borderColor: "#CFF0EB",
  },
  borderOrange: {
    borderColor: "#FFEEEB",
  },
  borderPink: { 
    borderColor: "#FFEBFB",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  greenBg: {
    backgroundColor: "#CFF0EB",
    borderColor: "#CFF0EB",
  },
  orangeBg: {
    backgroundColor: "#FFEEEB",
    borderColor: "#FFEEEB",
  },
  pinkBg: {
    backgroundColor: "#FFEBFB",
    borderColor: "#FFEBFB",
  },
  icon: {
    width: 16,
    height: 16,
  },
  textGroup: {
    gap: 4,
    flex: 1,
  },
  label: {
    fontFamily: "Outfit",
    fontSize: 14,
    fontWeight: "600",
    color: "#0D120E",
    letterSpacing: 0.14,
  },
  value: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#7F909F",
    textTransform: "capitalize",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F1F6",
    marginVertical: 4,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#FFEBFB",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  tagText: {
    fontFamily: "Outfit",
    fontSize: 10,
    color: "#F28DDE",
    textTransform: "uppercase",
  },
}); 