import { px2wp } from "@/utils/common";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  TextInput,
  TextInputSubmitEditingEventData,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import SearchIcon from "./SearchIcon";

export default function SearchBar({
  onSearch,
  disabled = false,
  handlePress,
  autoFocus = false,
  value,
  onChangeText,
  onFocus,
  onBlur,
}: {
  onSearch?: (text: string) => void;
  disabled?: boolean;
  handlePress?: () => void;
  autoFocus?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  const { t } = useTranslation();
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchPress = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    if (Platform.OS !== "web") {
      Keyboard.dismiss();
    }
    onSearch?.(e.nativeEvent.text);
  };

  useEffect(() => {
    if (isFocused) {
      onFocus?.();
    } else {
      onBlur?.();
    }
  }, [isFocused]);

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View
        style={[
          styles.container,
          disabled && {
            shadowColor: "#A7A7A7",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 4,
          },
          isFocused && {
            borderWidth: 1,
            borderColor: "#19DBF2",
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <SearchIcon fill={isFocused ? "#19DBF2" : "#7F909F"} />
        </View>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={t("home.search.placeholder")}
          placeholderTextColor="rgba(12, 10, 9, 0.16)"
          returnKeyType="search"
          onSubmitEditing={handleSearchPress}
          editable={!disabled}
          autoFocus={autoFocus}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: px2wp(8),
    paddingHorizontal: px2wp(12),
    paddingVertical: px2wp(10),
    backgroundColor: "#FFFFFF",
    borderRadius: px2wp(40),
    borderWidth: 1,
    borderColor: "transparent",
  },
  iconContainer: {
    width: px2wp(24),
    height: px2wp(24),
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontFamily: "Outfit",
    fontSize: px2wp(14),
    fontWeight: "500",
    padding: 0,
    outlineWidth: 0,
  },
});
