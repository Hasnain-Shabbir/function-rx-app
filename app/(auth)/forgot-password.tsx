import { ChevronLeft } from "@/assets/icons";
import { Typography } from "@/components";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { Link } from "expo-router";
import React, { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate refresh - you can add actual forgot password refresh logic here
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error("Error refreshing forgot password page:", error);
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center px-5 bg-misc">
      <ScrollView
        className="flex-1 w-full"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Link href="/login" asChild>
          <Button
            variant="outline"
            className="min-w-9 min-h-9 rounded-sm p-1 self-start mb-9"
          >
            <ChevronLeft width={12} height={20} color="#838786" />
          </Button>
        </Link>
        <View className="w-full max-w-sm shadow-lg gap-6 border border-borderLight p-4 rounded-2xl bg-white">
          <View>
            <Typography variant="h6" fontWeight="semibold">
              Forgot Password
            </Typography>
            <Typography variant="body1" className="text-medium mt-1">
              Enter your email to get the code
            </Typography>
          </View>

          <View className="gap-4">
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              inputSize="md"
              type="email"
            />

            <Button size={"md"}>Send Code</Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
