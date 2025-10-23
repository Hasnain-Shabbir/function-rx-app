import { ChevronLeft } from "@/assets/icons";
import { Typography } from "@/components";
import { Button } from "@/components/Button/Button";
import InputOTP from "@/components/InputOTP/InputOTP";

import useOtpVerification from "@/hooks/useOtpVerification";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OtpVerification = () => {
  const {
    handleOtpVerification,
    handleOTPChange,
    handleResendOtp,
    validateOtpLoading,
    resendOtpLoading,
    email,
    validationError,
  } = useOtpVerification();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate refresh - you can add actual OTP verification refresh logic here
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error("Error refreshing OTP verification page:", error);
      setRefreshing(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="flex-1 items-center px-5 bg-misc">
          <ScrollView
            keyboardShouldPersistTaps="handled"
            className="flex-1 w-full"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "flex-start",
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
                  2 Factor Authentication
                </Typography>
                <Typography variant="body1" className="text-medium mt-1">
                  Enter the code you have received on {email || "your email"}
                </Typography>
              </View>

              <View className="gap-4">
                <InputOTP slots={6} onChange={handleOTPChange} />
                {validationError && (
                  <Typography
                    variant="body2"
                    className="text-red-500 text-center"
                  >
                    {validationError}
                  </Typography>
                )}
                <Button
                  size={"md"}
                  onPress={handleOtpVerification}
                  disabled={validateOtpLoading}
                  className="w-full"
                >
                  {validateOtpLoading ? "Verifying..." : "Verify Code"}
                </Button>

                <View className="flex-row items-center justify-center gap-2">
                  <Typography variant="body2" className="text-medium">
                    Didn&apos;t receive the code?
                  </Typography>
                  <Button
                    variant="link"
                    size="sm"
                    onPress={handleResendOtp}
                    disabled={resendOtpLoading}
                    className="p-0"
                  >
                    {resendOtpLoading ? "Sending..." : "Resend"}
                  </Button>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default OtpVerification;
