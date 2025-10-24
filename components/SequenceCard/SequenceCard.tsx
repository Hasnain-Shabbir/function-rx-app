import { CheckmarkCircle } from "@/assets/icons";
import Calendar from "@/assets/icons/svg/Calendar";
import React from "react";
import { View } from "react-native";
import Tag from "../Tag/Tag";
import Typography from "../Typography/Typography";
import { SequenceCardProps } from "./SequenceCard.types";

const SequenceCard = ({
  title = "Exercise sequence for legs",
  date = "10 May 2025",
  completionCount = "Completed 3 times",
  tag = "completed",
}: SequenceCardProps) => {
  const tagConfig = {
    completed: { title: "Completed", type: "success" as const },
    "in-progress": { title: "In Progress", type: "warning" as const },
    todo: { title: "To do", type: "info" as const },
  };

  const currentTagConfig = tagConfig[tag] || {
    title: "",
    type: "gray" as const,
  };

  return (
    <View className="p-4 rounded-2xl items-start gap-2 border border-borderLight bg-white">
      <Tag title={currentTagConfig.title} type={currentTagConfig.type} />
      <View>
        <Typography variant="body2" fontWeight="semibold">
          {title}
        </Typography>
        <View className="flex-row items-center mt-1 gap-2">
          <View className="flex-row items-center gap-1">
            <Calendar color="#626e6b" />
            <Typography variant="caption" className="text-medium">
              {date}
            </Typography>
          </View>
          <Typography variant="caption" className="text-medium">
            •
          </Typography>
          <View className="flex-row items-center gap-1">
            <CheckmarkCircle color="#626e6b" size={16} />
            <Typography variant="caption" className="text-medium">
              {completionCount}
            </Typography>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SequenceCard;
