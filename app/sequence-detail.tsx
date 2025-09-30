import { ChevronLeft } from "@/assets/icons";
import { Button } from "@/components/Button/Button";
import { ExerciseList } from "@/components/ExerciseList/ExerciseList";
import { SegmentedTabs } from "@/components/SegmentedTabs/SegmentedTabs";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import Tag from "@/components/Tag/Tag";
import { useSequenceDetail } from "@/hooks/useSequenceDetail";
import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SequenceDetail = () => {
  const router = useRouter();
  const { assessmentId, assessmentSequenceOrder } = useLocalSearchParams<{
    assessmentId: string;
    assessmentSequenceOrder: string;
  }>();

  const {
    sequenceDetail,
    exerciseItems,
    loading,
    error,
    version,
    handleVersionChange,
  } = useSequenceDetail(
    assessmentId || "",
    parseInt(assessmentSequenceOrder || "0"),
    true
  );

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch {
      return dateString;
    }
  };

  // Helper function to get status type for Tag component
  const getStatusType = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "incomplete":
        return "danger";
      case "pending":
        return "warning";
      default:
        return "info";
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-misc">
        {/* Header Skeleton */}
        <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
          <Skeleton width={36} height={36} borderRadius={4} />
          <Skeleton width={36} height={36} borderRadius={4} />
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
        >
          {/* Status Tag Skeleton */}
          <View className="p-4">
            <Skeleton width={80} height={24} borderRadius={12} />
          </View>

          {/* Assessment Info Skeleton */}
          <View className="px-4 pb-4">
            <Skeleton
              width={120}
              height={16}
              borderRadius={4}
              className="mb-2"
            />
            <Skeleton
              width={200}
              height={32}
              borderRadius={4}
              className="mb-2"
            />
            <Skeleton width={100} height={16} borderRadius={4} />
          </View>

          {/* Version Toggle Skeleton */}
          <View className="px-4 pb-4">
            <Skeleton width="100%" height={40} borderRadius={4} />
          </View>

          {/* Exercise List Skeleton */}
          <View className="px-4">
            <Skeleton
              width={120}
              height={24}
              borderRadius={4}
              className="mb-4"
            />

            {/* Exercise Cards Skeleton */}
            <View className="gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <View
                  key={index}
                  className="bg-white p-4 rounded-lg border border-gray-200"
                >
                  <View className="flex-row items-start">
                    <Skeleton
                      width={32}
                      height={32}
                      borderRadius={16}
                      className="mr-3"
                    />
                    <View className="flex-1">
                      <Skeleton
                        width="80%"
                        height={20}
                        borderRadius={4}
                        className="mb-2"
                      />
                      <Skeleton
                        width="100%"
                        height={16}
                        borderRadius={4}
                        className="mb-3"
                      />
                      <View className="flex-row items-center">
                        <Skeleton
                          width={60}
                          height={16}
                          borderRadius={4}
                          className="mr-4"
                        />
                        <Skeleton
                          width={60}
                          height={16}
                          borderRadius={4}
                          className="mr-4"
                        />
                        <Skeleton width={60} height={16} borderRadius={4} />
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Bar Skeleton */}
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <View className="flex-row items-center justify-between">
            <Skeleton width={60} height={20} borderRadius={4} />
            <Skeleton width={120} height={40} borderRadius={4} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !sequenceDetail) {
    return (
      <SafeAreaView className="flex-1 bg-misc">
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-red-500 text-center">
            {error?.message || "Sequence not found"}
          </Text>
          <Button
            variant="outline"
            className="mt-4"
            onPress={() => router.back()}
          >
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-misc">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
        <Button
          variant="outline"
          className="min-w-9 min-h-9 rounded-sm p-1"
          onPress={() => router.back()}
        >
          <ChevronLeft width={12} height={20} color="#838786" />
        </Button>

        <Button
          variant="outline"
          className="min-w-9 min-h-9 rounded-sm p-1"
          onPress={() => console.log("Download pressed")}
        >
          <Text className="text-gray-600">↓</Text>
        </Button>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        {/* Status Tag */}
        <View className="p-4">
          <Tag
            title={sequenceDetail.status}
            type={getStatusType(sequenceDetail.status) as any}
            dot={true}
            size="sm"
          />
        </View>

        {/* Assessment Info */}
        <View className="px-4 pb-4">
          <Text className="text-sm text-gray-500 mb-1">
            Assessment #{sequenceDetail.assessmentId}
          </Text>
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {sequenceDetail.title}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-500 mr-1">📅</Text>
            <Text className="text-sm text-gray-500">
              {formatDate(sequenceDetail.createdAt)}
            </Text>
          </View>
        </View>

        {/* Version Toggle */}
        <View className="px-4 pb-4">
          <SegmentedTabs
            activeTab={version}
            segments={[
              {
                name: "Long Version",
                value: "long",
                onClickAction: () => handleVersionChange("long"),
              },
              {
                name: "Short Version",
                value: "short",
                onClickAction: () => handleVersionChange("short"),
              },
            ]}
          />
        </View>

        {/* Exercise List */}
        <View className="px-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Exercises ({exerciseItems.length})
          </Text>

          {exerciseItems.length === 0 ? (
            <View className="flex-1 justify-center items-center py-8">
              <Text className="text-gray-500">No exercises found</Text>
            </View>
          ) : (
            <ExerciseList
              exercises={exerciseItems}
              version={version}
              onExercisePress={(exercise, index) => {
                console.log(
                  "Exercise pressed:",
                  exercise.name,
                  "at index:",
                  index
                );
              }}
            />
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-gray-600 mr-1">👤</Text>
            <Text className="text-gray-900 font-medium">
              {sequenceDetail.completionCount}/{sequenceDetail.exerciseCount}
            </Text>
          </View>

          <Button
            variant="default"
            size="lg"
            className="px-6"
            onPress={() => console.log("Start Exercise pressed")}
          >
            Start Exercise
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SequenceDetail;
