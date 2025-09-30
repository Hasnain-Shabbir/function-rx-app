import { ChevronLeft } from "@/assets/icons";
import { Typography } from "@/components";
import { Button } from "@/components/Button/Button";
import InputOTP from "@/components/InputOTP/InputOTP";

import useOtpVerification from "@/hooks/useOtpVerification";
import { Link } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OtpVerification = () => {
  const { handleOtpVerification, handleOTPChange } = useOtpVerification();

  return (
    <SafeAreaView className="flex-1 items-center px-5 bg-misc">
      <Link href="/forgot-password" asChild>
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
            2 Factor Authentication
          </Typography>
          <Typography variant="body1" className="text-medium mt-1">
            Enter the code you have received on {"email"}
          </Typography>
        </View>

        <View className="gap-4">
          <InputOTP slots={6} onChange={handleOTPChange} />
          <Button size={"md"} onPress={handleOtpVerification}>
            Send Code
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OtpVerification;
