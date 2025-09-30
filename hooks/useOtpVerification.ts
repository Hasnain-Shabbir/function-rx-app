import { VALIDATE_OTP } from "@/services/graphql/mutations/authMutations";
import { useMutation } from "@apollo/client/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Toast } from "toastify-react-native";

export function getUserType(userType: string): string {
  return userType.split("::").pop() ?? "";
}

const useOtpVerification = () => {
  const [otp, setOtp] = useState("");
  // const dispatch = useDispatch();
  // const location = useLocation();
  const [email, setEmail] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const navigate = useRouter();
  const isEmailChangeRoute = location.pathname.includes("email-otp");

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
            await AsyncStorage.setItem("auth_token", token);
            await AsyncStorage.setItem("user_type", userRole);
            await AsyncStorage.setItem("user_id", user.id);
            // await AsyncStorage.setItem("clinic_id", user.clinicId);

            Toast.success("You are logged in successfully");

            setOtp("");
            setEmail("");

            navigate.push("/");
          }
        },
        onError: (err) => {
          Toast.error(err.message);
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        Toast.error(error.message);
        console.error("error while validating the otp: ", error);
      }
    }
  };

  const handleOTPChange = (value: string) => {
    setOtp(value);
  };

  useEffect(() => {
    const loadSavedData = async () => {
      const savedEmail = await AsyncStorage.getItem("login_email");
      const savedRedirectUrl = await AsyncStorage.getItem("redirectTo");

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
      AsyncStorage.removeItem("redirectTo");
      AsyncStorage.removeItem("otp_timer_simple");
      AsyncStorage.removeItem("otp_timer_simple_timestamp");
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
