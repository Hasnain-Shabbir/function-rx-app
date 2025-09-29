import { ChevronLeft } from "@/assets/icons";
import { Typography } from "@/components";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { Link } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  return (
    <SafeAreaView className="flex-1 items-center px-5 bg-misc">
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
    </SafeAreaView>
  );
};

export default ForgotPassword;
