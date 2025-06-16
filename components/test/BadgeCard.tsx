import { px2hp } from '@/utils/common';
import React from 'react';
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from 'react-native';

interface Badge {
  icon: any;
  title: string;
  description: string;
}

interface BadgeCardProps {
  badges: Badge[];
}

export default function BadgeCard({ badges }: BadgeCardProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("test.components.badge.title")}</Text>
        <Text style={styles.subtitle}>
          {t("test.components.badge.subtitle")}
        </Text>
      </View>

      <View style={styles.badgeList}>
        {badges.map((badge, index) => (
          <View key={index} style={styles.badgeItem}>
            <View style={styles.iconContainer}>
              <Image source={badge.icon} style={styles.icon} />
            </View>
            <View style={styles.badgeContent}>
              <Text style={styles.badgeTitle}>{badge.title}</Text>
              <Text style={styles.badgeDescription}>{badge.description}</Text>
            </View>
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
    gap: px2hp(12),
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
  badgeList: {
    gap: 12,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    gap: 8,
    shadowColor: 'rgba(100, 100, 111, 0.1)',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 1,
    shadowRadius: 33,
    elevation: 10,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#FAFAF9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 32,
    height: 32,
  },
  badgeContent: {
    flex: 1,
    gap: 4,
  },
  badgeTitle: {
    fontFamily: 'Outfit',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.14,
    color: '#0C0A09',
  },
  badgeDescription: {
    fontFamily: 'Outfit',
    fontSize: 12,
    color: '#7F909F',
  },
}); 