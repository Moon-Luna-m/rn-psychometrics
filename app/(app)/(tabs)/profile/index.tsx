import { selectUserInfo } from "@/store/slices/userSlice";
import { generateBlurhash, imgProxy, px2hp, px2wp } from "@/utils/common";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableHighlight,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

interface ServiceItem {
  id: string;
  icon: ImageSourcePropType;
  title: string;
  extra?: React.ReactNode;
}

interface ServiceSectionProps {
  title: string;
  items: ServiceItem[];
}

// 缓存服务项组件
const ServiceItemComponent = memo(
  ({
    service,
    index,
    itemsLength,
  }: {
    service: ServiceItem;
    index: number;
    itemsLength: number;
  }) => (
    <TouchableHighlight
      key={service.id}
      style={[
        styles.serviceItem,
        index < itemsLength - 1 && styles.serviceItemBorder,
      ]}
      onPress={() => {}}
      underlayColor="#F5F7FA"
    >
      <View style={styles.serviceContent}>
        <View style={styles.serviceMain}>
          <View style={styles.serviceIconContainer}>
            <Image
              source={service.icon}
              style={styles.serviceIcon}
              resizeMode="contain"
              fadeDuration={0}
            />
          </View>
          <Text numberOfLines={1} style={styles.serviceTitle}>
            {service.title}
          </Text>
        </View>
        <View style={styles.serviceExtra}>
          {service.extra}
          <View style={styles.serviceArrow}>
            <AntDesign name="arrowright" size={16} color="#333333" />
          </View>
        </View>
      </View>
    </TouchableHighlight>
  )
);

// 缓存服务区块组件
const ServiceSection = memo(({ title, items }: ServiceSectionProps) => (
  <View style={styles.serviceSection}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.servicesCard}>
      {items.map((service, index) => (
        <ServiceItemComponent
          key={service.id}
          service={service}
          index={index}
          itemsLength={items.length}
        />
      ))}
    </View>
  </View>
));

