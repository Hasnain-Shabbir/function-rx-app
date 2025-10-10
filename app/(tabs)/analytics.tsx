import { Typography } from "@/components";
import React, { useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Analytics = () => {
  const [refreshing, setRefreshing] = useState(false);

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
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Typography variant="h6">Analytics</Typography>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Analytics;
