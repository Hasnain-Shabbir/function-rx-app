import AppSwitch from "@/components/AppSwitch/AppSwitch";
import Typography from "@/components/Typography/Typography";
import { cn } from "@/utils/cn";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export interface ToggleInputProps {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  label?: string;
  subLabel?: string;
  disabled?: boolean;
  size?: "sm" | "lg";
  wrapperClickable?: boolean;
  className?: string;
  parentStyles?: string;
  testID?: string;
}

const ToggleInput = React.forwardRef<View, ToggleInputProps>(
  (
    {
      value = false,
      onValueChange,
      label,
      subLabel,
      disabled = false,
      size = "sm",
      wrapperClickable = false,
      className,
      parentStyles,
      testID,
      ...props
    },
    ref
  ) => {
    const handleWrapperPress = () => {
      if (wrapperClickable && !disabled && onValueChange) {
        onValueChange(!value);
      }
    };

    const handleSwitchChange = (newValue: boolean) => {
      if (!disabled && onValueChange) {
        onValueChange(newValue);
      }
    };

    const switchSize = size === "lg" ? "lg" : size === "sm" ? "sm" : "md";
    const labelVariant = size === "sm" ? "body2" : "body1";
    const subLabelSize = size === "sm" ? "text-xs" : "text-sm";

    return (
      <TouchableOpacity
        ref={ref}
        className={cn(
          "flex-row items-center gap-3",
          parentStyles,
          wrapperClickable && !disabled && "cursor-pointer",
          disabled && "opacity-50"
        )}
        onPress={wrapperClickable ? handleWrapperPress : undefined}
        activeOpacity={wrapperClickable ? 0.7 : 1}
        disabled={!wrapperClickable}
        testID={testID}
        {...props}
      >
        <AppSwitch
          value={value}
          onValueChange={handleSwitchChange}
          disabled={disabled}
          size={switchSize}
        />

        {label && (
          <View className="flex-1">
            <Typography
              variant={labelVariant}
              className="font-medium text-black"
            >
              {label}
            </Typography>
            {subLabel && (
              <Typography
                variant="caption"
                className={cn("text-gray-700", subLabelSize)}
              >
                {subLabel}
              </Typography>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  }
);

ToggleInput.displayName = "ToggleInput";

export default ToggleInput;
