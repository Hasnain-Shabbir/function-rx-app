import { Typography } from "@/components";
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
      </ScrollView>
    </View>
  );
}
