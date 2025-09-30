import { cn } from "@/utils/cn";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export type Segment = {
  name: string;
  value: string;
  onClickAction: () => void;
};

interface SegmentedTabsProps {
  activeTab: string;
  segments: Segment[];
  buttonClassName?: string;
  buttonStyles?: string;
  showCount?: {
    name: string;
    count: number;
  }[];
  className?: string;
}

export const SegmentedTabs = ({
  activeTab,
  segments,
  buttonStyles,
  showCount,
  className,
}: SegmentedTabsProps) => {
  return (
    <View className={cn("w-full", className)}>
      <View className="relative w-full rounded-sm border border-gray-200 bg-gray-50 p-0.5">
        <View className="relative z-10 flex-row">
          {segments.map((segment: Segment) => {
            const countData = showCount?.find(
              (item) => item.name === segment.value
            );

            return (
              <TouchableOpacity
                key={segment.value}
                className={cn(
                  "z-20 flex-1 rounded-sm py-1 px-2",
                  activeTab === segment.value
                    ? "border border-gray-300 bg-white"
                    : "bg-transparent",
                  buttonStyles
                )}
                onPress={() => {
                  segment.onClickAction();
                }}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center justify-center">
                  <Text
                    className={cn(
                      "text-sm text-center",
                      activeTab === segment.value
                        ? "font-semibold text-black"
                        : "font-medium text-gray-700"
                    )}
                  >
                    {segment.name}
                  </Text>
                  {countData && (
                    <View
                      className={cn(
                        "ml-1 h-4 w-4 items-center justify-center rounded-full",
                        activeTab === segment.value
                          ? "bg-gray-100"
                          : "bg-gray-200"
                      )}
                    >
                      <Text className="text-[10px] font-medium text-gray-700">
                        {countData.count}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};
