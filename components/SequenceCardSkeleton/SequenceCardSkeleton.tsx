import { Skeleton } from "@/components/Skeleton/Skeleton";
import React from "react";
import { View } from "react-native";

const SequenceCardSkeleton = () => {
  return (
    <View className="bg-white p-4 rounded-lg border border-gray-200">
      {/* Sequence Title */}
      <View className="flex-row justify-between items-center mb-3">
        <Skeleton width={120} height={16} />
        <Skeleton width={100} height={16} />
      </View>

      {/* Practitioner */}
      <View className="flex-row justify-between items-center mb-3">
        <Skeleton width={100} height={16} />
        <View className="flex-row items-center">
          <Skeleton width={24} height={24} borderRadius={12} />
          <Skeleton width={120} height={16} className="ml-2" />
        </View>
      </View>

      {/* Date Created */}
      <View className="flex-row justify-between items-center mb-3">
        <Skeleton width={100} height={16} />
        <Skeleton width={80} height={16} />
      </View>

      {/* Exercise Count */}
      <View className="flex-row justify-between items-center mb-3">
        <Skeleton width={120} height={16} />
        <Skeleton width={30} height={16} />
      </View>

      {/* Status */}
      <View className="flex-row justify-between items-center mb-3">
        <Skeleton width={60} height={16} />
        <Skeleton width={80} height={24} borderRadius={12} />
      </View>

      {/* Actions */}
      <View className="flex-row justify-between items-center">
        <Skeleton width={70} height={16} />
        <Skeleton width={60} height={32} borderRadius={4} />
      </View>
    </View>
  );
};

export { SequenceCardSkeleton };
