import { useSession } from "@/context";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

const AuthLayout = () => {
  const { isLoading, session } = useSession();

  // While restoring session, show a loader (avoid flashing login)
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If already authenticated, do not allow visiting auth screens
  if (session) {
    return <Redirect href="/" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          title: "Login",
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          headerShown: false,
          title: "Forgot Password",
        }}
      />
      <Stack.Screen
        name="otp-verification"
        options={{
          headerShown: false,
          title: "Otp Verification",
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
