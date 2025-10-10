import { ChevronLeft } from "@/assets/icons";
import { Typography } from "@/components";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import useChangePassword from "@/hooks/useChangePassword";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const ChangePassword = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const {
    formData,
    errors,
    updatePasswordLoading,
    handleInputChange,
    handleChangePassword,
  } = useChangePassword();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate refresh - you can add actual change password refresh logic here
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error("Error refreshing change password page:", error);
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-misc">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
        <Button
          variant="outline"
          className="min-w-9 min-h-9 rounded-sm p-1"
          onPress={() => router.back()}
        >
          <ChevronLeft width={12} height={20} color="#838786" />
        </Button>
        <Typography variant="h6" fontWeight="semibold">
          Change Password
        </Typography>
        <View className="w-9" />
      </View>

      <ScrollView
        className="flex-1 p-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100 + insets.bottom,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="max-w-sm mx-auto w-full">
          <View className="mb-6">
            <Typography variant="body1" className="text-gray-600 mb-2">
              Enter your current password and choose a new password
            </Typography>
          </View>

          <View className="gap-4">
            {/* Current Password */}
            <View>
              <Input
                label="Current Password"
                placeholder="Enter your current password"
                value={formData.currentPassword}
                onChangeText={(text) =>
                  handleInputChange(text, "currentPassword")
                }
                type="password"
                inputSize="md"
                isError={!!errors.currentPassword}
                errorMessage={errors.currentPassword}
              />
            </View>

            {/* New Password */}
            <View>
              <Input
                label="New Password"
                placeholder="Enter your new password"
                value={formData.newPassword}
                onChangeText={(text) => handleInputChange(text, "newPassword")}
                type="password"
                inputSize="md"
                isError={!!errors.newPassword}
                errorMessage={errors.newPassword}
              />
            </View>

            {/* Confirm Password */}
            <View>
              <Input
                label="Confirm New Password"
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  handleInputChange(text, "confirmPassword")
                }
                type="password"
                inputSize="md"
                isError={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword}
              />
            </View>

            {/* Password Requirements */}
            <View className="bg-gray-50 p-4 rounded-lg">
              <Typography
                variant="body3"
                fontWeight="medium"
                className="text-gray-700 mb-2"
              >
                Password Requirements:
              </Typography>
              <View className="gap-1">
                <Typography variant="caption" className="text-gray-600">
                  • At least 8 characters long
                </Typography>
                <Typography variant="caption" className="text-gray-600">
                  • Contains letters (a-z, A-Z)
                </Typography>
                <Typography variant="caption" className="text-gray-600">
                  • Contains numbers (0-9)
                </Typography>
                <Typography variant="caption" className="text-gray-600">
                  • Contains special characters (!@#$%^&*)
                </Typography>
              </View>
            </View>

            {/* Submit Button */}
            <View className="mt-6">
              <Button
                size="lg"
                className="w-full"
                disabled={updatePasswordLoading}
                onPress={handleChangePassword}
              >
                {updatePasswordLoading
                  ? "Updating Password..."
                  : "Update Password"}
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;
