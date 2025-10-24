import {
  Avatar,
  LatestSequenceCard,
  SequenceCard,
  Skeleton,
  Typography,
} from "@/components";
import { stats } from "@/constants/stats";
import { useUser } from "@/context";
import { useState } from "react";
import { FlatList, RefreshControl, ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Index() {
  const [refreshing, setRefreshing] = useState(false);
  const { user, loading, refetch } = useUser();
  const insets = useSafeAreaInsets();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing user data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Show skeleton loading while user data is being fetched
  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-misc">
        <ScrollView
          className="flex-1 p-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            minHeight: "100%",
            paddingBottom: 100 + insets.bottom,
          }}
        >
          <View className="flex-row justify-between items-center w-full gap-4">
            <View>
              <Typography
                variant="body1"
                fontWeight="semibold"
                className="text-medium mb-1"
              >
                Welcome
              </Typography>
              <Skeleton width={120} height={24} />
            </View>

            <Skeleton width={48} height={48} borderRadius={40} />
          </View>

          <View className="mt-6">
            <FlatList
              data={stats}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={{ gap: 8 }}
              contentContainerStyle={{ gap: 8 }}
              renderItem={() => (
                <View className="flex-1">
                  <Skeleton width="100%" height={90} borderRadius={12} />
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-misc">
      <ScrollView
        className="flex-1 p-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 100 + insets.bottom,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-row justify-between items-center w-full gap-4">
          <View>
            <Typography
              variant="body1"
              fontWeight="semibold"
              className="text-medium mb-1"
            >
              Welcome
            </Typography>
            <Typography
              variant="h6"
              fontWeight="semibold"
              className="text-wrap max-w-[190px]"
            >
              {user?.fullName ||
                `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                "User"}
            </Typography>
          </View>

          <Avatar size="xl" src={user?.imageUrl || undefined} />
        </View>

        {/* Sequence Card */}
        <View className="mt-6">
          <LatestSequenceCard
            onStart={() => {
              // Handle start sequence action
              console.log("Start sequence pressed");
            }}
          />
        </View>

        {/* Previous Sequences */}
        <View className="gap-4 mt-4">
          <SequenceCard tag="completed" />
          <SequenceCard tag="in-progress" />
          <SequenceCard tag="todo" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
