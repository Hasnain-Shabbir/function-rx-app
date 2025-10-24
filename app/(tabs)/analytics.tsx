import { ExerciseCard, StatCard, Typography } from "@/components";
import { Button } from "@/components/Button/Button";
import { stats } from "@/constants/stats";
import React, { useState } from "react";
import { FlatList, RefreshControl, ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const Analytics = () => {
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh - you can add actual analytics data fetching here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 justify-center bg-misc">
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
        <View className="flex justify-between items-center flex-row">
          <Typography variant="body1">Progress Overview</Typography>
          <Button className="p-0" variant={"link"}>
            All Time
          </Button>
        </View>

        {/* Stats */}
        <View className="mt-6">
          <FlatList
            data={stats}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: 8 }}
            contentContainerStyle={{ gap: 8 }}
            renderItem={({ item }) => (
              <View className="flex-1">
                <StatCard {...item} />
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        {/* frequent repeated exercises */}
        <View className="mt-8">
          <Typography variant="body1" fontWeight="semibold" className="mb-4">
            Frequently Repeated Exercises
          </Typography>

          <ExerciseCard
            name="2 way press in line"
            count={2}
            sets={3}
            reps={3}
            imageSource={require("@/assets/images/man-standing.png")}
            onPress={() => {
              // Handle exercise card press
              console.log("Exercise card pressed");
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Analytics;
