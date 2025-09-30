import { UPDATE_PASSWORD } from "@/services/graphql/mutations/authMutations";
import { validatePassword } from "@/utils/passwordValidation";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { Toast } from "toastify-react-native";

const useChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [updatePassword, { loading: updatePasswordLoading }] =
    useMutation(UPDATE_PASSWORD);

  const handleInputChange = (value: string, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    // Validate current password
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    // Validate new password
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else {
      const passwordError = validatePassword(formData.newPassword);
      if (passwordError) {
        newErrors.newPassword = passwordError;
      }
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Check if new password is same as current password
    if (
      formData.currentPassword &&
      formData.newPassword &&
      formData.currentPassword === formData.newPassword
    ) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleChangePassword = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await updatePassword({
        variables: {
          currentPassword: formData.currentPassword,
          password: formData.newPassword,
          passwordConfirmation: formData.confirmPassword,
        },
        onCompleted: (res) => {
          Toast.success("Password updated successfully");
          // Reset form
          setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setErrors({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        },
        onError: (err) => {
          Toast.error(err.message || "Failed to update password");
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        Toast.error(error.message || "Failed to update password");
      }
    }
  };

  return {
    formData,
    errors,
    updatePasswordLoading,
    handleInputChange,
    handleChangePassword,
    validatePassword,
  };
};

export default useChangePassword;
