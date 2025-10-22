import { CombinedExerciseItem } from "@/services/graphql/queries/sequenceTypes";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ExerciseCardProps {
  exercise: CombinedExerciseItem;
  index: number;
  version: "long" | "short";
  onPress?: () => void;
}

const ExerciseCard = ({
  exercise,
  index,
  version,
  onPress,
}: ExerciseCardProps) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigate to exercise detail page
      router.push({
        pathname: "/exercise-detail",
        params: {
          exerciseId: exercise.id,
        },
      });
    }
  };
  const getInstructions = () => {
    if (exercise.type === "superset") {
      return exercise.sequentialExercises[0]?.shortVersion || "";
    }
    return version === "long"
      ? exercise.writtenInstructions
      : exercise.shortVersion;
  };

  const getMetrics = () => {
    if (exercise.type === "superset") {
      return {
        sets: exercise.sequentialExercises[0]?.sets || 0,
        reps: exercise.sequentialExercises[0]?.repetition || 0,
        time: exercise.sequentialExercises[0]?.time || 0,
      };
    }
    return {
      sets: exercise.sets || 0,
      reps: exercise.repetition || 0,
      time: exercise.time || 0,
    };
  };

  const metrics = getMetrics();
  const instructions = getInstructions();

  return (
    <TouchableOpacity
      className="bg-white p-4 rounded-lg border border-gray-200 mb-3"
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start">
        {/* Number Circle */}
        <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3 mt-0.5">
          <Text className="text-blue-600 font-semibold text-sm">
            {index + 1}
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1">
          {/* Title */}
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-semibold text-gray-900 text-base flex-1">
              {exercise.name}
            </Text>
            <Text className="text-gray-400 ml-2">→</Text>
          </View>

          {/* Instructions */}
          {instructions && (
            <Text className="text-sm text-gray-500 mb-3 leading-5">
              {instructions.length > 100
                ? `${instructions.substring(0, 100)}...`
                : instructions}
            </Text>
          )}

          {/* Metrics */}
          <View className="flex-row items-center">
            <View className="flex-row items-center mr-4">
              <Text className="text-gray-400 mr-1">👤</Text>
              <Text className="text-sm text-gray-600">{metrics.sets} sets</Text>
            </View>

            <View className="flex-row items-center mr-4">
              <Text className="text-gray-400 mr-1">💬</Text>
              <Text className="text-sm text-gray-600">{metrics.reps} reps</Text>
            </View>

            <View className="flex-row items-center">
              <Text className="text-gray-400 mr-1">⏰</Text>
              <Text className="text-sm text-gray-600">{metrics.time} min</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export { ExerciseCard };
