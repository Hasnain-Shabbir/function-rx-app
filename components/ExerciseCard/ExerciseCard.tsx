import { RepeatIcon, WorkoutStretching } from "@/assets/icons";
import ChevronRight from "@/assets/icons/svg/ChevronRight";
import { Typography } from "@/components";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import type { ExerciseCardProps } from "./ExerciseCard.types";

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  name,
  count,
  sets,
  reps,
  imageSource,
  imageBackgroundColor = "bg-primary-200",
  onPress,
  className = "",
  isSkipped = false,
}) => {
  const CardContent = (
    <View
      className={`p-2 bg-white rounded-2xl items-center border gap-2 border-borderLight overflow-hidden flex-row ${className}`}
    >
      <View
        className={`w-[50px] h-[50px] ${imageBackgroundColor} rounded-sm relative`}
      >
        {imageSource ? (
          <Image
            source={
              typeof imageSource === "string"
                ? { uri: imageSource }
                : imageSource
            }
            className="w-full h-full rounded-sm"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full rounded-sm" />
        )}
        <View
          className={`${isSkipped ? "bg-red-500" : "bg-primary-500"} w-6 rounded-full items-center justify-center h-6 absolute -top-1 -right-1`}
        >
          <Typography variant="footer" className="text-white">
            {count}
          </Typography>
        </View>
      </View>

      <View className="flex-1">
        <View className="flex-row items-center">
          <Typography variant="body2" fontWeight="semibold">
            {name}
          </Typography>
          <ChevronRight />
        </View>
        <View className="flex-row items-center gap-1.5 mt-1">
          <View className="flex-row items-center gap-1">
            <WorkoutStretching size={16} color="#626e6b" />
            <Typography variant="caption" className="text-medium">
              {sets} sets
            </Typography>
          </View>

          <Typography variant="caption" className="text-medium">
            •
          </Typography>

          <View className="flex-row items-center gap-1">
            <RepeatIcon size={16} color="#626e6b" />
            <Typography variant="caption" className="text-medium">
              {reps} reps
            </Typography>
          </View>
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

export default ExerciseCard;
