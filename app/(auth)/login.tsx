import { Typography } from "@/components";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { useBiometricAuth } from "@/hooks/useBiometricAuth";
import useLoginForm from "@/hooks/useLoginForm";
import { Link } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  const {
    formData,
    handleInputChange,
    handleLoginSubmit,
    loginUserLoading,
    errors,
  } = useLoginForm();
  const { authenticateWithBiometric, isBiometricEnabled } = useBiometricAuth();
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Refs for input navigation
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const enabled = await isBiometricEnabled();
    setBiometricAvailable(enabled);
  };

  const handleBiometricLogin = async () => {
    await authenticateWithBiometric();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Refresh biometric availability status
      await checkBiometricAvailability();
      // You can add other login page refresh logic here
    } catch (error) {
      console.error("Error refreshing login page:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="flex-1 bg-misc">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
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
                    ref={emailInputRef}
                    label="Email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChangeText={(text) => handleInputChange(text, "email")}
                    inputSize="md"
                    type="email"
                    isError={!!errors.email}
                    errorMessage={errors.email}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                  />
                  <Input
                    ref={passwordInputRef}
                    label="Password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChangeText={(text) => handleInputChange(text, "password")}
                    type="password"
                    inputSize="md"
                    isError={!!errors.password}
                    errorMessage={errors.password}
                    returnKeyType="done"
                    onSubmitEditing={handleLoginSubmit}
                  />
                  <View className="items-start">
                    <Link href="/forgot-password" asChild>
                      <Button variant={"link"} size={"md"} className="p-0">
                        Forgot Password?
                      </Button>
                    </Link>

                    {/* <Link href="/otp-verification" asChild>
                <Button variant={"link"} size={"md"} className="p-0">
                  Otp Verification
                </Button>
              </Link> */}
                  </View>
                </View>

                <View>
                  <Button
                    size="md"
                    className="w-full mb-4"
                    // disabled={loginUserLoading}
                    onPress={() => {
                      handleLoginSubmit();
                      console.log("Login pressed");
                    }}
                  >
                    Login
                  </Button>
                  {biometricAvailable && (
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full"
                      onPress={handleBiometricLogin}
                    >
                      Login with Biometric
                    </Button>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;
