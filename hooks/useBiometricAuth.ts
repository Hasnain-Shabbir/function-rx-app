import { isTokenExpired } from "@/utils/jwtUtils";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import { Toast } from "toastify-react-native";
import { getValueFor, removeValue } from "./useOtpVerification";
import { setStorageItemAsync } from "./useStorageState";

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
        const biometricEnabled = await getValueFor("biometric_enabled");

        if (biometricEnabled === "true") {
          // Check if we have stored credentials from a previous login
          const storedToken = await getValueFor("session");
          const storedUserType = await getValueFor("user_type");
          const storedUserId = await getValueFor("user_id");

          if (storedToken && storedUserType && storedUserId) {
            // Check if token is expired (HIPAA compliance)
            const tokenExpired = isTokenExpired(storedToken);

            if (tokenExpired === true) {
              // Token is expired, disable biometric login and clear stored data
              await removeValue("biometric_enabled");
              await removeValue("session");
              await removeValue("user_type");
              await removeValue("user_id");

              Toast.error(
                "Your session has expired. Please login with email and password again."
              );
              return false;
            } else if (tokenExpired === null) {
              // Invalid token, disable biometric login
              await removeValue("biometric_enabled");
              await removeValue("session");
              await removeValue("user_type");
              await removeValue("user_id");

              Toast.error(
                "Invalid session. Please login with email and password again."
              );
              return false;
            } else {
              // Token is valid, restore the session
              router.push("/");
              return true;
            }
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
      const storedToken = await getValueFor("session");
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
        await setStorageItemAsync("biometric_enabled", "true");
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
      const enabled = await getValueFor("biometric_enabled");

      if (enabled !== "true") {
        return false;
      }

      // Check if token is still valid (HIPAA compliance)
      const storedToken = await getValueFor("session");
      if (!storedToken) {
        // No token, disable biometric login
        await removeValue("biometric_enabled");
        return false;
      }

      const tokenExpired = isTokenExpired(storedToken);
      if (tokenExpired === true || tokenExpired === null) {
        // Token is expired or invalid, disable biometric login and clear data
        await removeValue("biometric_enabled");
        await removeValue("session");
        await removeValue("user_type");
        await removeValue("user_id");
        return false;
      }

      return true;
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
        await removeValue("biometric_enabled");
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
