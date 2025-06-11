import React from 'react';
import { Image, StyleSheet, Text, View } from "react-native";

interface FAQ {
  question: string;
  answer: string;
  icon: any; // 图标资源
}

interface FAQCardProps {
  faqs: FAQ[];
}

export default function FAQCard({ faqs }: FAQCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Frequently asked questions</Text>
      <View style={styles.faqContainer}>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            <View style={styles.iconContainer}>
              <Image source={faq.icon} style={styles.icon} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.question}>{faq.question}</Text>
              <Text style={styles.answer}>{faq.answer}</Text>
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
    gap: 30,
    shadowColor: "rgba(133, 146, 173, 0.2)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0C0A09",
    textTransform: "uppercase",
    letterSpacing: 0.14, // 1% of 14px
    fontFamily: "Outfit",
  },
  faqContainer: {
    gap: 30,
  },
  faqItem: {
    flexDirection: "row",
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    backgroundColor: "#ECF2FC",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 21.33,
    height: 21.33,
  },
  textContainer: {
    flex: 1,
    gap: 4,
    justifyContent: "center",
  },
  question: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0C0A09",
    fontFamily: "Outfit",
  },
  answer: {
    fontSize: 14,
    color: "#8C92A3",
    fontFamily: "Outfit",
  },
}); 