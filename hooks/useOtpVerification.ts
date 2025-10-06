import { useSession } from "@/context/SessionProvider/SessionProvider";
import { useStorageState } from "@/hooks/useStorageState";
import { VALIDATE_OTP } from "@/services/graphql/mutations/authMutations";
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

const useOtpVerification = () => {
  const [otp, setOtp] = useState("");
  const { login } = useSession();
  const [, setUserType] = useStorageState("user_type");
  const [, setUserId] = useStorageState("user_id");

  const [email, setEmail] = useState("");
  const [, setRedirectUrl] = useState("");
  const navigate = useRouter();
  // const isEmailChangeRoute = window.location.pathname.includes("email-otp");
  const isEmailChangeRoute = false;
  const [validateOtp, { loading: validateOtpLoading }] =
    useMutation(VALIDATE_OTP);

  // verify the otp
  const handleOtpVerification = async () => {
    try {
      await validateOtp({
        variables: {
          otpCode: otp,
          email,
        },
        onCompleted: async (res: any) => {
          const token = res.validateOtp.token;
          const user: any = res.validateOtp.user;
          const userRole = res.validateOtp.user.userType;

          if (token) {
            // Check if user type is client
            if (userRole !== "client") {
              Toast.error(
                "You cannot login to the app. Only clients can login."
              );
              return;
            }

            login(token);
            setUserType(userRole);
            setUserId(user.id);

            Toast.success("You are logged in successfully");

            setOtp("");
            setEmail("");

            navigate.push("/");
          }
        },
        onError: (err) => {
          Toast.error(err.message || "Invalid OTP. Please try again.");
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        Toast.error(
          error.message || "OTP verification failed. Please try again."
        );
        console.error("error while validating the otp: ", error);
      }
    }
  };

  const handleOTPChange = (value: string) => {
    setOtp(value);
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
    email,
    validateOtpLoading,
    isEmailChangeRoute,
  };
};

export default useOtpVerification;
