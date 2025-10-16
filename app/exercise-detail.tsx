import { ChevronLeft } from "@/assets/icons";
import { Typography } from "@/components";
import { Button } from "@/components/Button/Button";
import { ExerciseIconsBar } from "@/components/ExerciseIconsBar/ExerciseIconsBar";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import Tag from "@/components/Tag/Tag";
import { API_CONFIG } from "@/constants/config";
import { useSequentialExercise } from "@/hooks/useSequentialExercise";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";

// Simple user role check - assuming client role for now
const isClient = true;

const ExerciseDetail = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const { exerciseId } = useLocalSearchParams<{
    exerciseId: string;
  }>();

  const { data: exercise, loading } = useSequentialExercise(exerciseId || null);

  const [exerciseMedia, setExerciseMedia] = useState<
    { id: string; link: string; title: string; type: "image" | "video" }[]
  >([]);

  // Video modal state
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  // Utility function to format text (remove underscores, capitalize first letter of each word)
  const formatText = (text: string | undefined): string => {
    if (!text) return "N/A";
    return text
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Utility function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate refresh - you can add actual exercise detail refresh logic here
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error("Error refreshing exercise detail:", error);
      setRefreshing(false);
    }
  };

  const handleVideoPress = (videoUrl: string) => {
    const videoId = getYouTubeVideoId(videoUrl);
    setSelectedVideoId(videoId);
    setVideoModalVisible(true);
  };

  const closeVideoModal = () => {
    setVideoModalVisible(false);
    setSelectedVideoId(null);
  };

  useEffect(() => {
    // Reset media state when exercise changes
    setExerciseMedia([]);

    // Add new photos if they exist
    exercise?.exercise?.photos?.forEach(
      (photo: { id: string; url: string }) => {
        setExerciseMedia((prev) => [
          ...prev,
          {
            id: photo.id,
            link: `${API_CONFIG.BASE_URL}${photo.url}`,
            title: "",
            type: "image" as const,
          },
        ]);
      }
    );

    // Add video URL if it exists
    if (exercise?.exercise?.videoUrl) {
      setExerciseMedia((prev) => [
        ...prev,
        {
          id: "video-" + exercise.exercise.id,
          link: exercise.exercise.videoUrl,
          title: "Video",
          type: "video" as const,
        },
      ]);
    }
  }, [
    exercise?.exercise?.photos,
    exercise?.exercise?.videoUrl,
    exercise?.exercise?.id,
  ]);

  // Loading
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-misc">
        {/* Header Skeleton */}
        <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
          <Skeleton width={36} height={36} borderRadius={4} />
        </View>

        <ScrollView
          className="flex-1 p-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100 + insets.bottom,
          }}
        >
          {/* Title Skeleton */}
          <Skeleton width="80%" height={24} borderRadius={4} className="mb-2" />

          {/* Icons Bar Skeleton */}
          <View className="flex-row items-center gap-4 mb-6">
            <Skeleton width={60} height={16} borderRadius={4} />
            <Skeleton width={60} height={16} borderRadius={4} />
            <Skeleton width={60} height={16} borderRadius={4} />
          </View>

          {/* Media Skeleton */}
          <Skeleton
            width="100%"
            height={200}
            borderRadius={8}
            className="mb-6"
          />

          {/* Fields Skeleton */}
          <View className="gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <View key={index} className="gap-2">
                <Skeleton width="40%" height={16} borderRadius={4} />
                <Skeleton width="100%" height={20} borderRadius={4} />
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Safety check to ensure exercise exists
  if (!exercise) {
    return (
      <SafeAreaView className="flex-1 bg-misc">
        <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
          <Button
            variant="outline"
            className="min-w-9 min-h-9 rounded-sm p-1"
            onPress={() => router.back()}
          >
            <ChevronLeft width={12} height={20} color="#838786" />
          </Button>
        </View>

        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-gray-500 text-center text-lg mb-2">
            No exercise selected
          </Text>
          <Text className="text-gray-400 text-center">
            Please select an exercise from the list.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderField = (
    label: string,
    value: string | number | string[] | undefined
  ) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return (
        <View className="mb-4">
          <Typography
            variant="body3"
            fontWeight="medium"
            className="text-gray-700 mb-1"
          >
            {label}
          </Typography>
          <Typography variant="body2">N/A</Typography>
        </View>
      );
    }

    if (Array.isArray(value)) {
      return (
        <View className="mb-4">
          <Typography
            variant="body3"
            fontWeight="medium"
            className="text-gray-700 mb-2"
          >
            {label}
          </Typography>
          <View className="flex-row flex-wrap items-center gap-1">
            {value.map((item, index) => (
              <Tag key={index} title={item} dot={false} type="grayLight" />
            ))}
          </View>
        </View>
      );
    }

    return (
      <View className="mb-4">
        <Typography
          variant="body3"
          fontWeight="medium"
          className="text-gray-700 mb-1"
        >
          {label}
        </Typography>
        <Typography variant="body2">{value}</Typography>
      </View>
    );
  };

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
      </View>

      <ScrollView
        className="flex-1 p-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100 + insets.bottom,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Title and Icons Bar */}
        <View className="mb-6">
          <Typography variant="body2" fontWeight="semibold" className="mb-2">
            {exercise.name}
          </Typography>
          <ExerciseIconsBar
            sets={exercise.sets || "N/A"}
            reps={exercise.repetition || "N/A"}
            duration={exercise.time || "N/A"}
            version={exercise.shortVersion ? "Short version" : "Long version"}
          />
        </View>

        {/* Media Gallery */}
        {exerciseMedia && exerciseMedia.length > 0 && (
          <View className="mb-6">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="gap-3"
            >
              {exerciseMedia.map((media) => (
                <View
                  key={media.id}
                  className="mr-3 w-64 h-48 rounded-lg overflow-hidden"
                >
                  {media.type === "video" ? (
                    <TouchableOpacity
                      onPress={() => handleVideoPress(media.link)}
                      className="w-full h-full bg-gray-900 rounded-lg items-center justify-center relative"
                    >
                      <YoutubePlayer
                        height={192}
                        width={256}
                        videoId={getYouTubeVideoId(media.link) || ""}
                        play={false}
                        webViewStyle={{ borderRadius: 8, overflow: "hidden" }}
                      />
                      {/* Play button overlay */}
                      <View className="absolute inset-0 items-center justify-center bg-black bg-opacity-30 rounded-lg">
                        <View className="w-16 h-16 bg-white bg-opacity-90 rounded-full items-center justify-center">
                          <Text className="text-black text-2xl font-bold">
                            ▶
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <Image
                      source={{ uri: media.link }}
                      className="w-full h-full rounded-lg"
                      resizeMode="cover"
                    />
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Exercise Details */}
        <View className="gap-4">
          {!isClient &&
            renderField(
              "Position of Body",
              formatText(exercise.exercise.position)
            )}
          {!isClient &&
            renderField("Strength Level", exercise.exercise.strengthLevel)}
          {!isClient &&
            renderField(
              "Category",
              Array.isArray(exercise.exercise.category)
                ? exercise.exercise.category.map(formatText)
                : formatText(exercise.exercise.category)
            )}
          {!isClient &&
            renderField(
              "Dysfunction Indications",
              Array.isArray(exercise.exercise.dysfunctionIndications)
                ? exercise.exercise.dysfunctionIndications.map(formatText)
                : exercise.exercise.dysfunctionIndications
            )}
          {!isClient &&
            renderField(
              "Pain Indications",
              Array.isArray(exercise.exercise.painIndications)
                ? exercise.exercise.painIndications.map(formatText)
                : exercise.exercise.painIndications
            )}
          {!isClient &&
            renderField(
              "Chain Release Indicator",
              formatText(exercise.exercise.chainReleaseIndication)
            )}
          {!isClient &&
            renderField(
              "Chain Directionality",
              formatText(exercise.exercise.chainDirectionality)
            )}

          {/* Instructions */}
          {exercise.exercise.writtenInstructions &&
          exercise.exercise.writtenInstructions.length > 0 ? (
            <View className="mb-4">
              <Typography
                variant="body3"
                fontWeight="medium"
                className="text-gray-700 mb-2"
              >
                Instructions
              </Typography>
              <View>
                <Typography variant="body2" className="mb-2">
                  Follow the instructions
                </Typography>
                <View className="pl-4">
                  {exercise.exercise.writtenInstructions.map(
                    (instruction: string, index: number) => (
                      <View key={index} className="flex-row mb-1">
                        <Text className="text-gray-500 mr-2">•</Text>
                        <Typography variant="body2" className="flex-1">
                          {instruction}
                        </Typography>
                      </View>
                    )
                  )}
                </View>
              </View>
            </View>
          ) : (
            renderField("Instructions", "N/A")
          )}
        </View>
      </ScrollView>

      {/* Video Modal */}
      <Modal
        visible={videoModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeVideoModal}
      >
        <View className="flex-1 bg-black bg-opacity-70 items-center justify-center px-4">
          <View className="w-full max-w-md">
            {selectedVideoId && (
              <YoutubePlayer
                height={300}
                width="100%"
                videoId={selectedVideoId}
                play={true}
                webViewStyle={{ borderRadius: 8 }}
              />
            )}
          </View>
          <TouchableOpacity
            onPress={closeVideoModal}
            className="mt-6 w-12 h-12 bg-white bg-opacity-90 rounded-full items-center justify-center"
          >
            <Text className="text-black text-2xl font-bold">×</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ExerciseDetail;