export default function Profile() {
  const userInfo = useSelector(selectUserInfo);
  const { t } = useTranslation();

  // 使用 useMemo 缓存服务数组
  const services = useMemo(
    () => [
      {
        id: "vip",
        icon: require("@/assets/images/profile/vip-service.png"),
        title: t("profile.popularServices.vip.title"),
        extra: (
          <View style={styles.vipExtra}>
            <LinearGradient
              colors={["#FFBA01", "#FFBA01", "#FF3201"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.vipDate}
            >
              <Text numberOfLines={1} style={styles.vipDateText}>
                {t("profile.popularServices.vip.expires")}: 2025.05.20
              </Text>
            </LinearGradient>
          </View>
        ),
      },
      {
        id: "wallet",
        icon: require("@/assets/images/profile/wallet.png"),
        title: t("profile.popularServices.wallet"),
      },
      {
        id: "favorites",
        icon: require("@/assets/images/profile/favorites.png"),
        title: t("profile.popularServices.favorites"),
      },
    ],
    [t]
  );

  // 使用 useMemo 缓存其他服务数组
  const otherServices = useMemo(
    () => [
      {
        id: "faq",
        icon: require("@/assets/images/profile/faq.png"),
        title: t("profile.otherServices.faq"),
      },
      {
        id: "settings",
        icon: require("@/assets/images/profile/settings.png"),
        title: t("profile.otherServices.settings"),
      },
    ],
    [t]
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#ABF1FF", "#F5F7FA"]} style={styles.gradient} />
      <SafeAreaView style={styles.content}>
        <View style={styles.header}>
          {/* 编辑按钮 */}
          <TouchableHighlight
            style={styles.editProfileButton}
            onPress={() => router.push("/profile/edit")}
            underlayColor="#F5F7FA"
          >
            <View style={styles.editButtonContent}>
              <View style={styles.editIcon}>
                <Image
                  source={require("@/assets/images/profile/edit.png")}
                  style={styles.editIconImage}
                  fadeDuration={0}
                />
              </View>
              <Text style={styles.editText}>{t("profile.edit")}</Text>
            </View>
          </TouchableHighlight>

          <View style={styles.avatarContainer}>
            {/* 头像容器 */}
            <View style={styles.avatarWrapper}>
              <ExpoImage
                source={{ uri: imgProxy(userInfo?.avatar) }}
                style={styles.avatar}
                placeholder={{ blurhash: generateBlurhash() }}
                contentFit="cover"
              />
              <View style={styles.editButton}>
                <Image
                  source={require("@/assets/images/profile/vip.png")}
                  style={styles.editButtonGradient}
                  fadeDuration={0}
                />
              </View>
            </View>

            {/* 用户名和性别 */}
            <View style={styles.userInfo}>
              <Text numberOfLines={1} style={styles.username}>
                {userInfo?.username}
              </Text>
              <View style={styles.genderTag}>
                {userInfo?.sex === 1 ? (
                  <Ionicons name="male" size={14} color="#1989F2" />
                ) : (
                  <SimpleLineIcons
                    name="symbol-female"
                    size={12}
                    color="#ED3ADE"
                  />
                )}
              </View>
            </View>
          </View>

          {/* 测试题选项卡 */}
          <TouchableHighlight
            style={styles.testCard}
            onPress={() => {}}
            underlayColor="#F5F7FA"
          >
            <View style={styles.testCardContent}>
              {/* 左侧图标 */}
              <View style={styles.testIconContainer}>
                <LinearGradient
                  colors={["#C3FDC6", "#8AEFFF"]}
                  style={styles.testIcon}
                >
                  <Image
                    source={require("@/assets/images/profile/test.png")}
                    style={styles.testIconImage}
                    fadeDuration={0}
                  />
                </LinearGradient>
              </View>

              {/* 右侧内容 */}
              <View style={styles.testInfo}>
                <Text numberOfLines={1} style={styles.testTitle}>
                  {t("profile.testCard.title")}
                </Text>
                <View style={styles.testStats}>
                  {/* 已完成 */}
                  <View style={styles.statItem}>
                    <Text numberOfLines={1} style={styles.statLabel}>
                      {t("profile.testCard.completed")}:
                    </Text>
                    <Text numberOfLines={1} style={styles.statValue}>
                      12
                    </Text>
                  </View>

                  {/* 分隔线 */}
                  <View style={styles.divider} />

                  {/* 未完成 */}
                  <View style={styles.statItem}>
                    <Text numberOfLines={1} style={styles.statLabel}>
                      {t("profile.testCard.notCompleted")}:
                    </Text>
                    <Text numberOfLines={1} style={styles.statValue}>
                      3
                    </Text>
                  </View>
                </View>
              </View>

              {/* 右侧箭头 */}
              <View style={styles.arrowContainer}>
                <AntDesign name="arrowright" size={16} color="#0C0A09" />
              </View>
            </View>
          </TouchableHighlight>

          <ScrollView>
            {/* 热门服务 */}
            <ServiceSection
              title={t("profile.popularServices.title")}
              items={services}
            />
            {/* 其他服务 */}
            <ServiceSection
              title={t("profile.otherServices.title")}
              items={otherServices}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  gradient: {
    position: "absolute",
    width: px2wp(375),
    height: px2hp(375),
    left: 0,
    top: 0,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: px2wp(16),
    paddingTop: px2hp(16),
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: "#FFFFFF",
    borderRadius: px2wp(45),
    paddingVertical: px2hp(6),
    paddingHorizontal: px2wp(12),
    gap: px2wp(2),
  },
  editButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: px2wp(2),
  },
  editIcon: {
    width: px2wp(16),
    height: px2wp(16),
    alignItems: "center",
    justifyContent: "center",
  },
  editText: {
    fontSize: px2wp(14),
    lineHeight: px2hp(17.64),
    fontFamily: "Outfit",
    fontWeight: "500",
    color: "#0C0A09",
  },
  editIconImage: {
    width: px2wp(16),
    height: px2wp(16),
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: px2hp(8),
  },
  avatarWrapper: {
    width: px2wp(72),
    height: px2wp(72),
    borderRadius: px2wp(36),
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: px2wp(36),
    borderWidth: 2.25,
    borderColor: "#FFFFFF",
  },
  editButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: px2wp(20),
    height: px2wp(20),
  },
  editButtonGradient: {
    width: "100%",
    height: "100%",
    borderRadius: px2wp(10),
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: px2hp(6),
    gap: px2wp(4),
  },
  username: {
    fontSize: px2wp(20),
    fontWeight: "600",
    color: "#0C0A09",
    fontFamily: "Outfit",
    maxWidth: px2wp(200),
  } as TextStyle,
  genderTag: {
    width: px2wp(20),
    height: px2wp(20),
    borderRadius: px2wp(10),
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  // 测试题卡片样式
  testCard: {
    marginTop: px2hp(20),
    backgroundColor: "#FFFFFF",
    borderRadius: px2wp(20),
    padding: px2wp(12),
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  testCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: px2wp(12),
  },
  testIconContainer: {
    width: px2wp(52),
    height: px2wp(52),
    borderRadius: px2wp(29.71),
    overflow: "hidden",
  },
  testIcon: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  testIconImage: {
    width: px2wp(40.86),
    height: px2wp(40.86),
  },
  testInfo: {
    flex: 1,
    gap: px2hp(8),
  },
  testTitle: {
    fontSize: px2wp(16),
    lineHeight: px2hp(20.16),
    fontFamily: "Outfit",
    fontWeight: "600",
    color: "#0C0A09",
  } as TextStyle,
  testStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: px2wp(12),
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: px2wp(4),
  },
  statLabel: {
    fontSize: px2wp(12),
    lineHeight: px2hp(15.12),
    fontFamily: "Outfit",
    fontWeight: "500",
    color: "#7F909F",
  } as TextStyle,
  statValue: {
    fontSize: px2wp(14),
    lineHeight: px2hp(17.64),
    fontFamily: "Outfit",
    fontWeight: "600",
    color: "#0C0A09",
  } as TextStyle,
  divider: {
    width: px2wp(1),
    height: px2hp(16),
    backgroundColor: "#F5F7FA",
  },
  arrowContainer: {
    width: px2wp(24),
    height: px2wp(24),
    borderRadius: px2wp(12),
    backgroundColor: "#F5F7FA",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceSection: {
    marginTop: px2hp(20),
  },
  sectionTitle: {
    fontSize: px2wp(14),
    lineHeight: px2hp(17.64),
    fontFamily: "Outfit",
    fontWeight: "700",
    color: "#0C0A09",
    marginBottom: px2hp(12),
  },
  servicesCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: px2wp(20),
  },
  serviceItem: {
    height: px2hp(56),
    justifyContent: "center",
    paddingHorizontal: px2wp(12),
  },
  serviceItemBorder: {
    // borderBottomWidth: 1,
    // borderBottomColor: "#F5F7FA",
  },
  serviceContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: px2wp(6),
  },
  serviceMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: px2wp(12),
    flex: 1,
    marginRight: px2wp(8),
  },
  serviceIconContainer: {
    width: px2wp(40),
    height: px2wp(40),
    borderRadius: px2wp(48.33),
    backgroundColor: "#F5F7FA",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceIcon: {
    width: px2wp(24),
    height: px2wp(24),
  },
  serviceTitle: {
    fontSize: px2wp(14),
    lineHeight: px2hp(17.64),
    fontFamily: "Outfit",
    fontWeight: "500",
    color: "#0C0A09",
    flex: 1,
  } as TextStyle,
  serviceExtra: {
    flexDirection: "row",
    alignItems: "center",
    gap: px2wp(4),
  },
  serviceArrow: {
    width: px2wp(24),
    height: px2wp(24),
    alignItems: "center",
    justifyContent: "center",
  },
  vipExtra: {
    flexDirection: "row",
    alignItems: "center",
    gap: px2wp(4),
  },
  vipDate: {
    borderRadius: px2wp(23),
    paddingVertical: px2hp(4),
    paddingHorizontal: px2wp(8),
  },
  vipDateText: {
    fontSize: px2wp(10),
    lineHeight: px2hp(12.6),
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "500",
    color: "#FFFFFF",
  } as TextStyle,
});
