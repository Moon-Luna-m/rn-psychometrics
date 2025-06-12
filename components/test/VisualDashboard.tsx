import CircleProgress from "@/utils/circleProgress";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface VisualDashboardProps {
  value: number;
  level: string;
  completionRate: number;
}

interface CenterCoordinate {
  x: number;
  y: number;
}

const VisualDashboard: React.FC<VisualDashboardProps> = ({
  value,
  level,
  completionRate,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Comprehensive ability</Text>
        <Text style={styles.subtitle}>Comprehensive indicators</Text>
      </View>

      <View style={[styles.dashboardContainer]}>
        <Image
          source={require("@/assets/images/test/bg-circle.png")}
          style={styles.circleImage}
        />
        <View style={styles.circleContainer}>
          <Image
            source={require("@/assets/images/test/circle.png")}
            style={styles.circleImage}
          />
        </View>
        <View style={styles.progressContainer}>
          <CircleProgress
            size={240}
            width={50}
            rotation={205}
            arcSweepAngle={300}
            fill={value}
            backgroundColor="transparent"
            tintColor="url(#progressGradient)"
            childrenContainerStyle={styles.childrenContainer}
            renderCap={() => <></>}
          >
            {() => (
              <View style={styles.centerContent}>
                <Text style={styles.valueText}>{value}</Text>
                <Text style={styles.levelText}>{level}</Text>
              </View>
            )}
          </CircleProgress>
          <CircleProgress
            size={240}
            width={8}
            rotation={205}
            arcSweepAngle={300}
            fill={value}
            tintTransparency={false}
            backgroundColor="transparent"
            tintColor="url(#gradient)"
            lineCap="round"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Current value</Text>
          <Text style={styles.infoValue}>{value}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Level</Text>
          <Text style={[styles.infoValue, styles.levelValue]}>{level}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Completion rate</Text>
          <Text style={styles.infoValue}>{completionRate}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    gap: 30,
    alignItems: "center",
  },
  header: {
    alignSelf: "stretch",
    gap: 4,
  },
  title: {
    fontFamily: "Outfit",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.14,
    color: "#0C0A09",
  },
  subtitle: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#7F909F",
  },
  dashboardContainer: {
    width: 240,
    height: 240,
    position: "relative",
  },
  circleContainer: {
    position: "absolute",
    top: 31.5,
    left: -0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  circleImage: {
    width: 240,
    height: 240,
  },
  centerContent: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  valueText: {
    fontFamily: "Outfit",
    fontSize: 40,
    fontWeight: "500",
    color: "#0D0D12",
    lineHeight: 44,
  },
  levelText: {
    fontFamily: "Outfit",
    fontSize: 16,
    color: "#ADB5C2",
    letterSpacing: 0.2,
  },
  infoContainer: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
    gap: 12,
  },
  infoItem: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  infoLabel: {
    fontFamily: "Outfit",
    fontSize: 12,
    fontWeight: "500",
    color: "#7F909F",
  },
  infoValue: {
    fontFamily: "Outfit",
    fontSize: 24,
    fontWeight: "600",
    color: "#0C0A09",
  },
  levelValue: {
    fontSize: 15,
  },
  dot: {
    width: 100,
    height: 100,
    backgroundColor: "#1862FE",
  },
  backgroundProgress: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  childrenContainer: {
    backgroundColor: "transparent",
  },
  progressContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default VisualDashboard;
