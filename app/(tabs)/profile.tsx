import { Typography } from "@/components";
import { Button } from "@/components/Button/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";

const Profile = () => {
  const router = useRouter();

  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  const handleBiometricLogin = () => {
    // TODO: Implement biometric login functionality
    console.log("Login with Biometric pressed");
  };

  const handleChangePassword = () => {
    // TODO: Implement change password functionality
    console.log("Change Password pressed");
  };

  const handleLogout = async () => {
    try {
      // Clear all authentication-related data from AsyncStorage
      await AsyncStorage.multiRemove([
        "auth_token",
        "user_type",
        "user_id",
        "login_email",
        "redirectTo",
        "otp_timer_simple",
        "otp_timer_simple_timestamp",
      ]);

      // Show success message
      Toast.success("Logged out successfully");

      // Navigate to login screen
      router.replace("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      Toast.error("Error during logout. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center bg-misc">
      <ScrollView
        className="flex-1 p-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
        }}
      >
        <Typography variant="h6" className="mb-8">
          Profile
        </Typography>

        <Button
          variant="outline"
          size="lg"
          className="mb-4 text-black"
          onPress={handleEditProfile}
        >
          Edit Profile
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="mb-4"
          onPress={handleBiometricLogin}
        >
          Login with Biometric
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="mb-4"
          onPress={handleChangePassword}
        >
          Change Password
        </Button>

        <Button variant="outline" size="lg" onPress={handleLogout}>
          Logout
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
