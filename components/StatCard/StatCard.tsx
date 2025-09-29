import React from "react";
import { View } from "react-native";
import Typography from "../Typography/Typography";
import type { StatCardProps } from "./StatCard.types";

const StatCard = ({ title, count, icon: Icon }: StatCardProps) => {
  return (
    <View className="border-borderLight gap-2 border bg-white rounded-2xl p-2 max-w-[175px]">
      <View className="bg-primary-50 rounded-lg w-10 h-10 items-center justify-center">
        <Icon />
      </View>
      <View>
        <Typography
          variant="caption"
          className="text-medium"
          fontWeight="medium"
        >
          {title}
        </Typography>
        <Typography variant="body1" fontWeight="semibold">
          {count}
        </Typography>
      </View>
    </View>
  );
};

export default StatCard;
