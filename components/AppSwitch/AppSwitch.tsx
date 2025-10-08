import { cn } from "@/utils/cn";
import React, { useEffect, useRef } from "react";
import { Animated, TouchableOpacity, View } from "react-native";

export interface AppSwitchProps {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  testID?: string;
}

const AppSwitch = React.forwardRef<View, AppSwitchProps>(
  (
    {
      value = false,
      onValueChange,
      disabled = false,
      size = "md",
      className,
      testID,
      ...props
    },
    ref
  ) => {
    const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }, [value, animatedValue]);

    const handlePress = () => {
      if (!disabled && onValueChange) {
        onValueChange(!value);
      }
    };

    // Size configurations
    const sizeConfig = {
      sm: {
        trackWidth: 40,
        trackHeight: 20,
        thumbSize: 16,
        thumbMargin: 2,
      },
      md: {
        trackWidth: 50,
        trackHeight: 26,
        thumbSize: 20,
        thumbMargin: 3,
      },
      lg: {
        trackWidth: 60,
        trackHeight: 32,
        thumbSize: 24,
        thumbMargin: 4,
      },
    };

    const config = sizeConfig[size];

    const trackColor = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["#E5E7EB", "#4267B2"], // gray-200 to blue
    });

    const thumbTranslateX = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [
        config.thumbMargin,
        config.trackWidth - config.thumbSize - config.thumbMargin,
      ],
    });

    return (
      <TouchableOpacity
        ref={ref}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.8}
        testID={testID}
        className={cn(disabled && "opacity-50", className)}
        {...props}
      >
        <Animated.View
          style={{
            width: config.trackWidth,
            height: config.trackHeight,
            backgroundColor: trackColor,
            borderRadius: config.trackHeight / 2,
            justifyContent: "center",
          }}
        >
          <Animated.View
            style={{
              width: config.thumbSize,
              height: config.thumbSize,
              backgroundColor: "#FFFFFF",
              borderRadius: config.thumbSize / 2,
              transform: [{ translateX: thumbTranslateX }],
            }}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  }
);

AppSwitch.displayName = "AppSwitch";

export default AppSwitch;
