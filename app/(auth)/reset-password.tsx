import { ChevronLeft } from "@/assets/icons";
import { Typography } from "@/components";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { getValueFor } from "@/hooks/useOtpVerification";
import { RESET_PASSWORD } from "@/services/graphql/mutations/authMutations";
import { useMutation } from "@apollo/client/react";
import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetToken, setResetToken] = useState("");
  console.log("🚀 ~ ResetPassword ~ resetToken:", resetToken);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useRouter();

  const [resetPassword, { loading: resetPasswordLoading }] =
    useMutation(RESET_PASSWORD);

  useEffect(() => {
    const loadResetToken = async () => {
      const token = await getValueFor("reset_token");
      if (token) {
        setResetToken(token);
      } else {
        // No reset token found, redirect to login
        Toast.error("Invalid reset link. Please try again.");
        navigate.replace("/login");
      }
    };

    loadResetToken();
  }, [navigate]);

  const handleInputChange = (inputData: string, inputName: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [inputName]: inputData,
    }));
  };

  const handleResetPassword = async () => {
    try {
      setIsSubmitting(true);

      const { password, confirmPassword } = formData;

      // Basic validation
      if (!password || password.length < 6) {
        Toast.error("Password must be at least 6 characters long");
        setIsSubmitting(false);
        return;
      }

      if (password !== confirmPassword) {
        Toast.error("Passwords do not match");
        setIsSubmitting(false);
        return;
      }

      if (!resetToken) {
        Toast.error("Invalid reset token. Please try again.");
        setIsSubmitting(false);
        return;
      }

      await resetPassword({
        variables: {
          password,
          passwordConfirmation: confirmPassword,
          resetPasswordToken: resetToken,
        },
        onCompleted: async () => {
          Toast.success(
            "Password reset successfully. Please login with your new password."
          );

          // Clean up stored data
          await SecureStore.deleteItemAsync("reset_token");
          await SecureStore.deleteItemAsync("login_email");
          await SecureStore.deleteItemAsync("redirectTo");

          // Reset form
          setFormData({
            password: "",
            confirmPassword: "",
          });
          setIsSubmitting(false);

          // Navigate to login
          navigate.replace("/login");
        },
        onError: (err) => {
          Toast.error(
            err.message || "Failed to reset password. Please try again."
          );
          setIsSubmitting(false);
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        Toast.error(error.message || "An error occurred. Please try again.");
        console.error("Reset password error:", error);
      }
      setIsSubmitting(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Reset form state
      setFormData({
        password: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error("Error refreshing reset password page:", error);
      setRefreshing(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={() => {}}>
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
                  Reset Password
                </Typography>
                <Typography variant="body1" className="text-medium mt-1">
                  Enter your new password
                </Typography>
              </View>

              <View className="gap-4">
                <Input
                  label="New Password"
                  placeholder="Enter your new password"
                  value={formData.password}
                  onChangeText={(text) => handleInputChange(text, "password")}
                  type="password"
                  inputSize="md"
                />

                <Input
                  label="Confirm Password"
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChangeText={(text) =>
                    handleInputChange(text, "confirmPassword")
                  }
                  type="password"
                  inputSize="md"
                />

                <Button
                  size={"md"}
                  onPress={handleResetPassword}
                  disabled={isSubmitting || resetPasswordLoading}
                  className="w-full"
                >
                  {isSubmitting || resetPasswordLoading
                    ? "Resetting..."
                    : "Reset Password"}
                </Button>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ResetPassword;
