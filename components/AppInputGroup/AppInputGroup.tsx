import AppInput from "@/components/AppInput/AppInput";
import { cn } from "@/utils/cn";
import React from "react";
import { Text, View } from "react-native";

export interface AppInputItem {
  id: string;
  title: string;
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
  editable?: boolean;
  showArrow?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  titleClassName?: string;
  valueClassName?: string;
  testID?: string;
  errorMessage?: string;
  maxLength?: number;
}

export interface AppInputGroupProps {
  title?: string;
  inputs: AppInputItem[];
  className?: string;
  containerClassName?: string;
  separatorClassName?: string;
}

const AppInputGroup = React.forwardRef<View, AppInputGroupProps>(
  (
    {
      title,
      inputs,
      className,
      containerClassName,
      separatorClassName,
      ...props
    },
    ref
  ) => {
    return (
      <View>
        {title && (
          <View className="px-4 py-3">
            <Text className="text-base font-semibold text-gray-900">
              {title}
            </Text>
          </View>
        )}
        <View
          ref={ref}
          className={cn(
            "bg-white rounded-lg border border-gray-200",
            containerClassName
          )}
          {...props}
        >
          {inputs.map((input, index) => (
            <View key={input.id}>
              <View className="">
                <AppInput
                  title={input.title}
                  value={input.value}
                  placeholder={input.placeholder}
                  onChangeText={input.onChangeText}
                  onPress={input.onPress}
                  editable={input.editable}
                  showArrow={input.showArrow}
                  multiline={input.multiline}
                  numberOfLines={input.numberOfLines}
                  titleClassName={input.titleClassName}
                  valueClassName={input.valueClassName}
                  testID={input.testID}
                  maxLength={input.maxLength}
                  className="border-0 bg-transparent rounded-none"
                />
                {input.errorMessage && (
                  <View className="px-4 pb-2">
                    <Text className="text-sm text-red-500">
                      {input.errorMessage}
                    </Text>
                  </View>
                )}
              </View>
              {index < inputs.length - 1 && (
                <View className={cn("h-px bg-gray-200", separatorClassName)} />
              )}
            </View>
          ))}
        </View>
      </View>
    );
  }
);

AppInputGroup.displayName = "AppInputGroup";

export default AppInputGroup;
