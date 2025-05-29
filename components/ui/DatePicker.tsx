import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { BottomSheet } from "./BottomSheet";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  visible: boolean;
  onClose: () => void;
  mode?: "date" | "time" | "datetime";
  minimumDate?: Date;
  maximumDate?: Date;
  title?: string;
}

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

// 默认最小日期：1970年
const DEFAULT_MIN_DATE = new Date(1970, 0, 1);
// 默认最大日期：2100年
const DEFAULT_MAX_DATE = new Date(2100, 11, 31);

// 滚动视图组件
const PickerScrollView: React.FC<{
  items: number[];
  type: "year" | "month" | "day";
  currentValue: number;
  currentDate: Date;
  onValueChange: (value: number) => void;
}> = ({ items, type, currentValue, currentDate, onValueChange }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollValue, setScrollValue] = useState(currentValue);
  const [isScrolling, setIsScrolling] = useState(false);

  // 滚动到指定索引
  const scrollToIndex = (index: number, animated = true) => {
    if (index !== -1) {
      const y = index * ITEM_HEIGHT;
      scrollViewRef.current?.scrollTo({
        y,
        animated: Platform.OS !== "web" && animated,
      });
    }
  };

  // 当外部currentValue改变时，更新scrollValue和滚动位置
  useEffect(() => {
    if (!isScrolling) {
      if (items.includes(currentValue)) {
        setScrollValue(currentValue);
        const index = items.findIndex((item) => item === currentValue);
        scrollToIndex(index, false);
      } else {
        const nearestValue = items[items.length - 1];
        setScrollValue(nearestValue);
        const index = items.findIndex((item) => item === nearestValue);
        scrollToIndex(index, false);
        onValueChange(nearestValue);
      }
    }
  }, [currentValue, items]);

  // 处理滚动开始
  const handleScrollBegin = () => {
    setIsScrolling(true);
  };

  // 处理滚动结束
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIsScrolling(false);
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const value = items[index];

    if (value !== undefined) {
      setScrollValue(value);
      onValueChange(value);
    }
  };

  return (
    <View style={styles.pickerColumn}>
      <View style={styles.pickerMask} pointerEvents="none" />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        onScrollBeginDrag={handleScrollBegin}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        snapToAlignment="center"
        overScrollMode="never"
      >
        {items.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.pickerItem,
              item === scrollValue && styles.selectedItem,
            ]}
            onPress={() => {
              setScrollValue(item);
              onValueChange(item);
              const index = items.findIndex((i) => i === item);
              scrollToIndex(index);
            }}
          >
            <Text
              style={[
                styles.pickerItemText,
                item === scrollValue && styles.selectedText,
              ]}
            >
              {item.toString().padStart(2, "0")}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  visible,
  onClose,
  mode = "date",
  minimumDate = DEFAULT_MIN_DATE,
  maximumDate = DEFAULT_MAX_DATE,
  title,
}) => {
  const { t } = useTranslation();
  const [tempDate, setTempDate] = useState(value || new Date());

  // 在打开选择器时重置临时日期
  useEffect(() => {
    if (visible) {
      const initialDate = value ? new Date(value) : new Date();
      setTempDate(initialDate);
    }
  }, [visible, value]);

  const handleDateChange = useCallback(
    (type: "year" | "month" | "day", value: number) => {
      const newDate = new Date(tempDate);

      if (type === "year") {
        newDate.setFullYear(value);
      } else if (type === "month") {
        const currentDate = newDate.getDate();
        newDate.setDate(1);
        newDate.setMonth(value - 1);
        const maxDays = new Date(
          newDate.getFullYear(),
          newDate.getMonth() + 1,
          0
        ).getDate();
        newDate.setDate(Math.min(currentDate, maxDays));
      } else if (type === "day") {
        newDate.setDate(value);
      }

      if (newDate < minimumDate) {
        setTempDate(new Date(minimumDate));
      } else if (newDate > maximumDate) {
        setTempDate(new Date(maximumDate));
      } else {
        setTempDate(newDate);
      }
    },
    [tempDate, minimumDate, maximumDate]
  );

  const handleConfirm = useCallback(() => {
    onChange(tempDate);
    onClose();
  }, [tempDate, onChange, onClose]);

  const years = useMemo(() => {
    const minYear = minimumDate.getFullYear();
    const maxYear = maximumDate.getFullYear();
    return Array.from(
      { length: maxYear - minYear + 1 },
      (_, i) => minYear + i
    );
  }, [minimumDate, maximumDate]);

  const months = useMemo(() => {
    const currentYear = tempDate.getFullYear();
    let startMonth = 1;
    let endMonth = 12;

    if (currentYear === minimumDate.getFullYear()) {
      startMonth = minimumDate.getMonth() + 1;
    }
    if (currentYear === maximumDate.getFullYear()) {
      endMonth = maximumDate.getMonth() + 1;
    }

    return Array.from(
      { length: endMonth - startMonth + 1 },
      (_, i) => startMonth + i
    );
  }, [tempDate.getFullYear(), minimumDate, maximumDate]);

  const days = useMemo(() => {
    const currentYear = tempDate.getFullYear();
    const currentMonth = tempDate.getMonth() + 1;
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    let startDay = 1;
    let endDay = daysInMonth;

    if (
      currentYear === minimumDate.getFullYear() &&
      currentMonth === minimumDate.getMonth() + 1
    ) {
      startDay = minimumDate.getDate();
    }
    if (
      currentYear === maximumDate.getFullYear() &&
      currentMonth === maximumDate.getMonth() + 1
    ) {
      endDay = Math.min(endDay, maximumDate.getDate());
    }

    return Array.from(
      { length: endDay - startDay + 1 },
      (_, i) => startDay + i
    );
  }, [tempDate.getFullYear(), tempDate.getMonth(), minimumDate, maximumDate]);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.modalHeader}>
        <View style={styles.headerDivider} />
        <Text style={styles.modalTitle}>{title || t('common.selectDate')}</Text>
      </View>

      <View style={styles.pickerContainer}>
        <PickerScrollView
          items={years}
          type="year"
          currentValue={tempDate.getFullYear()}
          currentDate={tempDate}
          onValueChange={(value) => handleDateChange("year", value)}
        />
        <View style={styles.pickerDivider} />
        <PickerScrollView
          items={months}
          type="month"
          currentValue={tempDate.getMonth() + 1}
          currentDate={tempDate}
          onValueChange={(value) => handleDateChange("month", value)}
        />
        <View style={styles.pickerDivider} />
        <PickerScrollView
          items={days}
          type="day"
          currentValue={tempDate.getDate()}
          currentDate={tempDate}
          onValueChange={(value) => handleDateChange("day", value)}
        />
      </View>

      <View style={styles.modalFooter}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onClose}
        >
          <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmButtonText}>{t('common.confirm')}</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  modalHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  headerDivider: {
    width: 48,
    height: 5,
    backgroundColor: "#F3F4F6",
    borderRadius: 50,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#272829",
  },
  pickerContainer: {
    flexDirection: "row",
    height: PICKER_HEIGHT,
    marginVertical: 16,
    backgroundColor: "#F5F7FA",
    borderRadius: 16,
    overflow: "hidden",
  },
  pickerColumn: {
    flex: 1,
    height: PICKER_HEIGHT,
  },
  scrollView: {
    flex: 1,
    ...(Platform.OS === "web"
      ? {
          scrollSnapType: "y mandatory",
          WebkitOverflowScrolling: "touch",
        }
      : {}),
  },
  scrollViewContent: {
    paddingBottom: ITEM_HEIGHT * 2,
    paddingTop: ITEM_HEIGHT * 2,
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    ...(Platform.OS === "web"
      ? {
          scrollSnapAlign: "center",
          scrollSnapStop: "always",
          cursor: "default",
          WebkitScrollSnapAlign: "center",
          WebkitScrollSnapStop: "always",
        }
      : {}),
  },
  selectedItem: {
    // 移除背景色样式
  },
  pickerItemText: {
    fontSize: 16,
    color: "#272829",
    opacity: 0.5, // 未选中项文字透明度降低
  },
  selectedText: {
    color: "#19DBF2",
    fontWeight: "600",
    opacity: 1, // 选中项文字不透明
  },
  pickerDivider: {
    width: 1,
    backgroundColor: "#E5E7EB",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 78,
    borderWidth: 1,
    borderColor: "#19DBF2",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 78,
    backgroundColor: "#19DBF2",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#19DBF2",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  pickerMask: {
    position: "absolute",
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    zIndex: 1,
  },
  disabledItem: {
    opacity: 0.3,
  },
  disabledText: {
    color: "#999",
  },
});
