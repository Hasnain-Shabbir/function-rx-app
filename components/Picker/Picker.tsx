import { cn } from "@/utils/cn";
import { Picker as RNPicker } from "@react-native-picker/picker";
import { cva } from "class-variance-authority";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export interface PickerItem {
  label: string;
  value: string | number;
}

export interface PickerProps {
  variant?: "default";
  inputSize?: "md" | "sm" | "lg" | "xs";
  label?: string;
  labelStyles?: string;
  isError?: boolean;
  errorMessage?: string;
  parentStyles?: string;
  addAsterisk?: boolean;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  selectedValue?: string | number;
  onValueChange?: (itemValue: string | number, itemIndex: number) => void;
  items: PickerItem[];
  className?: string;
}

const labelSize = {
  lg: "text-base leading-[20px] font-medium",
  sm: "text-sm font-medium leading-[20px]",
  md: "text-sm font-medium leading-[20px]",
  xs: "text-xs font-medium leading-[14px]",
};

const pickerVariants = cva(
  "border-borderDark flex w-full border bg-[#ffff] px-[12px]",
  {
    variants: {
      variant: {
        default: "",
      },
      inputSize: {
        lg: "h-[52px] rounded-md text-lg leading-[20px] font-normal",
        md: "h-[44px] rounded-md text-base font-normal",
        xs: "h-[30px] rounded-sm text-xs leading-[12px] font-normal",
        sm: "h-[36px] rounded-sm text-sm leading-[18px] font-normal",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  }
);

const Picker: React.FC<PickerProps> = ({
  className,
  variant,
  inputSize,
  label,
  labelStyles,
  isError,
  errorMessage,
  addAsterisk,
  required,
  disabled,
  placeholder,
  selectedValue,
  onValueChange,
  items,
  parentStyles = "",
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const showAsterisk = required && addAsterisk && !label?.includes("*");

  const getBorderColor = (focused: boolean, hasError: boolean) => {
    if (hasError) return "border-danger-400 border-2";
    if (focused) return "border-primary-300 border-2";
    return "";
  };

  const hasError = isError;
  const displayErrorMessage = errorMessage;

  return (
    <TouchableOpacity
      className={cn(
        "relative flex flex-col gap-2",
        disabled && "cursor-not-allowed",
        parentStyles
      )}
      activeOpacity={1}
    >
      {label && (
        <Text className={cn(labelSize[inputSize || "md"], labelStyles)}>
          {label}
          {showAsterisk && (
            <Text className="text-danger-500 font-medium">*</Text>
          )}
        </Text>
      )}
      <View
        className={cn(
          "flex",
          pickerVariants({ variant, inputSize }),
          getBorderColor(isFocused || false, hasError || false),
          isFocused ? "border-primary-300 border-2" : "",
          isError && "border-danger-400 border-2",
          disabled && "bg-gray-50",
          className
        )}
      >
        <RNPicker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={{
            flex: 1,
            height: "100%",
            color: "#000000",
            backgroundColor: "transparent",
            marginVertical: -8,
            marginHorizontal: -4,
          }}
          enabled={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          {placeholder && (
            <RNPicker.Item label={placeholder} value="" color="#9CA3AF" />
          )}
          {items.map((item, index) => (
            <RNPicker.Item
              key={index}
              label={item.label}
              value={item.value}
              color="#000000"
            />
          ))}
        </RNPicker>
      </View>

      {/* Error messages */}
      {hasError && displayErrorMessage && (
        <View className="">
          <View className="flex items-start gap-1">
            <Text className="text-danger-400 text-xs">
              {displayErrorMessage}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

Picker.displayName = "Picker";

export { labelSize, Picker, pickerVariants };
