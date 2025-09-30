import { ExerciseCard } from "@/components/ExerciseCard/ExerciseCard";
import { SupersetCard } from "@/components/SupersetCard/SupersetCard";
import { CombinedExerciseItem } from "@/services/graphql/queries/sequenceTypes";
import React from "react";
import { View } from "react-native";

interface ExerciseListProps {
  exercises: CombinedExerciseItem[];
  version: "long" | "short";
  onExercisePress?: (exercise: CombinedExerciseItem, index: number) => void;
}

const ExerciseList = ({
  exercises,
  version,
  onExercisePress,
}: ExerciseListProps) => {
  return (
    <View className="gap-3">
      {exercises.map((exercise, index) => {
        if (exercise.type === "superset") {
          return (
            <SupersetCard
              key={exercise.id}
              superset={exercise}
              index={index}
              version={version}
              onPress={() => onExercisePress?.(exercise, index)}
            />
          );
        } else {
          return (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              index={index}
              version={version}
              onPress={() => onExercisePress?.(exercise, index)}
            />
          );
        }
      })}
    </View>
  );
};

export { ExerciseList };
