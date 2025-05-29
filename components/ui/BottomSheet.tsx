import React, { useEffect, useState } from "react";
import {
    Modal,
    Platform,
    StyleSheet,
    TouchableOpacity,
    ViewStyle
} from "react-native";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  children,
  containerStyle,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(1000);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animateIn = () => {
    setModalVisible(true);
    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withTiming(0, {
      duration: 350,
    });
  };

  const animateOut = (callback?: () => void) => {
    opacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(
      1000,
      {
        duration: 200,
      },
      (finished) => {
        if (finished) {
          runOnJS(setModalVisible)(false);
          callback && runOnJS(callback)();
        }
      }
    );
  };

  useEffect(() => {
    if (visible) {
      animateIn();
    }
  }, [visible]);

  const handleClose = () => {
    animateOut(onClose);
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          overlayStyle,
        ]}
      >
        <TouchableOpacity
          style={[styles.overlay, { backgroundColor: "transparent" }]}
          activeOpacity={1}
          onPress={handleClose}
        >
          <Animated.View style={[styles.content, containerStyle, modalStyle]}>
            <TouchableOpacity activeOpacity={1}>{children}</TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    marginBottom: 40,
    marginHorizontal: 16,
  },
}); 