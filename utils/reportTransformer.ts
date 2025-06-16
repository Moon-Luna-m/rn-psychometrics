import { imgProxy } from "./common";

// 定义各种组件的数据接口
interface MatchingResultData {
  result_key: string;
  score?: number;
  desc: string;
}

interface KeywordTagData {
  tags: string[];
}

interface RadarChartData {
  dimensions: string[];
  scores: number[];
}

interface VisualMeterData {
  label: string;
  value: number;
  max_value: number;
  unit: string;
}

interface TextProgressData {
  paragraphs: string[];
}

interface QuoteImageData {
  quote: string;
  author: string;
  image: string;
}

interface RecommendationData {
  suggestions: string[];
}

interface GrowthPathData {
  steps: string[];
}

interface BadgeData {
  badges: Array<{
    label: string;
    desc: string;
  }>;
}

interface MultiDimensionalData {
  dimensions: string[];
  scores: number[];
}

// 组件数据转换器
export const transformers = {
  // 匹配结果数据转换
  transformMatchingResultData: (data: MatchingResultData) => {
    return {
      key: data.result_key,
      score: data.score,
      description: data.desc,
      icon: getResultIcon(data.result_key), // 需要实现这个函数来返回对应的图标
    };
  },

  // 关键词标签数据转换
  transformKeywordTagData: (data: KeywordTagData) => {
    return {
      tags: data.tags.map((tag) => ({
        label: tag,
        color: getTagColor(tag), // 需要实现这个函数来返回对应的颜色
      })),
    };
  },

  // 引用图片数据转换
  transformQuoteImageData: (data: QuoteImageData) => {
    return {
      quote: data.quote,
      author: data.author,
      imageUrl: data.image,
    };
  },

  // 推荐建议数据转换
  transformRecommendationData: (data: RecommendationData) => {
    return {
      suggestions: data.suggestions.map((suggestion, index) => ({
        id: index + 1,
        content: suggestion,
      })),
    };
  },

  // 多维度数据转换
  transformMultiDimensionalData: (data: MultiDimensionalData) => {
    return {
      dimensions: data.dimensions.map((dim, index) => ({
        key: dim,
        value: data.scores[index],
        color: getColorByIndex(index),
        label: getDimensionLabel(dim), // 需要实现这个函数来返回维度标签
      })),
    };
  },

  // 雷达图数据转换
  transformRadarData: (data: RadarChartData) => {
    return {
      dimensions: data.dimensions.map((dim, index) => ({
        label: dim,
        value: data.scores[index],
        color: getColorByIndex(index),
        trend: data.scores[index] > 15 ? "up" : "down", // 示例阈值
      })),
    };
  },

  // 徽章数据转换
  transformBadgeData: (data: BadgeData) => {
    return {
      badges: data.badges.map((badge) => ({
        title: badge.label,
        description: badge.desc,
      })),
    };
  },

  // 成长路径数据转换
  transformGrowthPathData: (data: GrowthPathData) => {
    return {
      stages: data.steps.map((step, index) => ({
        title: step,
        description: getStageDescription(step), // 需要实现这个函数来返回阶段描述
        isCompleted: index < Math.floor(data.steps.length / 2), // 示例：将一半设为已完成
        isCurrentStage: index === Math.floor(data.steps.length / 2),
      })),
    };
  },

  // 视觉仪表盘数据转换
  transformVisualDashboardData: (data: VisualMeterData) => {
    return {
      currentValue: data.value,
      maxValue: data.max_value,
      level: calculateLevel(data.value), // 需要实现这个函数来计算等级
      completionRate: (data.value / data.max_value) * 100,
      label: data.label,
    };
  },

  // 文本进度数据转换
  transformTextProgressData: (data: TextProgressData) => {
    return {
      sections: data.paragraphs.map((text, index) => ({
        id: index + 1,
        content: text,
        isCompleted: true,
      })),
    };
  },
};

// 新增辅助函数
function getResultIcon(key: string) {
  return key ? imgProxy(key) : null;
}

