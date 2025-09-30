import { Typography } from "@/components";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Sequences = () => {
  return (
    <SafeAreaView className="flex-1 justify-center bg-misc">
      <ScrollView
        className="flex-1 p-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
        }}
      >
        <Typography variant="h6">Sequences</Typography>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Sequences;
