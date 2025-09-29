import { Avatar, Typography } from "@/components";
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
        <Typography variant="h6" fontWeight="semibold">
          John Doe
        </Typography>

        <Avatar
          size="xl"
          src="https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
        />
      </ScrollView>
    </View>
  );
}