function getTagColor(tag: string): string {
  const colorMap: Record<string, string> = {
    Creative: "#FF6B6B",
    Curious: "#4ECDC4",
    Adaptable: "#45B7D1",
    // 添加更多颜色映射
  };
  return colorMap[tag] || "#96CEB4";
}


function getDimensionLabel(dimension: string): string {
  const labelMap: Record<string, string> = {
    D: "支配性",
    I: "影响力",
    S: "稳定性",
    C: "服从性",
    // 添加更多标签映射
  };
  return labelMap[dimension] || dimension;
}

// 辅助函数
function getColorByIndex(index: number): string {
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];
  return colors[index % colors.length];
}


function getStageDescription(stage: string): string {
  // 根据阶段名称返回对应的描述
  const descriptionMap: Record<string, string> = {
    "Explore interests": "探索兴趣爱好，发现潜在发展方向",
    "Develop skills": "培养核心技能，提升专业能力",
    "Build confidence": "建立自信心，培养积极心态",
    // 添加更多描述映射
  };
  return descriptionMap[stage] || "";
}

function calculateLevel(value: number): string {
  if (value >= 90) return "S";
  if (value >= 80) return "A";
  if (value >= 70) return "B";
  if (value >= 60) return "C";
  return "D";
}

// 更新主转换函数
export function transformTestReport(reportData: any) {
  const { components, test_id, test_name, has_access } = reportData;

  const transformedComponents = components
    .map((component: any) => {
      switch (component.type) {
        case "MatchingResultBlock":
          return {
            type: "matchingResult",
            data: transformers.transformMatchingResultData(component.data),
          };
        case "KeywordTagBlock":
          return {
            type: "keywordTag",
            data: transformers.transformKeywordTagData(component.data),
          };
        case "QuoteImageBlock":
          return {
            type: "quoteImage",
            data: transformers.transformQuoteImageData(component.data),
          };
        case "RecommendationBox":
          return {
            type: "recommendation",
            data: transformers.transformRecommendationData(component.data),
          };
        case "MultiDimensionalBlock":
          return {
            type: "multiDimensional",
            data: transformers.transformMultiDimensionalData(component.data),
          };
        case "RadarChartBlock":
          return {
            type: "radar",
            data: transformers.transformRadarData(component.data),
          };
        case "BadgeBlock":
          return {
            type: "badge",
            data: transformers.transformBadgeData(component.data),
          };
        case "GrowthPathBlock":
          return {
            type: "growthPath",
            data: transformers.transformGrowthPathData(component.data),
          };
        case "VisualMeterBlock":
          return {
            type: "visualDashboard",
            data: transformers.transformVisualDashboardData(component.data),
          };
        case "TextProgressBlock":
          return {
            type: "textProgress",
            data: transformers.transformTextProgressData(component.data),
          };
        default:
          return null;
      }
    })
    .filter(Boolean);

  return {
    testId: test_id,
    testName: test_name,
    hasAccess: has_access,
    components: transformedComponents,
  };
}

// 使用示例
export function getTransformedReport(reportData: any) {
  return transformTestReport(reportData);
}

export const typeList = [
  {
    id: 1,
    key: "personality",
  },
  {
    id: 2,
    key: "emotion",
  },
  {
    id: 3,
    key: "relationship",
  },
  {
    id: 4,
    key: "career",
  },
  {
    id: 5,
    key: "youth",
  },
  {
    id: 6,
    key: "fun",
  },
] as const;

export type TestType = (typeof typeList)[number]["key"];

export function getTestTypeKey(type_id: number): TestType | undefined {
  return typeList.find((item) => item.id === type_id)?.key;
}

export function getTestTypeId(type_key: TestType): number | undefined {
  return typeList.find((item) => item.key === type_key)?.id;
}

// 使用示例：
// import { useTranslation } from "react-i18next";
// const { t } = useTranslation();
// const typeName = t(`test.types.${typeKey}.name`);
// const typeDescription = t(`test.types.${typeKey}.description`);
