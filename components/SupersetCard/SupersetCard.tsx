import { CombinedExerciseItem } from "@/services/graphql/queries/sequenceTypes";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SupersetCardProps {
  superset: CombinedExerciseItem;
  index: number;
  version: "long" | "short";
  onPress?: () => void;
}

const SupersetCard = ({
  superset,
  index,
  version,
  onPress,
}: SupersetCardProps) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigate to exercise detail page for the first exercise in the superset
      const firstExercise = superset.sequentialExercises[0];
      if (firstExercise) {
        router.push({
          pathname: "/exercise-detail",
          params: {
            exerciseId: firstExercise.id,
          },
        });
      }
    }
  };
  const getSupersetReps = () => {
    return superset.repetition || 0;
  };

  const getFirstExerciseMetrics = () => {
    const firstExercise = superset.sequentialExercises[0];
    if (!firstExercise) return { sets: 0, time: 0 };

    return {
      sets: firstExercise.sets || 0,
      time: firstExercise.time || 0,
    };
  };

  const metrics = getFirstExerciseMetrics();
  const supersetReps = getSupersetReps();

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
              {superset.name}
            </Text>
            <Text className="text-gray-400 ml-2">→</Text>
          </View>

          {/* Superset Reps */}
          <View className="flex-row items-center mb-3">
            <Text className="text-gray-400 mr-1">💬</Text>
            <Text className="text-sm text-gray-600">{supersetReps} reps</Text>
          </View>

          {/* Nested Exercises */}
          <View className="ml-4">
            {superset.sequentialExercises.map((exercise, exerciseIndex) => (
              <View key={exercise.id} className="mb-2 last:mb-0">
                <Text className="font-medium text-gray-800 text-sm mb-1">
                  {exercise.name}
                </Text>

                {/* Exercise Metrics */}
                <View className="flex-row items-center">
                  <View className="flex-row items-center mr-4">
                    <Text className="text-gray-400 mr-1">👤</Text>
                    <Text className="text-xs text-gray-600">
                      {exercise.sets || 0} sets
                    </Text>
                  </View>

                  <View className="flex-row items-center mr-4">
                    <Text className="text-gray-400 mr-1">💬</Text>
                    <Text className="text-xs text-gray-600">
                      {exercise.repetition || 0} reps
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Text className="text-gray-400 mr-1">⏰</Text>
                    <Text className="text-xs text-gray-600">
                      {exercise.time || 0} min
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export { SupersetCard };
