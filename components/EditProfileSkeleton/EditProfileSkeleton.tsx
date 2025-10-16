import { Skeleton } from "@/components/Skeleton/Skeleton";
import React from "react";
import { View } from "react-native";

const EditProfileSkeleton = () => {
  return (
    <>
      {/* Header Skeleton */}
      <View className="bg-white border-b border-gray-200 px-4 py-4 flex-row items-center justify-between">
        {/* Back Button Skeleton */}
        <Skeleton width={20} height={20} borderRadius={8} />

        {/* Title Skeleton */}
        <Skeleton width={100} height={20} />

        {/* Save Button Skeleton */}
        <Skeleton width={40} height={20} />
      </View>

      <View className="flex-1 p-5">
        {/* Profile Image Skeleton */}
        <View className="items-center mb-8">
          <Skeleton width={120} height={120} borderRadius={60} />
        </View>

        <View className="gap-6">
          {/* Personal Details Group Skeleton */}
          <View>
            {/* Group Title - positioned outside container like AppInputGroup */}
            <View className="px-4 py-3">
              <Skeleton width={140} height={20} />
            </View>

            {/* Input Container */}
            <View className="bg-white rounded-lg border border-gray-200">
              {/* First Name */}
              <View className="flex-row items-center h-16 justify-between py-4 px-4">
                <Skeleton width={80} height={16} />
                <Skeleton width={120} height={16} />
              </View>

              {/* Separator */}
              <View className="h-px bg-gray-200" />

              {/* Last Name */}
              <View className="flex-row items-center h-16 justify-between py-4 px-4">
                <Skeleton width={80} height={16} />
                <Skeleton width={120} height={16} />
              </View>

              {/* Separator */}
              <View className="h-px bg-gray-200" />

              {/* Email */}
              <View className="flex-row items-center h-16 justify-between py-4 px-4">
                <Skeleton width={50} height={16} />
                <Skeleton width={150} height={16} />
              </View>

              {/* Separator */}
              <View className="h-px bg-gray-200" />

              {/* Phone */}
              <View className="flex-row items-center h-16 justify-between py-4 px-4">
                <Skeleton width={100} height={20} />
                <Skeleton width={130} height={20} />
              </View>

              {/* Separator */}
              <View className="h-px bg-gray-200" />

              {/* Gender */}
              <View className="flex-row items-center h-16 justify-between py-4 px-4">
                <Skeleton width={60} height={16} />
                <View className="flex-row items-center">
                  <Skeleton width={100} height={16} />
                  <Skeleton width={16} height={16} className="ml-3" />
                </View>
              </View>

              {/* Separator */}
              <View className="h-px bg-gray-200" />

              {/* Date of Birth */}
              <View className="flex-row items-center h-16 justify-between py-4 px-4">
                <Skeleton width={90} height={16} />
                <View className="flex-row items-center">
                  <Skeleton width={80} height={16} />
                  <Skeleton width={16} height={16} className="ml-3" />
                </View>
              </View>
            </View>
          </View>

          {/* Address Details Group Skeleton */}
          <View>
            {/* Group Title - positioned outside container like AppInputGroup */}
            <View className="px-4 py-3">
              <Skeleton width={130} height={20} />
            </View>

            {/* Input Container */}
            <View className="bg-white rounded-lg border border-gray-200">
              {/* Address */}
              <View className="flex-row items-start h-16 justify-between py-4 px-4">
                <Skeleton width={70} height={16} />
                <View className="flex-1 ml-4">
                  <Skeleton width="100%" height={16} />
                </View>
              </View>

              {/* Separator */}
              <View className="h-px bg-gray-200" />

              {/* City */}
              <View className="flex-row items-center h-16 justify-between py-4 px-4">
                <Skeleton width={40} height={16} />
                <Skeleton width={120} height={16} />
              </View>

              {/* Separator */}
              <View className="h-px bg-gray-200" />

              {/* State */}
              <View className="flex-row items-center h-16 justify-between py-4 px-4">
                <Skeleton width={50} height={16} />
                <View className="flex-row items-center">
                  <Skeleton width={100} height={16} />
                  <Skeleton width={16} height={16} className="ml-3" />
                </View>
              </View>

              {/* Separator */}
              <View className="h-px bg-gray-200" />

              {/* Zip Code */}
              <View className="flex-row items-center h-16 justify-between py-4 px-4">
                <Skeleton width={70} height={16} />
                <Skeleton width={80} height={16} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export { EditProfileSkeleton };
