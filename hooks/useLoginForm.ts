import { useSession } from "@/context/SessionProvider/SessionProvider";
import { useStorageState } from "@/hooks/useStorageState";
import { LOGIN_USER } from "@/services/graphql/mutations/authMutations";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Toast } from "toastify-react-native";

const useLoginForm = () => {
  const { login } = useSession();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useRouter();
  const [, setLoginEmail] = useStorageState("login_email");

  const [loginUser, { loading: loginUserLoading }] = useMutation(LOGIN_USER);

  // call the backend api
  const handleLoginSubmit = async () => {
    try {
      const { email, password } = formData;

      await loginUser({
        variables: {
          email,
          password,
        },
        onCompleted: async (res: any) => {
          console.log("response form the login: ", res.loginUser.message);

          Toast.success(res.loginUser.message);

          // set email in local storage to pass in otp verification
          setLoginEmail(email);

          // reset the form state
          setFormData({
            email: "",
            password: "",
          });

          navigate.push("/otp-verification");
        },
        onError: (err) => {
          console.error("error while logging in: ", err);
          Toast.error(err.message || "Login failed. Please try again.");
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        Toast.error(error.message || "Login failed. Please try again.");
        console.error("error while logging in: ", error);
      }
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
  };

  return {
    formData,
    handleInputChange,
    handleLoginSubmit,
    loginUserLoading,
  };
};

export default useLoginForm;
