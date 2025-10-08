import { Avatar, StatCard, ToggleInput, Typography } from "@/components";
import { stats } from "@/constants/stats";
import { useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSync, setAutoSync] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-misc">
      <ScrollView
        className="flex-1 p-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
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
            <Typography variant="h6" fontWeight="semibold">
              John Doe
            </Typography>
          </View>

          <Avatar
            size="xl"
            src="https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
          />
        </View>

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

        {/* ToggleInput Examples Section */}
        <View className="mt-8">
          <Typography
            variant="h6"
            fontWeight="semibold"
            className="text-black mb-4"
          >
            Settings
          </Typography>

          <View className="bg-white rounded-lg p-4 gap-4">
            <ToggleInput
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              label="Push Notifications"
              subLabel="Receive notifications about your workouts"
              wrapperClickable
              size="sm"
            />

            <ToggleInput
              value={darkMode}
              onValueChange={setDarkMode}
              label="Dark Mode"
              subLabel="Switch to dark theme for better visibility"
              wrapperClickable
              size="lg"
            />

            <ToggleInput
              value={autoSync}
              onValueChange={setAutoSync}
              label="Auto Sync"
              subLabel="Automatically sync your data"
              wrapperClickable
            />

            <ToggleInput
              value={locationServices}
              onValueChange={setLocationServices}
              label="Location Services"
              subLabel="Allow app to access your location"
              wrapperClickable
              disabled={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
