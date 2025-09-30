import { Typography } from "@/components";
import { Button } from "@/components/Button/Button";
import { useBiometricAuth } from "@/hooks/useBiometricAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";

const Profile = () => {
  const router = useRouter();
  const { enableBiometricLogin, disableBiometricLogin, isBiometricEnabled } =
    useBiometricAuth();
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const checkBiometricStatus = React.useCallback(async () => {
    const enabled = await isBiometricEnabled();
    setBiometricEnabled(enabled);
  }, [isBiometricEnabled]);

  useEffect(() => {
    checkBiometricStatus();
  }, [checkBiometricStatus]);

  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  const handleBiometricLogin = async () => {
    if (biometricEnabled) {
      // Disable biometric login
      const success = await disableBiometricLogin();
      if (success) {
        setBiometricEnabled(false);
      }
    } else {
      // Enable biometric login
      const success = await enableBiometricLogin();
      if (success) {
        setBiometricEnabled(true);
      }
    }
  };

  const handleChangePassword = () => {
    router.push("/change-password");
  };

  const handleLogout = async () => {
    try {
      // Check if biometric login is enabled
      const biometricEnabled = await AsyncStorage.getItem("biometric_enabled");

      if (biometricEnabled === "true") {
        // Keep auth credentials for biometric login
        await AsyncStorage.multiRemove([
          "login_email",
          "redirectTo",
          "otp_timer_simple",
          "otp_timer_simple_timestamp",
        ]);
        Toast.success("Logged out successfully");
      } else {
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
        Toast.success("Logged out successfully");
      }

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
          {biometricEnabled
            ? "Disable Biometric Login"
            : "Enable Biometric Login"}
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
