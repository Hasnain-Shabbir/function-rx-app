import { useStorageState } from "@/hooks/useStorageState";
import { LOGIN_USER } from "@/services/graphql/mutations/authMutations";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Toast } from "toastify-react-native";

const useLoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useRouter();
  const [, setLoginEmail] = useStorageState("login_email");

  const [loginUser] = useMutation(LOGIN_USER);

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // call the backend api
  const handleLoginSubmit = async () => {
    try {
      setIsSubmitting(true);

      const { email, password } = formData;
      let hasErrors = false;
      const newErrors = { email: "", password: "" };

      // Check if email is empty
      if (!email.trim()) {
        newErrors.email = "Email is required";
        hasErrors = true;
      } else if (!isValidEmail(email)) {
        newErrors.email = "Please enter a valid email address";
        hasErrors = true;
      }

      // Check if password is empty
      if (!password.trim()) {
        newErrors.password = "Password is required";
        hasErrors = true;
      } else if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
        hasErrors = true;
      }

      // Set errors and return if validation fails
      if (hasErrors) {
        setErrors(newErrors);
        setIsSubmitting(false);

        return;
      }

      // Clear errors if validation passes
      setErrors({ email: "", password: "" });

      loginUser({
        variables: {
          email,
          password,
        },
        onCompleted: async (res: any) => {
          Toast.success(res.loginUser.message);

          // set email in local storage to pass in otp verification
          setLoginEmail(email);

          // reset the form state
          setFormData({
            email: "",
            password: "",
          });

          setIsSubmitting(false);
          navigate.push("/otp-verification");
        },
        onError: (err) => {
          // console.error("error while logging in: ", err);
          Toast.error(err.message || "Login failed. Please try again.");
          setIsSubmitting(false);
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        Toast.error(error.message || "Login failed. Please try again.");
        // console.error("error while logging in: ", error);
      }
      setIsSubmitting(false);
    }
  };

  // handle the input change event
  const handleInputChange = (
    inputData: string | boolean,
    inputName: string
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [inputName]: inputData,
    }));

    // Clear error for the field being typed in
    if (errors[inputName as keyof typeof errors]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [inputName]: "",
      }));
    }
  };

  // Reset form state function
  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
    });
    setErrors({
      email: "",
      password: "",
    });
    setIsSubmitting(false);
  };

  return {
    formData,
    handleInputChange,
    handleLoginSubmit,
    loginUserLoading: isSubmitting,
    errors,
    resetForm,
  };
};

export default useLoginForm;
