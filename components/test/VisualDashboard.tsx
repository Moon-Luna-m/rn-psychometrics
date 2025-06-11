import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, FeBlend, FeColorMatrix, FeComposite, FeFlood, FeGaussianBlur, FeOffset, Filter, G, LinearGradient, Path, Stop } from "react-native-svg";

interface VisualDashboardProps {
  value: number;
  level: string;
  completionRate: number;
}

const VisualDashboard: React.FC<VisualDashboardProps> = ({
  value,
  level,
  completionRate,
}) => {
  // 仪表盘配置
  const DASHBOARD_CONFIG = {
    size: 240,
    strokeWidth: 8,
    centerSize: 120,
    indicatorSize: 12,
    backgroundCircleRadius: 90,
    centerCircleRadius: 60,
  };

  // 计算进度
  const progress = value / 100;
  
  // 计算进度条路径
  const calculateProgressPath = (progress: number) => {
    const radius = DASHBOARD_CONFIG.backgroundCircleRadius;
    const center = DASHBOARD_CONFIG.size / 2;
    const padding = DASHBOARD_CONFIG.strokeWidth / 2;
    
    // 从正下方开始，顺时针方向
    const startAngle = Math.PI * 0.5; // 270度，正下方
    const endAngle = startAngle + progress * 2 * Math.PI; // 顺时针旋转
    
    const startX = center + radius * Math.cos(startAngle);
    const startY = center + radius * Math.sin(startAngle);
    const endX = center + radius * Math.cos(endAngle);
    const endY = center + radius * Math.sin(endAngle);
    
    // 计算是否超过180度
    const largeArcFlag = progress > 0.5 ? 1 : 0;
    
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };

  // 计算指示器位置
  const calculateIndicatorPosition = (progress: number) => {
    const radius = DASHBOARD_CONFIG.backgroundCircleRadius;
    const center = DASHBOARD_CONFIG.size / 2;
    const angle = Math.PI * 0.5 + progress * 2 * Math.PI; // 从正下方开始，顺时针方向
    
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const indicatorPos = calculateIndicatorPosition(progress);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Comprehensive ability</Text>
        <Text style={styles.subtitle}>Comprehensive indicators</Text>
      </View>

      <View style={[styles.dashboardContainer]}>
        <Svg 
          width={DASHBOARD_CONFIG.size + DASHBOARD_CONFIG.strokeWidth} 
          height={DASHBOARD_CONFIG.size + DASHBOARD_CONFIG.strokeWidth}
        >
          <Defs>
            <LinearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#076EFF" />
              <Stop offset="1" stopColor="#A880DA" />
            </LinearGradient>
            <Filter 
              id="shadow" 
              x="0" 
              y="0" 
              width="206" 
              height="206" 
              filterUnits="userSpaceOnUse" 
              color-interpolation-filters="sRGB"
            >
              <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
              <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <FeOffset dy="27"/>
              <FeGaussianBlur stdDeviation="21.5"/>
              <FeComposite in2="hardAlpha" operator="out"/>
              <FeColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.668275 0 0 0 0 0.476224 0 0 0 0.44 0"/>
              <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
              <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
            </Filter>
          </Defs>

          {/* 背景圆 */}
          <Circle
            cx={DASHBOARD_CONFIG.size / 2}
            cy={DASHBOARD_CONFIG.size / 2}
            r={DASHBOARD_CONFIG.size / 2}
            fill="#FEF7F3"
          />

          {/* 中心白色圆 带阴影 */}
          <G filter="url(#shadow)">
            <Circle
              cx={DASHBOARD_CONFIG.size / 2}
              cy={DASHBOARD_CONFIG.size / 2}
              r={DASHBOARD_CONFIG.centerCircleRadius}
              fill="white"
            />
          </G>

          {/* 进度条 */}
          <Path
            d={calculateProgressPath(progress)}
            stroke="url(#strokeGradient)"
            strokeWidth={8}
            strokeLinecap="round"
            fill="none"
            strokeDasharray="0"
          />

          {/* 指示器 */}
          <Circle
            cx={indicatorPos.x}
            cy={indicatorPos.y}
            r={DASHBOARD_CONFIG.indicatorSize / 2}
            fill="#1862FE"
          />
        </Svg>

        <View style={styles.centerContent}>
          <Text style={styles.valueText}>{value}</Text>
          <Text style={styles.levelText}>{level}</Text>
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
    width: 248,
    height: 248,
    position: "relative",
  },
  centerContent: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -53.5 }, { translateY: -35.5 }],
    alignItems: "center",
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
});

export default VisualDashboard; 