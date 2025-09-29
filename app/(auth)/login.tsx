import { Typography } from "@/components";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import React, { useState } from "react";
import { Image, SafeAreaView, View } from "react-native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-misc">
      <View className="flex-1 justify-center items-center px-6">
        {/* Logo Section */}
        <View className="items-center mb-6">
          <Image
            source={require("@/assets/images/logo-full.png")}
            className="w-48 h-16 mb-4"
            resizeMode="contain"
          />
        </View>

        {/* Login Form Section */}
        <View className="w-full max-w-sm shadow-lg gap-6 border border-borderLight p-4 rounded-2xl bg-white">
          <View>
            <Typography variant="h6" fontWeight="semibold">
              Login
            </Typography>
            <Typography variant="body1" className="text-medium mt-1">
              Enter your credentials
            </Typography>
          </View>

          <View className="gap-4">
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              inputSize="md"
              type="email"
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              type="password"
              inputSize="md"
            />
            <View className="items-start">
              <Button variant={"link"} size={"md"} className="p-0">
                Forgot Password?
              </Button>
            </View>
          </View>

          <View>
            <Button
              size="md"
              className="w-full mb-4"
              disabled
              onPress={() => {
                // TODO: Implement login logic
                console.log("Login pressed");
              }}
            >
              Login
            </Button>
            <Button
              variant="outline"
              size="md"
              className="w-full"
              onPress={() => {
                // TODO: Implement sign up navigation
                console.log("Sign up pressed");
              }}
            >
              Login with Biometric
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
