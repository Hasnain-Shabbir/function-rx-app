import {
  ProfileButtons,
  Skeleton,
  Typography,
  UserInfoCard,
} from "@/components";
import { useUser } from "@/context";
import { useBiometricAuth } from "@/hooks/useBiometricAuth";
import { getValueFor, removeValue } from "@/hooks/useOtpVerification";
import { isTokenExpired } from "@/utils/jwtUtils";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";

const Profile = () => {
  const router = useRouter();
  const { user, loading: userLoading, refetch: refetchUser } = useUser();
  const { enableBiometricLogin, disableBiometricLogin, isBiometricEnabled } =
    useBiometricAuth();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
      const biometricEnabled = await getValueFor("biometric_enabled");

      if (biometricEnabled === "true") {
        // Keep auth credentials for biometric login
        await removeValue("login_email");
        await removeValue("redirectTo");
        await removeValue("otp_timer_simple");
        await removeValue("otp_timer_simple_timestamp");

        Toast.success("Logged out successfully");
      } else {
        // Clear all authentication-related data from
        await removeValue("session");
        await removeValue("user_type");
        await removeValue("user_id");
        await removeValue("login_email");
        await removeValue("redirectTo");
        await removeValue("otp_timer_simple");
        await removeValue("otp_timer_simple_timestamp");

        Toast.success("Logged out successfully");
      }

      // Navigate to login screen
      router.replace("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      Toast.error("Error during logout. Please try again.");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Check if current session token is expired (HIPAA compliance)
      const storedToken = await getValueFor("session");
      if (storedToken) {
        const tokenExpired = isTokenExpired(storedToken);
        if (tokenExpired === true || tokenExpired === null) {
          // Token is expired or invalid, disable biometric login and clear data
          await removeValue("biometric_enabled");
          await removeValue("session");
          await removeValue("user_type");
          await removeValue("user_id");

          Toast.error("Your session has expired. Please login again.");

          // Navigate to login screen
          router.replace("/login");
          return;
        }
      }

      // Refresh biometric status
      await checkBiometricStatus();
      // Refetch user data
      await refetchUser();
    } catch (error) {
      console.error("Error refreshing profile:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center bg-misc">
      <View className="bg-white border-b border-borderLight">
        <Typography variant="body1" className="text-center font-semibold py-4">
          Profile
        </Typography>
      </View>
      <ScrollView
        className="flex-1 p-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {userLoading ? (
          <View className="bg-white border pb-3 border-borderLight p-4 rounded-lg gap-4 flex items-center">
            <Skeleton width={72} height={72} borderRadius={40} />
            <View className="flex items-center gap-2">
              <Skeleton width={120} height={25} />
              <Skeleton width={150} height={18} />

              {/* Award badges skeleton */}
              <View className="flex-row items-center justify-center">
                <Skeleton width={100} height={34} borderRadius={4} />
                <View style={{ marginLeft: -17 }}>
                  <Skeleton width={40} height={34} borderRadius={4} />
                </View>
                {/* <View style={{ marginLeft: -17 }}>
                  <Skeleton width={40} height={34} borderRadius={4} />
                </View>
                <View style={{ marginLeft: -17 }}>
                  <Skeleton width={40} height={34} borderRadius={4} />
                </View> */}
              </View>
            </View>

            {/* Statistics skeleton */}
            <View className="flex-row justify-between items-center">
              <View className="w-1/2 items-center">
                <View className="flex flex-row items-center">
                  <Skeleton width={20} height={20} />
                  <View style={{ marginLeft: 4 }}>
                    <Skeleton width={20} height={20} />
                  </View>
                </View>
                <View style={{ marginTop: 8 }}>
                  <Skeleton width={40} height={12} />
                </View>
              </View>

              <View className="w-px h-6 bg-gray-300 mx-2" />

              <View className="w-1/2 items-center">
                <Skeleton width={60} height={35} />
              </View>
            </View>
          </View>
        ) : (
          <UserInfoCard
            name={user?.fullName || "User"}
            email={user?.email || ""}
            streak={8}
            personalBest={110}
            imageUrl={user?.imageUrl}
          />
        )}

        <ProfileButtons
          onEditProfile={handleEditProfile}
          onBiometricLogin={handleBiometricLogin}
          onChangePassword={handleChangePassword}
          onLogout={handleLogout}
          biometricEnabled={biometricEnabled}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
