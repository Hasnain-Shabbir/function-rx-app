import { CheckmarkCircle, WorkoutStretching } from "@/assets/icons";
import Calendar from "@/assets/icons/svg/Calendar";
import InformationCircle from "@/assets/icons/svg/InformationCircle";
import PlayIcon from "@/assets/icons/svg/PlayIcon";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";
import { Button } from "../Button/Button";
import Tag from "../Tag/Tag";
import Typography from "../Typography/Typography";
import { LatestSequenceCardProps } from "./LatestSequenceCard.types";

const LatestSequenceCard = ({
  title = "Latest Sequence",
  sequenceName = "Posture Fix",
  date = "22 May 2025",
  completionCount = "Completed 3 times",
  progress = 0,
  totalProgress = 3,
  status = "To do",
  message = "You haven't completed this sequence today",
  onStart,
}: LatestSequenceCardProps) => {
  const progressPercentage = (progress / totalProgress) * 100;

  return (
    <LinearGradient
      colors={["#5171B1", "#364B76"]}
      className="rounded-3xl overflow-hidden p-4 gap-4 shadow-lg"
    >
      {/* Header */}
      <View className="flex-row justify-between items-center">
        <Typography
          variant="body1"
          fontWeight="semibold"
          className="text-white text-lg"
        >
          {title}
        </Typography>

        <Tag type="info" title={status} />
      </View>

      {/* Sequence Name + Sequence Details*/}
      <View>
        <Typography
          variant="body2"
          fontWeight="medium"
          className="text-white mb-1"
        >
          {sequenceName}
        </Typography>

        <View className="flex-row items-center">
          <View className="flex-row items-center mr-4 opacity-70 gap-1">
            <Calendar />
            <Typography variant="caption" className="text-white">
              {date}
            </Typography>
          </View>
          <Typography variant="caption" className="text-white/70 mr-4">
            •
          </Typography>
          <View className="flex-row items-center opacity-70 gap-1">
            <CheckmarkCircle color="white" size={16} />
            <Typography variant="caption" className="text-white">
              {completionCount}
            </Typography>
          </View>
        </View>

        {/* Progress Section */}

        <View className="flex-row items-center gap-2 mt-3">
          <View className="flex-1 bg-primary-800 rounded-lg overflow-hidden h-1">
            <View
              className="bg-white rounded-full h-2"
              style={{ width: `${progressPercentage}%` }}
            />
          </View>
          <View className="flex-row items-center">
            <WorkoutStretching color="#fff" size={14} />
            <Typography variant="caption" className="text-white ml-1">
              {progress}/{totalProgress}
            </Typography>
          </View>
        </View>
      </View>
      {/* Message */}
      <View className="flex-row items-center gap-1">
        <InformationCircle />
        <Typography
          variant="caption"
          className="text-white"
          fontWeight="medium"
        >
          {message}
        </Typography>
      </View>

      {/* Start Button */}
      <Button variant={"secondary"} leftIcon={<PlayIcon />}>
        Start Sequence
      </Button>
    </LinearGradient>
  );
};

export default LatestSequenceCard;
