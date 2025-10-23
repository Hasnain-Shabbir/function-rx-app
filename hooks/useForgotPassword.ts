import { FORGOT_PASSWORD } from "@/services/graphql/mutations/authMutations";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Toast } from "toastify-react-native";

const useForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useRouter();

  const [forgotPassword, { loading: forgotPasswordLoading }] =
    useMutation(FORGOT_PASSWORD);

  const handleForgotPassword = async () => {
    try {
      setIsSubmitting(true);
      const { email } = formData;

      // Basic email validation
      if (!email || !email.includes("@")) {
        Toast.error("Please enter a valid email address");
        setIsSubmitting(false);
        return;
      }

      await forgotPassword({
        variables: {
          email,
        },
        onCompleted: async () => {
          Toast.success(
            "OTP sent to your email, Please verify to reset your password."
          );

          // Store email in secure storage to pass to OTP verification
          await SecureStore.setItemAsync("login_email", email);
          await SecureStore.setItemAsync("redirectTo", "/reset-password");

          // Navigate to OTP verification page
          navigate.push("/otp-verification");

          // Reset the form state
          setFormData({
            email: "",
          });
          setIsSubmitting(false);
        },
        onError: (err) => {
          Toast.error(err.message || "Failed to send OTP. Please try again.");
          setIsSubmitting(false);
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        Toast.error(error.message || "An error occurred. Please try again.");
        // console.error("Forgot password error:", error);
      }
      setIsSubmitting(false);
    }
  };

  // Handle the input change event
  const handleInputChange = (inputData: string, inputName: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [inputName]: inputData,
    }));
  };

  return {
    formData,
    handleInputChange,
    handleForgotPassword,
    forgotPasswordLoading: isSubmitting || forgotPasswordLoading,
  };
};

export default useForgotPassword;
