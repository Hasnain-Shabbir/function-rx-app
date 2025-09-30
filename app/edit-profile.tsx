import { Typography } from "@/components";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";

const EditProfile = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const handleInputChange = (text: string, fieldName: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: text,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      // TODO: Implement save profile functionality
      console.log("Saving profile data:", formData);

      // Show success message
      Toast.success("Profile updated successfully");

      // Navigate back to profile
      router.back();
    } catch (error) {
      console.error("Error saving profile:", error);
      Toast.error("Error saving profile. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-misc">
      <ScrollView
        className="flex-1 p-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      >
        <Typography variant="h6" className="mb-6">
          Edit Profile
        </Typography>

        <View className="gap-4">
          {/* First Name */}
          <Input
            label="First Name"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChangeText={(text) => handleInputChange(text, "firstName")}
            inputSize="md"
          />

          {/* Last Name */}
          <Input
            label="Last Name"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChangeText={(text) => handleInputChange(text, "lastName")}
            inputSize="md"
          />

          {/* Email */}
          <Input
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(text) => handleInputChange(text, "email")}
            inputSize="md"
            type="email"
          />

          {/* Phone Number */}
          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            value={formData.phoneNumber}
            onChangeText={(text) => handleInputChange(text, "phoneNumber")}
            inputSize="md"
            keyboardType="phone-pad"
          />

          {/* Gender */}
          <Input
            label="Gender"
            placeholder="Enter your gender"
            value={formData.gender}
            onChangeText={(text) => handleInputChange(text, "gender")}
            inputSize="md"
          />

          {/* Date of Birth */}
          <Input
            label="Date of Birth"
            placeholder="Enter your date of birth (MM/DD/YYYY)"
            value={formData.dateOfBirth}
            onChangeText={(text) => handleInputChange(text, "dateOfBirth")}
            inputSize="md"
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
          />

          {/* City */}
          <Input
            label="City"
            placeholder="Enter your city"
            value={formData.city}
            onChangeText={(text) => handleInputChange(text, "city")}
            inputSize="md"
          />

          {/* State */}
          <Input
            label="State"
            placeholder="Enter your state"
            value={formData.state}
            onChangeText={(text) => handleInputChange(text, "state")}
            inputSize="md"
          />

          {/* Zipcode */}
          <Input
            label="Zipcode"
            placeholder="Enter your zipcode"
            value={formData.zipcode}
            onChangeText={(text) => handleInputChange(text, "zipcode")}
            inputSize="md"
            keyboardType="numeric"
          />
        </View>

        {/* Save Changes Button */}
        <View className="mt-8">
          <Button
            variant="default"
            size="lg"
            className="w-full"
            onPress={handleSaveChanges}
          >
            Save Changes
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
