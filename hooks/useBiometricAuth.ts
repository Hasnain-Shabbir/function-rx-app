import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import { Toast } from "toastify-react-native";

export const useBiometricAuth = () => {
  const router = useRouter();

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      return {
        compatible,
        enrolled,
        available: compatible && enrolled,
      };
    } catch (error) {
      console.error("Error checking biometric support:", error);
      return {
        compatible: false,
        enrolled: false,
        available: false,
      };
    }
  };

  const authenticateWithBiometric = async () => {
    try {
      const { available } = await checkBiometricSupport();

      if (!available) {
        Toast.error("Biometric authentication is not available on this device");
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to login",
        cancelLabel: "Cancel",
        fallbackLabel: "Use Password",
      });

      if (result.success) {
        // Check if biometric login is enabled
        const biometricEnabled =
          await AsyncStorage.getItem("biometric_enabled");

        if (biometricEnabled === "true") {
          // Check if we have stored credentials from a previous login
          const storedToken = await AsyncStorage.getItem("auth_token");
          const storedUserType = await AsyncStorage.getItem("user_type");
          const storedUserId = await AsyncStorage.getItem("user_id");

          if (storedToken && storedUserType && storedUserId) {
            // Restore the session
            router.push("/");
            return true;
          } else {
            // No stored credentials, need to login first
            Toast.info(
              "Please login with email and password first to enable biometric login"
            );
            return false;
          }
        } else {
          Toast.error(
            "Biometric login is not enabled. Please enable it in your profile first."
          );
          return false;
        }
      } else {
        if (result.error === "user_cancel") {
          Toast.info("Authentication cancelled");
        } else {
          Toast.error("Biometric authentication failed");
        }
        return false;
      }
    } catch (error) {
      console.error("Biometric authentication error:", error);
      Toast.error("Biometric authentication failed");
      return false;
    }
  };

  const enableBiometricLogin = async () => {
    try {
      const { available } = await checkBiometricSupport();

      if (!available) {
        Toast.error("Biometric authentication is not available on this device");
        return false;
      }

      // Check if user is already logged in
      const storedToken = await AsyncStorage.getItem("auth_token");
      if (!storedToken) {
        Toast.error(
          "Please login with email and password first to enable biometric login"
        );
        return false;
      }

      // Authenticate to enable biometric login
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Enable biometric login",
        cancelLabel: "Cancel",
        fallbackLabel: "Use Password",
      });

      if (result.success) {
        await AsyncStorage.setItem("biometric_enabled", "true");
        Toast.success("Biometric login enabled successfully");
        return true;
      } else {
        if (result.error === "user_cancel") {
          Toast.info("Biometric setup cancelled");
        } else {
          Toast.error("Failed to enable biometric login");
        }
        return false;
      }
    } catch (error) {
      console.error("Error enabling biometric login:", error);
      Toast.error("Failed to enable biometric login");
      return false;
    }
  };

  const isBiometricEnabled = async () => {
    try {
      const enabled = await AsyncStorage.getItem("biometric_enabled");
      return enabled === "true";
    } catch (error) {
      console.error("Error checking biometric status:", error);
      return false;
    }
  };

  const disableBiometricLogin = async () => {
    try {
      const { available } = await checkBiometricSupport();

      if (!available) {
        Toast.error("Biometric authentication is not available on this device");
        return false;
      }

      // Authenticate to disable biometric login
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Disable biometric login",
        cancelLabel: "Cancel",
        fallbackLabel: "Use Password",
      });

      if (result.success) {
        await AsyncStorage.removeItem("biometric_enabled");
        Toast.success("Biometric login disabled successfully");
        return true;
      } else {
        if (result.error === "user_cancel") {
          // Don't show toast for user cancellation
          return false;
        } else {
          Toast.error("Failed to disable biometric login");
        }
        return false;
      }
    } catch (error) {
      console.error("Error disabling biometric login:", error);
      Toast.error("Failed to disable biometric login");
      return false;
    }
  };

  return {
    checkBiometricSupport,
    authenticateWithBiometric,
    enableBiometricLogin,
    disableBiometricLogin,
    isBiometricEnabled,
  };
};
