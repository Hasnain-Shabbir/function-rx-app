import { Avatar, StatCard, Typography } from "@/components";
import { stats } from "@/constants/stats";
import { ScrollView, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-misc">
      <ScrollView
        className="flex-1 p-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
        }}
      >
        <View className="flex-row justify-between items-center w-full mt-20 gap-4">
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

        {/* Stats */}
        <View className="mt-6">
          <View className="flex-row gap-2 mb-2">
            {stats.slice(0, 2).map((stat) => (
              <View key={stat.id} className="flex-1">
                <StatCard {...stat} />
              </View>
            ))}
          </View>
          {stats.length > 2 && (
            <View className="flex-row gap-2">
              {stats.slice(2, 4).map((stat) => (
                <View key={stat.id} className="flex-1">
                  <StatCard {...stat} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
