import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
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

export default _layout;
