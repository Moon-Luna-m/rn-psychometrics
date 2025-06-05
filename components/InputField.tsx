import { px2hp, px2wp } from "@/utils/common";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Controller } from "react-hook-form";
import {
  Keyboard,
  KeyboardTypeOptions,
  Platform,
  ReturnKeyTypeOptions,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import ErrorMessage from "./ErrorMessage";

interface InputFieldProps {
  control: any;
  name: string;
  label?: string;
  placeholder: string;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  errors: any;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  blurOnSubmit?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  control,
  name,
  label,
  placeholder,
  secureTextEntry = false,
  showPasswordToggle = false,
  errors,
  onSubmitEditing,
  keyboardType = "default",
  returnKeyType = "done",
  blurOnSubmit = false,
  containerStyle,
  inputStyle,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = React.useState(!secureTextEntry);
  const [isFocused, setIsFocused] = React.useState(false);

  const content = (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          containerStyle,
          isFocused && styles.inputWrapperFocused,
          errors[name] && styles.inputWrapperError,
        ]}
      >
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder={placeholder}
              value={value}
              onChangeText={onChange}
              onBlur={() => {
                setIsFocused(false);
                onBlur();
              }}
              onFocus={() => {
                !disabled && setIsFocused(true);
              }}
              secureTextEntry={!showPassword}
              style={[
                styles.input,
                inputStyle,
                Platform.OS === "web" && ({ outlineWidth: 0 } as any),
              ]}
              placeholderTextColor="#A9B0B8"
              keyboardType={keyboardType}
              returnKeyType={returnKeyType}
              onSubmitEditing={onSubmitEditing}
              enablesReturnKeyAutomatically={true}
              autoCapitalize={name === "email" ? "none" : "sentences"}
              autoComplete={
                name === "email"
                  ? "email"
                  : name === "password"
                  ? "password"
                  : "off"
              }
              editable={!disabled}
              autoCorrect={false}
            />
          )}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIconContainer}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={24}
              color="#A9B0B8"
            />
          </TouchableOpacity>
        )}
      </View>
      <ErrorMessage 
        message={errors[name]?.message} 
        visible={!!errors[name]} 
      />
    </View>
  );

  // 在 Web 平台直接返回内容，在其他平台使用 TouchableWithoutFeedback
  return Platform.OS === "web" ? (
    content
  ) : (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {content}
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  label: {
    fontFamily: "Outfit",
    fontSize: 16,
    fontWeight: "600",
    color: "#272829",
    marginBottom: px2hp(8),
  },
  inputWrapper: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: px2wp(12),
    paddingVertical: px2hp(10),
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  inputWrapperFocused: {
    borderColor: "#19DBF2",
  },
  inputWrapperError: {
    borderColor: "#EB5735",
  },
  input: {
    flex: 1,
    height: px2hp(28),
    fontFamily: "Outfit",
    fontSize: 14,
    fontWeight: "500",
    color: "#272829",
    padding: 0,
  },
  passwordInput: {
    paddingRight: px2wp(48),
  },
  eyeIconContainer: {
    marginLeft: px2wp(8),
    padding: 0,
  },
});

export default InputField;
