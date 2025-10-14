import { Picker, Typography } from "@/components";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { getValueFor } from "@/hooks/useOtpVerification";
import { UPDATE_USER } from "@/services/graphql/mutations/authMutations";
import { FETCH_USER } from "@/services/graphql/queries/sequencesQueries";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";

const EditProfile = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
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
  });

  // Update mutation
  const [updateUser, { loading: updateUserLoading }] = useMutation(UPDATE_USER);

  // Prefill form data when user data is available
  useEffect(() => {
    if (userData) {
      const user = (userData as any)?.fetchUser?.user;
      if (user) {
        setFormData({
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
        });
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

      // Prepare variables for the mutation
      const variables: any = {
        id: userId,
      };

      // Only include fields that have values
      if (formData.firstName?.trim())
        variables.firstName = formData.firstName.trim();
      if (formData.lastName?.trim())
        variables.lastName = formData.lastName.trim();
      if (formData.email?.trim()) variables.email = formData.email.trim();
      if (formData.phone?.trim()) variables.phone = formData.phone.trim();
      if (formData.gender?.trim()) variables.gender = formData.gender.trim();
      if (formData.dateOfBirth?.trim())
        variables.dateOfBirth = formData.dateOfBirth.trim();
      if (formData.address?.trim()) variables.address = formData.address.trim();
      if (formData.city?.trim()) variables.city = formData.city.trim();
      if (formData.state?.trim()) variables.state = formData.state.trim();
      if (formData.zipCode?.trim()) variables.zipCode = formData.zipCode.trim();

      await updateUser({
        variables,
        onCompleted: (res: any) => {
          Toast.success("Profile updated successfully");
          console.log("Profile updated:", res.updateUser.user);
          router.back();
        },
        onError: (err) => {
          console.error("Error updating profile:", err);
          Toast.error(err.message || "Failed to update profile");
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

  const [selectedLanguage, setSelectedLanguage] = useState("");

  const languageOptions = [
    { label: "Java", value: "java" },
    { label: "JavaScript", value: "js" },
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
        <Typography variant="h6" className="mb-6">
          Edit Profile
        </Typography>

        <Picker
          label="Programming Language"
          placeholder="Select a language"
          selectedValue={selectedLanguage}
          onValueChange={(itemValue) => setSelectedLanguage(String(itemValue))}
          items={languageOptions}
          inputSize="md"
        />

        <View className="gap-4">
          {/* First Name */}
          <Input
            label="First Name"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChangeText={(text) => handleInputChange(text, "firstName")}
            inputSize="md"
            isError={!!errors.firstName}
            errorMessage={errors.firstName}
          />

          {/* Last Name */}
          <Input
            label="Last Name"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChangeText={(text) => handleInputChange(text, "lastName")}
            inputSize="md"
            isError={!!errors.lastName}
            errorMessage={errors.lastName}
          />

          {/* Email */}
          <Input
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(text) => handleInputChange(text, "email")}
            inputSize="md"
            type="email"
            isError={!!errors.email}
            errorMessage={errors.email}
          />

          {/* Phone Number */}
          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChangeText={(text) => handleInputChange(text, "phone")}
            inputSize="md"
            keyboardType="phone-pad"
            isError={!!errors.phone}
            errorMessage={errors.phone}
          />

          {/* Gender */}
          <Input
            label="Gender"
            placeholder="Enter your gender"
            value={formData.gender}
            onChangeText={(text) => handleInputChange(text, "gender")}
            inputSize="md"
            isError={!!errors.gender}
            errorMessage={errors.gender}
          />

          {/* Date of Birth */}
          <Input
            label="Date of Birth"
            placeholder="Enter your date of birth (MM/DD/YYYY)"
            value={formData.dateOfBirth}
            onChangeText={(text) => handleInputChange(text, "dateOfBirth")}
            inputSize="md"
            isError={!!errors.dateOfBirth}
            errorMessage={errors.dateOfBirth}
          />

          {/* Address */}
          <Input
            label="Address"
            placeholder="Enter your address"
            value={formData.address}
            onChangeText={(text) => handleInputChange(text, "address")}
            inputSize="md"
            multiline
            numberOfLines={3}
            isError={!!errors.address}
            errorMessage={errors.address}
          />

          {/* City */}
          <Input
            label="City"
            placeholder="Enter your city"
            value={formData.city}
            onChangeText={(text) => handleInputChange(text, "city")}
            inputSize="md"
            isError={!!errors.city}
            errorMessage={errors.city}
          />

          {/* State */}
          <Input
            label="State"
            placeholder="Enter your state"
            value={formData.state}
            onChangeText={(text) => handleInputChange(text, "state")}
            inputSize="md"
            isError={!!errors.state}
            errorMessage={errors.state}
          />

          {/* Zipcode */}
          <Input
            label="Zipcode"
            placeholder="Enter your zipcode"
            value={formData.zipCode}
            onChangeText={(text) => handleInputChange(text, "zipCode")}
            inputSize="md"
            keyboardType="numeric"
            isError={!!errors.zipCode}
            errorMessage={errors.zipCode}
          />
        </View>

        {/* Save Changes Button */}
        <View className="mt-8">
          <Button
            variant="default"
            size="lg"
            className="w-full"
            onPress={handleSaveChanges}
            loading={updateUserLoading}
            disabled={updateUserLoading}
          >
            Save Changes
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
