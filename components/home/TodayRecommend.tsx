import { icons } from "@/assets/static";
import { GetTestListByTypeResponse } from "@/services/testServices";
import {
  formatCompact,
  formatCurrency,
  imgProxy,
  px2hp,
  px2wp,
} from "@/utils/common";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import StarIcon from "./StarIcon";

interface RecommendCardProps {
  item: GetTestListByTypeResponse["list"][0];
  onPress?: () => void;
}

const RecommendCard: React.FC<RecommendCardProps> = ({ item, onPress }) => {
  const icon = icons[Number(item.image.split("/")[2].split(".")[0]) - 1];
  const { t } = useTranslation();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={[icon.bg.from, icon.bg.to]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Image
        source={icon.icon}
        style={[
          styles.cardIcon,
          {
            transform: [{ rotate: `${icon.rotate}deg` }],
          },
        ]}
        resizeMode="contain"
      />
      <View style={styles.cardContent}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {item.desc}
          </Text>
          <View style={styles.participants}>
            <View style={styles.avatars}>
              {item.user_avatars?.slice(0, 3).map((avatar, index) => (
                <Image
                  key={index}
                  source={{ uri: imgProxy(avatar) }}
                  style={[
                    styles.avatar,
                    {
                      marginLeft: index > 0 ? px2wp(-6) : 0,
                      zIndex: 3 - index,
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.participantsCount}>
              {item.total ? formatCompact(item.total) : ""}
            </Text>
          </View>
        </View>
        {Platform.OS === "ios" ? (
          <BlurView intensity={12} tint="light" style={styles.cardFooter}>
            <View style={styles.priceContainer}>
              <Text
                style={[
                  styles.price,
                  item.discount_price === 0 && {
                    color: "#42B969",
                  },
                ]}
              >
                {item.discount_price === 0
                  ? t("home.recommend.free")
                  : `${formatCurrency(item.discount_price / 100)}`}
              </Text>
              {item.discount_price !== 0 && (
                <Text style={styles.originalPrice}>
                  {formatCurrency(item.price / 100)}
                </Text>
              )}
            </View>
            <View style={styles.rating}>
              <StarIcon />
              <Text style={styles.ratingText}>{item.star}</Text>
            </View>
          </BlurView>
        ) : (
          <View style={[styles.cardFooter, styles.cardFooterAndroid]}>
            <View style={styles.priceContainer}>
              <Text
                style={[
                  styles.price,
                  item.discount_price === 0 && {
                    color: "#42B969",
                  },
                ]}
              >
                {item.discount_price === 0
                  ? t("home.recommend.free")
                  : `${formatCurrency(item.discount_price / 100)}`}
              </Text>
              {item.discount_price !== 0 && (
                <Text style={styles.originalPrice}>
                  {formatCurrency(item.price / 100)}
                </Text>
              )}
            </View>
            <View style={styles.rating}>
              <StarIcon />
              <Text style={styles.ratingText}>{item.star}</Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function TodayRecommend({
  data,
}: {
  data: GetTestListByTypeResponse["list"];
}) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/home/well.png")}
          style={styles.headerIcon}
        />
        <Text style={styles.headerTitle}>{t("home.recommend.title")}</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {data.map((item, index) => (
          <RecommendCard
            key={index}
            item={item}
            onPress={() => {
              router.push({
                pathname: "/test/[id]",
                params: {
                  id: item.id.toString(),
                },
              });
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: px2hp(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: px2wp(4),
    paddingHorizontal: px2wp(16),
    paddingVertical: px2wp(6),
    marginBottom: px2hp(12),
  },
  headerIcon: {
    width: px2wp(20),
    height: px2wp(20),
  },
  headerTitle: {
    fontFamily: "Outfit-SemiBold",
    fontSize: px2wp(16),
    lineHeight: px2wp(20),
    color: "#0C0A09",
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: px2wp(16),
    gap: px2wp(8),
    paddingBottom: px2hp(12),
  },
  card: {
    width: px2wp(156),
    height: px2hp(180),
    borderRadius: px2wp(20),
    overflow: "hidden",
  },
  cardIcon: {
    position: "absolute",
    top: px2hp(59),
    left: px2wp(56),
    width: px2wp(120),
    height: px2hp(120),
  },
  cardContent: {
    flex: 1,
    paddingTop: px2wp(16),
    justifyContent: "space-between",
  },
  cardInfo: {
    gap: px2wp(6),
    paddingHorizontal: px2wp(12),
  },
  cardTitle: {
    fontFamily: "Outfit-Medium",
    fontSize: px2wp(14),
    lineHeight: px2wp(18),
    color: "#FFFFFF",
    fontWeight: "500",
  },
  cardSubtitle: {
    fontFamily: "Outfit",
    fontSize: px2wp(10),
    lineHeight: px2wp(13),
    color: "rgba(255, 255, 255, 0.6)",
    letterSpacing: px2wp(0.2),
    fontWeight: "400",
  },
  participants: {
    flexDirection: "row",
    alignItems: "center",
    gap: px2wp(4),
  },
  avatars: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: px2wp(16),
    height: px2wp(16),
    borderRadius: px2wp(16),
    borderWidth: 0.5,
    borderColor: "#FFFFFF",
  },
  participantsCount: {
    fontFamily: "Outfit",
    fontSize: px2wp(12),
    lineHeight: px2wp(15),
    color: "#FFFFFF",
    letterSpacing: px2wp(0.06),
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: px2wp(8),
    paddingHorizontal: px2wp(12),
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  cardFooterAndroid: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(3px)",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: px2wp(4),
  },
  price: {
    fontFamily: "Outfit-Bold",
    fontSize: px2wp(16),
    lineHeight: px2wp(20),
    color: "#FF6F00",
    fontWeight: "700",
  },
  originalPrice: {
    fontFamily: "Outfit",
    fontSize: px2wp(10),
    lineHeight: px2wp(13),
    color: "rgba(12, 10, 9, 0.16)",
    textDecorationLine: "line-through",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: px2wp(4),
  },
  ratingText: {
    fontFamily: "Outfit-Medium",
    fontSize: px2wp(12),
    lineHeight: px2wp(15),
    color: "#0C0A09",
  },
});
