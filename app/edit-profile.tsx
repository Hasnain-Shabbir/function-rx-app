import { ChevronLeft } from "@/assets/icons";
import {
  AppInputGroup,
  EditProfileSkeleton,
  ImagePicker,
  Typography,
} from "@/components";
import { API_CONFIG } from "@/constants/config";
import { usStates } from "@/constants/statesList";
import { getValueFor } from "@/hooks/useOtpVerification";
import { UPDATE_USER } from "@/services/graphql/mutations/authMutations";
import { FETCH_USER } from "@/services/graphql/queries/sequencesQueries";
import { useMutation, useQuery } from "@apollo/client/react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";

const EditProfile = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    profileImage: null as string | null,
  });
  const [originalData, setOriginalData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    profileImage: null as string | null,
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [phoneError, setPhoneError] = useState<string | undefined>(undefined);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Helper for phone validation - similar to ProfileInfo implementation
  const validateUSPhoneNumber = (phoneValue: string | undefined): boolean => {
    if (!phoneValue || phoneValue.trim() === "") return false;

    // Remove all non-digit characters for validation
    const digitsOnly = phoneValue.replace(/\D/g, "");

    // US phone numbers should have 10 digits (without country code) or 11 digits (with country code 1)
    if (digitsOnly.length === 10) {
      // Format: (XXX) XXX-XXXX or XXX-XXX-XXXX or XXXXXXXXXX
      return true;
    } else if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) {
      // Format: +1 (XXX) XXX-XXXX or 1-XXX-XXX-XXXX
      return true;
    }

    return false;
  };

  // Helper to format phone number as user types
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, "");

    // Limit to 10 digits for US phone numbers
    const limitedDigits = digitsOnly.slice(0, 10);

    // Format based on length
    if (limitedDigits.length === 0) {
      return "";
    } else if (limitedDigits.length <= 3) {
      return `(${limitedDigits}`;
    } else if (limitedDigits.length <= 6) {
      return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3)}`;
    } else {
      return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6)}`;
    }
  };

  // Helper to check if phone is required and valid
  const validateRequiredPhone = (phoneValue: string | undefined): boolean => {
    if (!phoneValue || phoneValue.trim() === "") return false;
    return validateUSPhoneNumber(phoneValue);
  };

  // Fetch user ID from storage
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getValueFor("user_id");
      setUserId(id);
    };
    fetchUserId();
  }, []);

  // Fetch user data
  const {
    data: userData,
    loading: userLoading,
    refetch: refetchUser,
  } = useQuery(FETCH_USER, {
    variables: { fetchUserId: userId },
    skip: !userId,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

  // Update mutation
  const [updateUser, { loading: updateUserLoading }] = useMutation(UPDATE_USER);

  // Prefill form data when user data is available
  useEffect(() => {
    try {
      if (userData) {
        const user = (userData as any)?.fetchUser?.user;

        if (user) {
          const dateOfBirth = user.dateOfBirth
            ? new Date(user.dateOfBirth)
            : new Date();
          setSelectedDate(dateOfBirth);
          // Construct full image URL with backend URL
          const fullImageUrl = user.imageUrl
            ? `${API_CONFIG.BASE_URL}${user.imageUrl}`
            : null;

          const userFormData = {
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phone: user.phone || "",
            gender: user.gender || "",
            dateOfBirth: user.dateOfBirth || "",
            address: user.address || "",
            city: user.city || "",
            state: user.state || "",
            zipCode: user.zipCode || "",
            profileImage: fullImageUrl,
          };
          setFormData(userFormData);
          setOriginalData(userFormData);
        }
      }
    } catch (error) {
      console.error("Error setting form data:", error);
      Toast.error("Error loading user data");
    }
  }, [userData]);

  const handleInputChange = (
    text: string,
    fieldName: keyof typeof formData
  ) => {
    try {
      let processedText = text;

      // Handle phone formatting
      if (fieldName === "phone") {
        processedText = formatPhoneNumber(text);
      }

      setFormData((prevState) => ({
        ...prevState,
        [fieldName]: processedText,
      }));

      // Clear error when user starts typing
      if (errors[fieldName]) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "",
        }));
      }

      // Handle phone validation
      if (fieldName === "phone") {
        if (hasSubmitted) {
          // Revalidate on change only after submit attempt
          const valid = validateRequiredPhone(processedText);
          if (!valid) {
            if (!processedText || processedText.trim() === "") {
              setPhoneError("Phone number is required");
            } else {
              setPhoneError("Please enter a valid US phone number");
            }
          } else {
            setPhoneError(undefined);
          }
        }
      }
    } catch (error) {
      console.error("Error handling input change:", error);
    }
  };

  const validateForm = () => {
    try {
      const newErrors: Partial<typeof formData> = {};

      // Email validation
      if (formData.email && formData.email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
        }
      }

      // Phone validation - required field
      const valid = validateRequiredPhone(formData.phone);
      if (!valid) {
        if (!formData.phone || formData.phone.trim() === "") {
          newErrors.phone = "Phone number is required";
        } else {
          newErrors.phone = "Please enter a valid US phone number";
        }
      }

      // ZipCode validation (basic)
      if (formData.zipCode && formData.zipCode.trim()) {
        const zipCodeRegex = /^\d{5}(-\d{4})?$/;
        if (!zipCodeRegex.test(formData.zipCode)) {
          newErrors.zipCode = "Please enter a valid zip code";
        }
      }

      setErrors(newErrors);
      return !Object.values(newErrors).some((error) => error !== "");
    } catch (error) {
      console.error("Error validating form:", error);
      Toast.error("Error validating form data");
      return false;
    }
  };

  const handleSaveChanges = async () => {
    setHasSubmitted(true);

    // Validate phone number specifically - required field
    const valid = validateRequiredPhone(formData.phone);
    if (!valid) {
      if (!formData.phone || formData.phone.trim() === "") {
        setPhoneError("Phone number is required");
      } else {
        setPhoneError("Please enter a valid US phone number");
      }
      return;
    }
    setPhoneError(undefined);

    if (!validateForm()) {
      return;
    }

    try {
      if (!userId) {
        Toast.error("User ID not found. Please login again.");
        return;
      }

      // Prepare userAttributes object - only include changed fields
      const userAttributes: any = {};

      // Check each field and only include if it has changed from original
      if (
        formData.firstName !== originalData.firstName &&
        formData.firstName?.trim()
      ) {
        userAttributes.firstName = formData.firstName.trim();
      }
      if (
        formData.lastName !== originalData.lastName &&
        formData.lastName?.trim()
      ) {
        userAttributes.lastName = formData.lastName.trim();
      }
      // Skip email - requires OTP verification
      if (formData.phone !== originalData.phone && formData.phone?.trim()) {
        userAttributes.phone = formData.phone.trim();
      }
      if (formData.gender !== originalData.gender && formData.gender?.trim()) {
        userAttributes.gender = formData.gender.trim();
      }
      if (
        formData.dateOfBirth !== originalData.dateOfBirth &&
        formData.dateOfBirth?.trim()
      ) {
        // Date is already in YYYY-MM-DD format from handleDateChange
        userAttributes.dateOfBirth = formData.dateOfBirth;
      }
      if (
        formData.address !== originalData.address &&
        formData.address?.trim()
      ) {
        userAttributes.address = formData.address.trim();
      }
      if (formData.city !== originalData.city && formData.city?.trim()) {
        userAttributes.city = formData.city.trim();
      }
      if (formData.state !== originalData.state && formData.state?.trim()) {
        userAttributes.state = formData.state.trim();
      }
      if (
        formData.zipCode !== originalData.zipCode &&
        formData.zipCode?.trim()
      ) {
        userAttributes.zipCode = formData.zipCode.trim();
      }

      // Helper to conditionally add image if selected (following ProfileInfo pattern)
      const maybeImage = selectedImageFile ? { image: selectedImageFile } : {};

      // Check if there are any changes (including image upload)
      const hasChanges =
        Object.keys(userAttributes).length > 0 || selectedImageFile;

      console.log("Change detection:", {
        userAttributesKeys: Object.keys(userAttributes),
        selectedImageFile: selectedImageFile,
        hasChanges: hasChanges,
      });

      if (!hasChanges) {
        Toast.info("No changes detected");
        return;
      }

      // Prepare variables for the mutation - following ProfileInfo pattern
      const variables = {
        id: userId,
        ...userAttributes,
        ...maybeImage,
      };

      // Add a timeout to prevent hanging
      const updatePromise = updateUser({
        variables,
        errorPolicy: "all", // This allows partial success scenarios
        update: (cache, { data }: any) => {
          try {
            // Update the cache with the new user data
            if (data?.updateUser?.user) {
              // Try to read existing cache data first to preserve missing fields
              const existingData = cache.readQuery({
                query: FETCH_USER,
                variables: { fetchUserId: userId },
              });

              // Merge existing data with new data to preserve all fields
              const mergedUser = {
                ...(existingData as any)?.fetchUser?.user,
                ...data.updateUser.user,
              };

              cache.writeQuery({
                query: FETCH_USER,
                variables: { fetchUserId: userId },
                data: {
                  fetchUser: {
                    user: mergedUser,
                  },
                },
              });
            }
          } catch (cacheError) {
            console.error("Cache update error:", cacheError);
            // If cache update fails, we'll rely on refetch to get fresh data
          }
        },
        onCompleted: (res: any) => {
          try {
            // Check if the update was successful
            if (res?.updateUser?.user) {
              Toast.success("Profile updated successfully");
              console.log("Profile updated:", res.updateUser.user);

              // Update local state with the new data
              const updatedUser = res.updateUser.user;

              // Construct full image URL with backend URL
              const fullImageUrl = updatedUser.imageUrl
                ? `${API_CONFIG.BASE_URL}${updatedUser.imageUrl}`
                : null;

              const updatedFormData = {
                firstName: updatedUser.firstName || "",
                lastName: updatedUser.lastName || "",
                email: updatedUser.email || "",
                phone: updatedUser.phone || "",
                gender: updatedUser.gender || "",
                dateOfBirth: updatedUser.dateOfBirth || "",
                address: updatedUser.address || "",
                city: updatedUser.city || "",
                state: updatedUser.state || "",
                zipCode: updatedUser.zipCode || "",
                profileImage: fullImageUrl,
              };
              setFormData(updatedFormData);
              setOriginalData(updatedFormData);
              setSelectedImageFile(null); // Clear the selected file after successful upload
              router.back();
            } else {
              // If no user data returned, it might still be a partial success
              Toast.success("Profile updated successfully");
              setSelectedImageFile(null); // Clear the selected file after successful upload
              router.back();
            }
          } catch (completionError) {
            console.error("Error in completion handler:", completionError);
            Toast.success("Profile updated successfully");
            setSelectedImageFile(null); // Clear the selected file after successful upload
            router.back();
          }
        },
        onError: (err: any) => {
          // Check if this is a partial success scenario
          // Sometimes GraphQL returns errors but the mutation still succeeds
          if (err?.graphQLErrors && err.graphQLErrors.length > 0) {
            // Check if any of the GraphQL errors are non-critical
            const criticalErrors = err.graphQLErrors.filter((error: any) => {
              const message = error.message?.toLowerCase() || "";
              // Filter out common non-critical errors
              return (
                !message.includes("validation") &&
                !message.includes("warning") &&
                !message.includes("deprecated")
              );
            });

            if (criticalErrors.length === 0) {
              // Only non-critical errors, treat as success
              Toast.success("Profile updated successfully");
              setSelectedImageFile(null); // Clear the selected file after successful upload
              // Refetch user data to ensure we have the latest state
              refetchUser().catch(() => {
                console.log("Refetch failed, but update was successful");
              });
              router.back();
              return;
            }
          }

          // Only show user-friendly error messages
          let errorMessage = "Failed to update profile. Please try again.";

          // Check for specific error types and provide user-friendly messages
          if (err?.networkError) {
            errorMessage =
              "Network error. Please check your connection and try again.";
          } else if (err?.message) {
            // Only show the error message if it's user-friendly
            const message = err.message.toLowerCase();
            if (message.includes("network") || message.includes("connection")) {
              errorMessage =
                "Network error. Please check your connection and try again.";
            } else if (
              message.includes("unauthorized") ||
              message.includes("forbidden")
            ) {
              errorMessage =
                "You don't have permission to update this profile.";
            } else if (message.includes("not found")) {
              errorMessage = "Profile not found. Please try again.";
            } else {
              // For other errors, show a generic message
              errorMessage = "Failed to update profile. Please try again.";
            }
          }

          Toast.error(errorMessage);
        },
      });

      // Add timeout handling
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), 30000); // 30 second timeout
      });

      await Promise.race([updatePromise, timeoutPromise]);
    } catch (error) {
      console.error("Error saving profile:", error);
      Toast.error("Error saving profile. Please try again.");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Refetch user data to get the latest information
      if (userId) {
        const result = await refetchUser();

        // Reset form data with fresh user data
        if (result.data) {
          const user = (result.data as any)?.fetchUser?.user;
          if (user) {
            const dateOfBirth = user.dateOfBirth
              ? new Date(user.dateOfBirth)
              : new Date();
            setSelectedDate(dateOfBirth);

            // Construct full image URL with backend URL
            const fullImageUrl = user.imageUrl
              ? `${API_CONFIG.BASE_URL}${user.imageUrl}`
              : null;

            const userFormData = {
              firstName: user.firstName || "",
              lastName: user.lastName || "",
              email: user.email || "",
              phone: user.phone || "",
              gender: user.gender || "",
              dateOfBirth: user.dateOfBirth || "",
              address: user.address || "",
              city: user.city || "",
              state: user.state || "",
              zipCode: user.zipCode || "",
              profileImage: fullImageUrl,
            };

            // Reset form data and original data with fresh data
            setFormData(userFormData);
            setOriginalData(userFormData);

            // Clear any validation errors and selected image file
            setErrors({});
            setPhoneError(undefined);
            setSelectedImageFile(null);
            setHasSubmitted(false);
          }
        }
      }
      setRefreshing(false);
    } catch (error) {
      console.error("Error refreshing edit profile page:", error);
      setRefreshing(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    try {
      const currentDate = selectedDate || new Date();
      setShowDatePicker(Platform.OS === "ios");
      setSelectedDate(currentDate);

      // Format date as YYYY-MM-DD to match API format
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      setFormData((prevState) => ({
        ...prevState,
        dateOfBirth: formattedDate,
      }));
    } catch (error) {
      console.error("Error handling date change:", error);
      Toast.error("Error setting date");
    }
  };

  // Helper function to format date for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={{
        flex: 1,
      }}
    >
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
      <SafeAreaView className="flex-1 bg-misc">
        <View className="flex-1">
          {/* Show loading state while user data is being fetched */}
          {userLoading ? (
            <EditProfileSkeleton />
          ) : userData && !(userData as any)?.fetchUser?.user ? (
            /* Show error state if user data failed to load */
            <View className="flex-1 justify-center items-center px-4">
              <Typography
                variant="body1"
                className="text-center text-danger-600 mb-4"
              >
                Failed to load user profile. Please try again.
              </Typography>
              <TouchableOpacity
                onPress={() => router.back()}
                className="bg-primary-500 px-6 py-3 rounded-lg"
              >
                <Typography variant="body1" className="text-white font-medium">
                  Go Back
                </Typography>
              </TouchableOpacity>
            </View>
          ) : (
            /* Show actual content when data is loaded */
            <>
              {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
              {/* Header */}
              <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row items-center justify-between">
                {/* Back Button */}
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                  <ChevronLeft width={14} height={14} color="#6B7280" />
                </TouchableOpacity>

                {/* Title */}
                <Typography
                  variant="body1"
                  className="font-semibold text-gray-900"
                >
                  Edit Profile
                </Typography>

                {/* Save Button */}
                <TouchableOpacity
                  onPress={handleSaveChanges}
                  disabled={updateUserLoading}
                  className="p-2"
                >
                  <Typography
                    variant="body3"
                    className={`font-medium ${updateUserLoading ? "text-gray-400" : "text-primary-500"}`}
                  >
                    Save
                  </Typography>
                </TouchableOpacity>
              </View>

              <ScrollView
                className="flex-1 p-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: 20,
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              >
                {/* Profile Image Picker */}
                <View className="items-center mb-8">
                  <ImagePicker
                    initialImage={formData.profileImage}
                    onImageSelected={(uri, file) => {
                      setFormData((prev) => ({
                        ...prev,
                        profileImage: uri,
                      }));
                      // Store the file for upload
                      setSelectedImageFile(file);
                    }}
                    size={120}
                  />
                </View>

                <View className="gap-6">
                  {/* Personal Details Group */}
                  <AppInputGroup
                    title="Personal Details"
                    inputs={[
                      {
                        id: "firstName",
                        title: "First Name",
                        value: formData.firstName,
                        onChangeText: (text) =>
                          handleInputChange(text, "firstName"),
                        placeholder: "Enter your first name",
                      },
                      {
                        id: "lastName",
                        title: "Last Name",
                        value: formData.lastName,
                        onChangeText: (text) =>
                          handleInputChange(text, "lastName"),
                        placeholder: "Enter your last name",
                      },
                      {
                        id: "email",
                        title: "Email",
                        value: formData.email,
                        onChangeText: (text) =>
                          handleInputChange(text, "email"),
                        placeholder: "Enter your email",
                        editable: false,
                      },
                      {
                        id: "phone",
                        title: "Phone Number",
                        value: formData.phone,
                        onChangeText: (text) =>
                          handleInputChange(text, "phone"),
                        placeholder: "Enter your phone number",
                        errorMessage: hasSubmitted ? phoneError : undefined,
                        maxLength: 14, // (XXX) XXX-XXXX format
                      },
                      {
                        id: "gender",
                        title: "Gender",
                        value: formData.gender,
                        onPress: () => setShowGenderPicker(true),
                        showArrow: true,
                        editable: false,
                      },
                      {
                        id: "dateOfBirth",
                        title: "Date of Birth",
                        value: formatDateForDisplay(formData.dateOfBirth),
                        onPress: () => setShowDatePicker(true),
                        showArrow: true,
                        editable: false,
                      },
                    ]}
                  />

                  {/* Address Details Group */}
                  <AppInputGroup
                    title="Address Details"
                    inputs={[
                      {
                        id: "address",
                        title: "Address",
                        value: formData.address,
                        onChangeText: (text) =>
                          handleInputChange(text, "address"),
                        placeholder: "Enter your address",
                        multiline: true,
                        numberOfLines: 3,
                      },
                      {
                        id: "city",
                        title: "City",
                        value: formData.city,
                        onChangeText: (text) => handleInputChange(text, "city"),
                        placeholder: "Enter your city",
                      },
                      {
                        id: "state",
                        title: "State",
                        value: formData.state,
                        onPress: () => setShowStatePicker(true),
                        showArrow: true,
                        editable: false,
                      },
                      {
                        id: "zipCode",
                        title: "Zipcode",
                        value: formData.zipCode,
                        onChangeText: (text) =>
                          handleInputChange(text, "zipCode"),
                        placeholder: "Enter your zipcode",
                      },
                    ]}
                  />
                </View>

                {/* Date Picker Modal */}
                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                )}

                {/* Gender Picker Bottom Sheet */}
                <Modal
                  visible={showGenderPicker}
                  transparent={true}
                  animationType="slide"
                  onRequestClose={() => setShowGenderPicker(false)}
                >
                  <TouchableOpacity
                    className="flex-1 justify-end bg-black/50"
                    activeOpacity={1}
                    onPress={() => setShowGenderPicker(false)}
                  >
                    <TouchableOpacity
                      className="bg-white rounded-t-3xl shadow-lg"
                      activeOpacity={1}
                      onPress={() => {}}
                    >
                      {/* Drag Handle */}
                      <View className="items-center py-3">
                        <View className="w-10 h-1 bg-gray-300 rounded-full" />
                      </View>

                      {/* Title */}
                      <View className="px-6 pb-4">
                        <Typography
                          variant="h6"
                          fontWeight="semibold"
                          className="text-center"
                        >
                          Gender
                        </Typography>
                      </View>

                      {/* Options */}
                      <View className="px-6 pb-8">
                        {genderOptions.map((option) => (
                          <TouchableOpacity
                            key={option.value}
                            className="flex-row items-center justify-between py-4 border-b border-gray-100 last:border-b-0"
                            onPress={() => {
                              handleInputChange(option.value, "gender");
                              setShowGenderPicker(false);
                            }}
                          >
                            <Typography
                              variant="body1"
                              className="text-gray-900"
                            >
                              {option.label}
                            </Typography>
                            {formData.gender === option.value && (
                              <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center">
                                <Typography
                                  variant="body2"
                                  className="text-white font-bold"
                                >
                                  ✓
                                </Typography>
                              </View>
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </Modal>

                {/* State Picker Bottom Sheet */}
                <Modal
                  visible={showStatePicker}
                  transparent={true}
                  animationType="slide"
                  onRequestClose={() => setShowStatePicker(false)}
                >
                  <TouchableOpacity
                    className="flex-1 justify-end bg-black/50"
                    activeOpacity={1}
                    onPress={() => setShowStatePicker(false)}
                  >
                    <TouchableOpacity
                      className="bg-white rounded-t-3xl shadow-lg"
                      activeOpacity={1}
                      onPress={() => {}}
                    >
                      {/* Drag Handle */}
                      <View className="items-center py-3">
                        <View className="w-10 h-1 bg-gray-300 rounded-full" />
                      </View>

                      {/* Title */}
                      <View className="px-6 pb-4">
                        <Typography
                          variant="h6"
                          fontWeight="semibold"
                          className="text-center"
                        >
                          Select State
                        </Typography>
                      </View>

                      {/* Options */}
                      <ScrollView className="max-h-80 px-6 pb-8">
                        {usStates.map((state) => (
                          <TouchableOpacity
                            key={state.abbreviation}
                            className="flex-row items-center justify-between py-4 border-b border-gray-100 last:border-b-0"
                            onPress={() => {
                              handleInputChange(state.name, "state");
                              setShowStatePicker(false);
                            }}
                          >
                            <Typography
                              variant="body1"
                              className="text-gray-900"
                            >
                              {state.name}
                            </Typography>
                            {formData.state === state.name && (
                              <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center">
                                <Typography
                                  variant="body2"
                                  className="text-white font-bold"
                                >
                                  ✓
                                </Typography>
                              </View>
                            )}
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </Modal>
              </ScrollView>
              {/* </TouchableWithoutFeedback> */}
            </>
          )}
        </View>
      </SafeAreaView>
      {/* </TouchableWithoutFeedback> */}
    </KeyboardAvoidingView>
  );
};

export default EditProfile;
