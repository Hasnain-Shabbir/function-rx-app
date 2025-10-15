import { ChevronLeft } from "@/assets/icons";
import { AppInputGroup, Typography } from "@/components";
import { getValueFor } from "@/hooks/useOtpVerification";
import { UPDATE_USER } from "@/services/graphql/mutations/authMutations";
import { FETCH_USER } from "@/services/graphql/queries/sequencesQueries";
import { useMutation, useQuery } from "@apollo/client/react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
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
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  // Fetch user ID from storage
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getValueFor("user_id");
      setUserId(id);
    };
    fetchUserId();
  }, []);

  // Fetch user data
  const { data: userData, loading: userLoading } = useQuery(FETCH_USER, {
    variables: { fetchUserId: userId },
    skip: !userId,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

  // Update mutation
  const [updateUser, { loading: updateUserLoading }] = useMutation(UPDATE_USER);

  // Prefill form data when user data is available
  useEffect(() => {
    if (userData) {
      const user = (userData as any)?.fetchUser?.user;
      if (user) {
        const dateOfBirth = user.dateOfBirth
          ? new Date(user.dateOfBirth)
          : new Date();
        setSelectedDate(dateOfBirth);
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
        };
        setFormData(userFormData);
        setOriginalData(userFormData);
      }
    }
  }, [userData]);

  const handleInputChange = (
    text: string,
    fieldName: keyof typeof formData
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: text,
    }));

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<typeof formData> = {};

    // Email validation
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Phone validation (basic)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number";
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
  };

  const handleSaveChanges = async () => {
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
        // Convert date to ISO format for the API
        try {
          const dateObj = new Date(formData.dateOfBirth);
          if (!isNaN(dateObj.getTime())) {
            userAttributes.dateOfBirth = dateObj.toISOString();
          }
        } catch (dateError) {
          console.error("Date conversion error:", dateError);
          Toast.error("Invalid date format");
          return;
        }
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

      // Check if there are any changes
      if (Object.keys(userAttributes).length === 0) {
        Toast.info("No changes detected");
        return;
      }

      console.log("Sending userAttributes:", userAttributes);

      // Prepare input object
      const input = {
        id: userId,
        userAttributes,
      };

      await updateUser({
        variables: { input },
        update: (cache, { data }: any) => {
          try {
            // Update the cache with the new user data
            if (data?.updateUser?.user) {
              cache.writeQuery({
                query: FETCH_USER,
                variables: { fetchUserId: userId },
                data: {
                  fetchUser: {
                    user: data.updateUser.user,
                  },
                },
              });
            }
          } catch (cacheError) {
            console.error("Cache update error:", cacheError);
          }
        },
        onCompleted: (res: any) => {
          try {
            Toast.success("Profile updated successfully");
            console.log("Profile updated:", res?.updateUser?.user);
            // Update local state with the new data
            if (res?.updateUser?.user) {
              const updatedUser = res.updateUser.user;
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
              };
              setFormData(updatedFormData);
              setOriginalData(updatedFormData);
            }
            router.back();
          } catch (completionError) {
            console.error("Error in completion handler:", completionError);
            Toast.error("Profile updated but there was an issue");
          }
        },
        onError: (err) => {
          console.error("Error updating profile:", err);
          const errorMessage = err?.message || "Failed to update profile";
          Toast.error(errorMessage);
        },
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      Toast.error("Error saving profile. Please try again.");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate refresh - you can add actual edit profile refresh logic here
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error("Error refreshing edit profile page:", error);
      setRefreshing(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === "ios");
    setSelectedDate(currentDate);

    // Format date as MM/DD/YYYY
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

    setFormData((prevState) => ({
      ...prevState,
      dateOfBirth: formattedDate,
    }));
  };

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  // Show loading state while user data is being fetched
  if (userLoading) {
    return (
      <SafeAreaView className="flex-1 bg-misc">
        <View className="flex-1 justify-center items-center">
          <Typography variant="body1">Loading profile...</Typography>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-misc">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row items-center justify-between">
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ChevronLeft width={24} height={24} color="#6B7280" />
        </TouchableOpacity>

        {/* Title */}
        <Typography variant="h6" className="font-semibold text-gray-900">
          Edit Profile
        </Typography>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSaveChanges}
          disabled={updateUserLoading}
          className="p-2"
        >
          <Typography
            variant="body1"
            className={`font-medium ${updateUserLoading ? "text-gray-400" : "text-blue-500"}`}
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="gap-6">
          {/* Personal Details Group */}
          <AppInputGroup
            title="Personal Details"
            inputs={[
              {
                id: "firstName",
                title: "First Name",
                value: formData.firstName,
                onChangeText: (text) => handleInputChange(text, "firstName"),
                placeholder: "Enter your first name",
              },
              {
                id: "lastName",
                title: "Last Name",
                value: formData.lastName,
                onChangeText: (text) => handleInputChange(text, "lastName"),
                placeholder: "Enter your last name",
              },
              {
                id: "email",
                title: "Email",
                value: formData.email,
                onChangeText: (text) => handleInputChange(text, "email"),
                placeholder: "Enter your email",
                editable: false,
              },
              {
                id: "phone",
                title: "Phone Number",
                value: formData.phone,
                onChangeText: (text) => handleInputChange(text, "phone"),
                placeholder: "Enter your phone number",
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
                value: formData.dateOfBirth,
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
                onChangeText: (text) => handleInputChange(text, "address"),
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
                onChangeText: (text) => handleInputChange(text, "state"),
                placeholder: "Enter your state",
              },
              {
                id: "zipCode",
                title: "Zipcode",
                value: formData.zipCode,
                onChangeText: (text) => handleInputChange(text, "zipCode"),
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
                    <Typography variant="body1" className="text-gray-900">
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
