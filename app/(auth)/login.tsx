import { Button } from "@/components/Button/Button";
import React from "react";
import { Image, SafeAreaView, View } from "react-native";

const Login = () => {
  return (
    <SafeAreaView className="flex-1 bg-misc">
      <View className="flex-1 justify-center items-center px-6">
        {/* Logo Section */}
        <View className="items-center mb-12">
          <Image
            source={require("@/assets/images/logo-full.png")}
            className="w-48 h-16 mb-4"
            resizeMode="contain"
          />
        </View>

        {/* Login Form Section */}
        <View className="w-full max-w-sm shadow-lg h-[400px] border border-borderLight p-4 rounded-2xl bg-white">
          <Button
            size="lg"
            className="w-full mb-4"
            onPress={() => {
              // TODO: Implement login logic
              console.log("Login pressed");
            }}
          >
            Login
          </Button>

          <Button
            variant="outline"
            size="lg"
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
    </SafeAreaView>
  );
};

export default Login;
