import { ChevronLeft } from "@/assets/icons";
import { Avatar, Typography } from "@/components";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { Pagination } from "@/components/Pagination/Pagination";
import { SequenceCardSkeleton } from "@/components/SequenceCardSkeleton/SequenceCardSkeleton";
import Tag from "@/components/Tag/Tag";
import { API_CONFIG } from "@/constants/config";
import { useSequenceData } from "@/hooks/useSequenceData";
import { format } from "date-fns";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const Sequences = () => {
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  // Use the API hook
  const {
    sequences,
    loading,
    error,
    keyword,
    setKeyword,
    currentPage,
    totalPages,
    handlePageChange,
    refetch,
  } = useSequenceData(true);

  // Helper function to get status type for Tag component
  const getStatusType = (status: string) => {
    switch (status.toLowerCase()) {
      case "submitted":
        return "info";
      case "asked help":
        return "warning";
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "incomplete":
        return "danger";
      default:
        return "info";
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM, yyyy");
    } catch {
      return dateString;
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing sequences:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-misc">
      <ScrollView
        className="flex-1 p-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100 + insets.bottom,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-row items-center gap-4 mb-8">
          <Link href="/" asChild>
            <Button
              variant="outline"
              className="min-w-9 min-h-9 rounded-sm p-1 self-start"
            >
              <ChevronLeft width={12} height={20} color="#838786" />
            </Button>
          </Link>
          <Typography variant="h6">Sequences</Typography>
        </View>

        {/* <View className="mb-6">
          <Typography variant="caption" className="text-medium">
            Assessment #1231
          </Typography>
          <Typography variant="h6">Posture Fix</Typography>
          <Typography variant="caption" className="text-medium">
            22 May, 2025
          </Typography>
        </View> */}

        <View className="mb-4 flex-row gap-3 items-center">
          <View className="flex-1">
            <Input
              placeholder="Search sequences by title"
              inputSize="sm"
              className="w-full"
              value={keyword}
              onChangeText={setKeyword}
            />
          </View>
          {/* <Button variant="outline" className="min-w-9 min-h-9 rounded-sm p-1">
            <ChevronLeft width={10} height={16} color="#838786" />
          </Button> */}
        </View>

        {/* Loading State */}
        {loading && (
          <View className="gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SequenceCardSkeleton key={index} />
            ))}
          </View>
        )}

        {/* Error State */}
        {error && (
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-red-500">
              Error loading sequences: {error.message}
            </Text>
          </View>
        )}

        {/* Sequences List */}
        {!loading && !error && (
          <View className="gap-4">
            {sequences.length === 0 ? (
              <View className="flex-1 justify-center items-center py-8">
                <Text className="text-gray-500">No sequences found</Text>
              </View>
            ) : (
              sequences.map((sequence) => (
                <View
                  key={sequence.id}
                  className="bg-white p-4 rounded-lg border border-gray-200"
                >
                  {/* Sequence Title */}
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="font-semibold text-gray-900">
                      Sequence Title:
                    </Text>
                    <Text className="text-gray-700">{sequence.title}</Text>
                  </View>

                  {/* Practitioner */}
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="font-semibold text-gray-900">
                      Practitioner:
                    </Text>
                    <View className="flex-row items-center">
                      <Avatar
                        size="sm"
                        src={
                          sequence.practitioner.imageUrl
                            ? `${API_CONFIG.BASE_URL}${sequence.practitioner.imageUrl}`
                            : undefined
                        }
                      />
                      <Text className="ml-2 text-gray-700">
                        {sequence.practitioner.fullName}
                      </Text>
                    </View>
                  </View>

                  {/* Date Created */}
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="font-semibold text-gray-900">
                      Date Created:
                    </Text>
                    <Text className="text-gray-700">
                      {formatDate(sequence.createdAt)}
                    </Text>
                  </View>

                  {/* Exercise Count */}
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="font-semibold text-gray-900">
                      Exercise Count:
                    </Text>
                    <Text className="text-gray-700">
                      {sequence.exerciseCount.toString().padStart(2, "0")}
                    </Text>
                  </View>

                  {/* Status */}
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="font-semibold text-gray-900">Status:</Text>
                    <Tag
                      title={
                        sequence.status.charAt(0).toUpperCase() +
                        sequence.status.slice(1).toLowerCase()
                      }
                      type={getStatusType(sequence.status) as any}
                      dot={true}
                      size="sm"
                    />
                  </View>

                  {/* Actions */}
                  <View className="flex-row justify-between items-center">
                    <Text className="font-semibold text-gray-900">
                      Actions:
                    </Text>
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-8 py-2"
                      onPress={() =>
                        router.push({
                          pathname: "/sequence-detail",
                          params: {
                            assessmentId: sequence.assessmentId,
                            assessmentSequenceOrder:
                              sequence.assessmentSequenceOrder.toString(),
                          },
                        })
                      }
                    >
                      View
                    </Button>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <View className="mt-5 mb-5 flex-row justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              nextPage={currentPage < totalPages ? currentPage + 1 : null}
              prevPage={currentPage > 1 ? currentPage - 1 : null}
              onPageChange={handlePageChange}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Sequences;
