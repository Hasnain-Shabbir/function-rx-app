import { CheckmarkCircle } from "@/assets/icons";
import ChevronDown from "@/assets/icons/svg/ChevronDown";
import { ExerciseCard, StatCard, Typography } from "@/components";
import { Button } from "@/components/Button/Button";
import { stats } from "@/constants/stats";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const Analytics = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All Time");
  const insets = useSafeAreaInsets();

  const filterOptions = [
    "All Time",
    "Today",
    "This Week",
    "This Month",
    "This Year",
  ];

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
          <Typography variant="body1" fontWeight="semibold">
            Progress Overview
          </Typography>
          <Button
            className="p-0"
            variant={"link"}
            onPress={() => setIsFilterModalVisible(true)}
            rightIcon={<ChevronDown />}
          >
            {selectedFilter}
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

        {/* frequent skipped exercises */}
        <View className="mt-8">
          <Typography variant="body1" fontWeight="semibold" className="mb-4">
            Frequently Skipped Exercises
          </Typography>

          <ExerciseCard
            name="2 way press in line"
            count={2}
            sets={3}
            reps={3}
            imageSource={require("@/assets/images/man-standing.png")}
            isSkipped={true}
            onPress={() => {
              // Handle exercise card press
              console.log("Exercise card pressed");
            }}
          />
        </View>
      </ScrollView>

      {/* Filter Bottom Sheet Modal */}
      <Modal
        visible={isFilterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => setIsFilterModalVisible(false)}
        >
          <TouchableOpacity
            className="bg-white rounded-t-3xl shadow-lg"
            activeOpacity={1}
            onPress={() => {}}
            style={{ paddingBottom: insets.bottom }}
          >
            {/* Drag Handle */}
            <View className="items-center py-3">
              <View className="w-10 h-1 bg-gray-300 rounded-full" />
            </View>

            {/* Title */}
            <View className="px-6 pb-4">
              <Typography
                variant="body3"
                fontWeight="semibold"
                className="text-medium"
              >
                Filter
              </Typography>
            </View>

            {/* Options */}
            <View className="px-6 pb-4">
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  className="flex-row items-center justify-between py-4 border-b border-gray-100 last:border-b-0"
                  onPress={() => {
                    setSelectedFilter(option);
                    setIsFilterModalVisible(false);
                  }}
                >
                  <Typography variant="body1">{option}</Typography>
                  {selectedFilter === option && (
                    <CheckmarkCircle color="#626e6b" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default Analytics;
