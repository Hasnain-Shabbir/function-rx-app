import { CheckmarkCircle } from "@/assets/icons";
import Calendar from "@/assets/icons/svg/Calendar";
import InformationCircle from "@/assets/icons/svg/InformationCircle";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";
import { Button } from "../Button/Button";
import Tag from "../Tag/Tag";
import Typography from "../Typography/Typography";
import { SequenceCardProps } from "./SequenceCard.types";

const SequenceCard = ({
  title = "Latest Sequence",
  sequenceName = "Posture Fix",
  date = "22 May 2025",
  completionCount = "Completed 3 times",
  progress = 0,
  totalProgress = 3,
  status = "To do",
  message = "You haven't completed this sequence today",
  onStart,
}: SequenceCardProps) => {
  const progressPercentage = (progress / totalProgress) * 100;

  return (
    <LinearGradient
      colors={["#5171B1", "#364B76"]}
      className="rounded-3xl overflow-hidden p-5 shadow-lg"
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3">
        <Typography
          variant="body1"
          fontWeight="semibold"
          className="text-white text-lg"
        >
          {title}
        </Typography>

        <Tag type="info" title={status} />
      </View>

      {/* Sequence Name */}
      <Typography
        variant="body2"
        fontWeight="medium"
        className="text-white mb-3"
      >
        {sequenceName}
      </Typography>

      {/* Details Row */}
      <View className="flex-row items-center mb-4">
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
      <View className="mb-4">
        <View className="bg-primary-700 rounded-full h-2 mb-2">
          <View
            className="bg-white rounded-full h-2"
            style={{ width: `${progressPercentage}%` }}
          />
        </View>
        <View className="flex-row items-center justify-end">
          <Typography variant="caption" className="text-white mr-1">
            🏃
          </Typography>
          <Typography
            variant="caption"
            fontWeight="medium"
            className="text-white"
          >
            {progress}/{totalProgress}
          </Typography>
        </View>
      </View>

      {/* Message */}
      <View className="flex-row items-center mb-4">
        <Typography variant="caption" className="text-primary-200 mr-2">
          ℹ️
        </Typography>
        <Typography variant="caption" className="text-primary-200">
          {message}
        </Typography>
      </View>

      {/* Start Button */}
      <Button variant={"secondary"} leftIcon={<InformationCircle />}>
        Start Sequence
      </Button>
    </LinearGradient>
  );
};

export default SequenceCard;
