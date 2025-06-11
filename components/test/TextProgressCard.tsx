import { px2hp } from '@/utils/common';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProgressItem {
  text: string;
  color: string;
}

interface TextProgressCardProps {
  title: string;
  subtitle: string;
  items: ProgressItem[];
}

export default function TextProgressCard({ title, subtitle, items }: TextProgressCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.progressList}>
        {items.map((item, index) => (
          <View key={index} style={styles.progressItem}>
            <View style={[styles.progressBar, { backgroundColor: item.color }]} />
            <Text style={styles.progressText}>{item.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    gap: px2hp(30),
    shadowColor: 'rgba(133, 146, 173, 0.2)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    gap: 4,
  },
  title: {
    fontFamily: 'Outfit',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.14,
    color: '#0C0A09',
  },
  subtitle: {
    fontFamily: 'Outfit',
    fontSize: 12,
    color: '#7F909F',
  },
  progressList: {
    gap: 30,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    width: 2,
    height: 32,
    borderRadius: 1,
  },
  progressText: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 17,
    color: '#8C92A3',
  },
}); 