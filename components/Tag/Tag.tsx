import { colorPalette } from "@/constants/colorPalette";
import { cn } from "@/utils/cn";
import type { FC } from "react";
import { Text, View } from "react-native";

interface TagProps {
  title: string;
  size?: "sm" | "lg";
  dot?: boolean;
  shape?: "square" | "round";
  type?:
    | "gray"
    | "danger"
    | "info"
    | "warning"
    | "success"
    | "primary"
    | "grayLight";
  textClassName?: string;
}

const tagBackgroundMap = {
  gray: "bg-gray-100 border-gray-100",
  danger: "bg-danger-100 border-danger-100",
  warning: "bg-warning-100 border-warning-100",
  success: "bg-success-100 border-success-100",
  info: "bg-info-100 border-info-100",
  primary: "bg-primary-100 border-primary-100",
  grayLight: "bg-gray-50 border border-gray-200",
};

const tagDotMap = {
  gray: "bg-gray-500",
  danger: "bg-danger-500",
  warning: "bg-warning-500",
  success: "bg-success-500",
  info: "bg-info-500",
  primary: "bg-primary-500",
  grayLight: "bg-gray-300",
};

const Tag: FC<TagProps> = ({
  title,
  size = "sm",
  shape = "round",
  type = "success",
  dot = true,
  ...props
}) => {
  const sizeClass = size === "sm" ? "px-3 py-1 h-6" : "px-4 py-2 h-9";
  const textSizeClass = size === "sm" ? "text-xs" : "text-sm";
  const shapeClass = shape === "round" ? "rounded-full" : "rounded";

  // Get the first theme color (index 0) for primary type
  const firstThemeColor = colorPalette[0];
  const primaryBackgroundColor = firstThemeColor[100];
  const primaryDotColor = firstThemeColor[500];

  // Use inline styles for primary type to always use the first theme
  const isPrimary = type === "primary";
  const backgroundStyle = isPrimary
    ? {
        backgroundColor: primaryBackgroundColor,
        borderColor: primaryBackgroundColor,
      }
    : {};
  const dotStyle = isPrimary ? { backgroundColor: primaryDotColor } : {};

  return (
    <View
      className={cn(
        "flex-row items-center justify-center",
        !isPrimary && tagBackgroundMap[type],
        sizeClass,
        shapeClass
      )}
      style={backgroundStyle}
    >
      {shape === "round" && dot && (
        <View
          className={cn(
            "w-2 h-2 rounded-full mr-2",
            !isPrimary && tagDotMap[type]
          )}
          style={dotStyle}
        />
      )}
      <Text className={cn("font-medium", textSizeClass, props?.textClassName)}>
        {title}
      </Text>
    </View>
  );
};

export default Tag;
