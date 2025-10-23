import { useSession } from "@/context/SessionProvider/SessionProvider";
import { useUser } from "@/context/UserProvider/UserProvider";
import { useStorageState } from "@/hooks/useStorageState";
import {
  RESEND_OTP,
  VALIDATE_OTP,
} from "@/services/graphql/mutations/authMutations";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Toast } from "toastify-react-native";

export async function getValueFor(key: string) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}

export async function removeValue(key: string) {
  await SecureStore.deleteItemAsync(key);
}

const useOtpVerification = (onResendSuccess?: () => void) => {
  const [otp, setOtp] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useSession();
  const { refreshUserData } = useUser();
  const [, setUserType] = useStorageState("user_type");
  const [, setUserId] = useStorageState("user_id");

  const [email, setEmail] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  console.log("🚀 ~ useOtpVerification ~ redirectUrl:", redirectUrl);
  const navigate = useRouter();
  // const isEmailChangeRoute = window.location.pathname.includes("email-otp");
  const isEmailChangeRoute = false;
  const [validateOtp] = useMutation(VALIDATE_OTP);

  const [resendOtp, { loading: resendOtpLoading }] = useMutation(RESEND_OTP);

  // verify the otp
  const handleOtpVerification = async () => {
    try {
      setIsSubmitting(true);
      // Clear any previous validation errors
      setValidationError("");

      // Frontend validation: Check if OTP is complete
      if (otp.length !== 6) {
        setValidationError("Please enter all 6 digits of the OTP code.");
        setIsSubmitting(false);
        return;
      }

      validateOtp({
        variables: {
          otpCode: otp,
          email,
        },
        onCompleted: async (res: any) => {
          console.log("response from otp verification:", res);
          const token = res.validateOtp.token;
          const user: any = res.validateOtp.user;
          const userRole = res.validateOtp.user.userType;
          const resetToken = res.validateOtp.user.resetPasswordToken;
          console.log("🚀 ~ handleOtpVerification ~ resetToken:", resetToken);

          // Check if this is a forgot password flow (has redirectUrl)
          if (redirectUrl) {
            // This is a forgot password flow
            console.log("🚀 ~ handleOtpVerification ~ resetToken:", resetToken);
            if (resetToken) {
              // Store reset token for password reset page
              await SecureStore.setItemAsync("reset_token", resetToken);
              Toast.success("OTP verified successfully");
              setOtp("");
              setIsSubmitting(false);
              navigate.replace("/reset-password");
              return;
            }
          } else if (token) {
            // This is a login flow
            // Check if user type is client
            if (userRole !== "client") {
              Toast.error(
                "You cannot login to the app. Only clients can login."
              );
              setIsSubmitting(false);
              return;
            }

            // On successful OTP, set active session and also cache for biometric if enabled later
            login(token);
            await SecureStore.setItemAsync("biometric_session", token);
            setUserType(userRole);
            setUserId(user.id);

            // Trigger user data refresh after setting user ID
            setTimeout(() => {
              refreshUserData();
            }, 100);

            Toast.success("You are logged in successfully");

            setOtp("");
            setEmail("");
            setIsSubmitting(false);

            navigate.replace("/");
          }
        },
        onError: (err) => {
          Toast.error(err.message || "Invalid OTP. Please try again.");
          setIsSubmitting(false);
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        Toast.error(
          error.message || "OTP verification failed. Please try again."
        );
        // console.error("error while validating the otp: ", error);
      }
      setIsSubmitting(false);
    }
  };

  const handleOTPChange = (value: string) => {
    setOtp(value);
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError("");
    }
  };

  // Resend OTP functionality - timer will be reset by the component after successful response
  const handleResendOtp = async () => {
    try {
      if (!email) {
        Toast.error("Email not found. Please try again.");
        return;
      }

      await resendOtp({
        variables: { email },
        onCompleted: (res: any) => {
          Toast.success(res.resendOtp.message || "OTP resent successfully");
          // Call the success callback to reset timer
          if (onResendSuccess) {
            onResendSuccess();
          }
        },
        onError: (err) => {
          Toast.error(err.message || "Failed to resend OTP. Please try again.");
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        Toast.error(error.message || "Failed to resend OTP. Please try again.");
        console.error("Error while resending OTP:", error);
      }
    }
  };

  useEffect(() => {
    const loadSavedData = async () => {
      const savedEmail = await getValueFor("login_email");
      const savedRedirectUrl = await getValueFor("redirectTo");

      if (savedEmail) {
        setEmail(savedEmail);
      }
      if (savedRedirectUrl) {
        setRedirectUrl(savedRedirectUrl);
      }
    };

    loadSavedData();
  }, []);

  // Cleanup localStorage on unmount
  useEffect(() => {
    return () => {
      removeValue("redirectTo");
      removeValue("otp_timer_simple");
      removeValue("otp_timer_simple_timestamp");
    };
  }, []);

  return {
    handleOtpVerification,
    otp,
    setOtp,
    handleOTPChange,
    handleResendOtp,
    email,
    validateOtpLoading: isSubmitting,
    resendOtpLoading,
    isEmailChangeRoute,
    validationError,
  };
};

export default useOtpVerification;
