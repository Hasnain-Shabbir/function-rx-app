import { cn } from "@/utils/cn";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export interface AppInputProps {
  title: string;
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
  editable?: boolean;
  showArrow?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  className?: string;
  titleClassName?: string;
  valueClassName?: string;
  testID?: string;
  maxLength?: number;
}

const AppInput = React.forwardRef<TextInput, AppInputProps>(
  (
    {
      title,
      value = "",
      placeholder = "Type here...",
      onChangeText,
      onPress,
      editable = true,
      showArrow = false,
      multiline = false,
      numberOfLines = 1,
      className,
      titleClassName,
      valueClassName,
      testID,
      maxLength,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    const isPressable = onPress && !editable;

    return (
      <TouchableOpacity
        onPress={isPressable ? onPress : undefined}
        activeOpacity={isPressable ? 0.7 : 1}
        disabled={!isPressable}
        className={cn(
          "flex-row items-center justify-between py-4 px-4 bg-white rounded-lg border border-gray-200",
          isFocused && "border-primary-500 bg-primary-50",
          !editable && "opacity-60",
          className
        )}
        testID={testID}
      >
        <View className="flex-1 flex-row items-center justify-between">
          <Text
            className={cn(
              "text-sm font-medium text-gray-700",
              isFocused && "text-primary-500",
              titleClassName
            )}
          >
            {title}
          </Text>

          <View className="flex-1 ml-4">
            {editable ? (
              <TextInput
                ref={ref}
                value={value}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                onChangeText={onChangeText}
                onFocus={handleFocus}
                onBlur={handleBlur}
                multiline={multiline}
                numberOfLines={numberOfLines}
                maxLength={maxLength}
                className={cn(
                  "text-base text-primary-500 py-1 text-right",
                  multiline ? "top" : "center"
                )}
                // style={{
                //   fontSize: 16,
                //   color: "#3B82F6", // primary-500
                //   paddingVertical: 0,
                //   textAlign: "right",
                //   textAlignVertical: multiline ? "top" : "center",
                // }}
                {...props}
              />
            ) : (
              <Text
                className={cn(
                  "text-base text-primary-500 text-right",
                  !value && "text-gray-400",
                  valueClassName
                )}
              >
                {value || placeholder}
              </Text>
            )}
          </View>
        </View>

        {showArrow && <Text className="text-gray-400 text-lg ml-3">›</Text>}
      </TouchableOpacity>
    );
  }
);

AppInput.displayName = "AppInput";

export default AppInput;
