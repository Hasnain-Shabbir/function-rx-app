// import {
//   CheckmarkCircle,
//   RepeatIcon,
//   WorkoutStretching,
// } from "@/assets/icons/svg";
import { Typography } from "@/components";
import React from "react";
import { Text, View } from "react-native";

interface ExerciseIconsBarProps {
  sets: number | string;
  reps: number | string;
  duration: string;
  version: string | null | undefined;
  availableInShortVersion?: boolean;
}

const ExerciseIconsBar = ({
  sets,
  reps,
  duration,
  version,
  availableInShortVersion = true,
}: ExerciseIconsBarProps) => {
  return (
    <View className="mt-2 flex-row flex-wrap items-center gap-2">
      <View className="flex-row items-center gap-1">
        {/* <WorkoutStretching width={16} height={16} color="#6B7280" /> */}
        <Typography variant="caption" className="text-gray-700">
          {sets} sets
        </Typography>
      </View>

      <Text className="text-xs text-gray-700">•</Text>
      <View className="flex-row items-center gap-1">
        {/* <RepeatIcon width={16} height={16} color="#6B7280" /> */}
        <Typography variant="caption" className="text-gray-700">
          {reps} reps
        </Typography>
      </View>

      <Text className="text-xs text-gray-700">•</Text>
      <View className="flex-row items-center gap-1">
        <Text className="text-gray-400">⏰</Text>
        <Typography variant="caption" className="text-gray-700">
          {duration}
        </Typography>
      </View>

      {availableInShortVersion && (
        <>
          <Text className="text-xs text-gray-700">•</Text>
          <View className="flex-row items-center gap-1">
            {/* <CheckmarkCircle width={16} height={16} color="#6B7280" /> */}
            <Typography variant="caption" className="text-gray-700">
              {version || "Long Version"}
            </Typography>
          </View>
        </>
      )}
    </View>
  );
};

export { ExerciseIconsBar };

