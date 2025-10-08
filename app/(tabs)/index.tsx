import {
  AppInput,
  AppInputGroup,
  Avatar,
  StatCard,
  Typography,
} from "@/components";
import { stats } from "@/constants/stats";
import { useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("johndoe@gmail.com");
  const [gender] = useState("Male");
  const [dateOfBirth] = useState("23 May, 1990");
  const [currentPassword, setCurrentPassword] = useState("•••••••••");
  const [newPassword, setNewPassword] = useState("••••");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleGenderPress = () => {
    // Simulate opening gender picker
    console.log("Opening gender picker");
  };

  const handleDateOfBirthPress = () => {
    // Simulate opening date picker
    console.log("Opening date picker");
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-misc">
      <ScrollView
        className="flex-1 p-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
        }}
      >
        <View className="flex-row justify-between items-center w-full gap-4">
          <View>
            <Typography
              variant="body1"
              fontWeight="semibold"
              className="text-medium mb-1"
            >
              Welcome
            </Typography>
            <Typography variant="h6" fontWeight="semibold">
              John Doe
            </Typography>
          </View>

          <Avatar
            size="xl"
            src="https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
          />
        </View>

        <View className="mt-6">
          <FlatList
            data={stats}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: 8 }}
            contentContainerStyle={{ gap: 8 }}
            renderItem={({ item }) => (
              <View className="flex-1">
                <StatCard {...item} />
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        {/* AppInput Examples Section */}
        <View className="mt-8 gap-6">
          <Typography variant="h6" fontWeight="semibold" className="text-black">
            Input Components Demo
          </Typography>

          {/* Single AppInput Examples */}
          <View className="gap-4">
            <Typography
              variant="body1"
              fontWeight="medium"
              className="text-gray-700"
            >
              Single Inputs
            </Typography>

            <AppInput
              title="First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter first name"
            />

            <AppInput
              title="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email address"
            />
          </View>

          {/* AppInputGroup Example - Personal Details */}
          <View className="gap-4">
            <Typography
              variant="body1"
              fontWeight="medium"
              className="text-gray-700"
            >
              Input Group - Personal Details
            </Typography>

            <AppInputGroup
              title="Personal Details"
              inputs={[
                {
                  id: "firstName",
                  title: "First Name",
                  value: firstName,
                  onChangeText: setFirstName,
                },
                {
                  id: "lastName",
                  title: "Last Name",
                  value: lastName,
                  onChangeText: setLastName,
                },
                {
                  id: "email",
                  title: "Email",
                  value: email,
                  onChangeText: setEmail,
                },
                {
                  id: "gender",
                  title: "Gender",
                  value: gender,
                  onPress: handleGenderPress,
                  showArrow: true,
                  editable: false,
                },
                {
                  id: "dateOfBirth",
                  title: "Date of Birth",
                  value: dateOfBirth,
                  onPress: handleDateOfBirthPress,
                  showArrow: true,
                  editable: false,
                },
              ]}
            />
          </View>

          {/* AppInputGroup Example - Password Change */}
          <View className="gap-4">
            <Typography
              variant="body1"
              fontWeight="medium"
              className="text-gray-700"
            >
              Input Group - Password Change
            </Typography>

            <AppInputGroup
              inputs={[
                {
                  id: "currentPassword",
                  title: "Current Password",
                  value: currentPassword,
                  onChangeText: setCurrentPassword,
                  placeholder: "Enter current password",
                },
                {
                  id: "newPassword",
                  title: "New Password",
                  value: newPassword,
                  onChangeText: setNewPassword,
                  placeholder: "Enter new password",
                },
                {
                  id: "confirmPassword",
                  title: "Confirm Password",
                  value: confirmPassword,
                  onChangeText: setConfirmPassword,
                  placeholder: "Type here...",
                },
              ]}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
