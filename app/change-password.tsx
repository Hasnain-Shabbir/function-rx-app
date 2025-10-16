import { ChevronLeft } from "@/assets/icons";
import { Typography } from "@/components";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import useChangePassword from "@/hooks/useChangePassword";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
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

      <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row items-center justify-between">
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ChevronLeft width={14} height={14} color="#6B7280" />
        </TouchableOpacity>

        {/* Title */}
        <Typography variant="body1" className="font-semibold text-gray-900">
          Change Password
        </Typography>
        <View className="w-4" />
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
