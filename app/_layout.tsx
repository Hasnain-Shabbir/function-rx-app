import { SessionProvider, UserProvider, useSession } from "@/context";
import { client } from "@/services/apolloClient";
import { ApolloProvider } from "@apollo/client/react";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { useEffect } from "react";
import ToastManager from "toastify-react-native";
import "./global.css";
import SplashScreenController from "./splash";

export default function RootLayout() {
  useEffect(() => {
    const setNavigationBarStyle = async () => {
      await NavigationBar.setButtonStyleAsync("dark");
    };

    setNavigationBarStyle();
  }, []);

  return (
    <SessionProvider>
      <ApolloProvider client={client}>
        <UserProvider>
          <SplashScreenController />
          <ToastManager />
          <RootNavigator />
        </UserProvider>
      </ApolloProvider>
    </SessionProvider>
  );
}

function RootNavigator() {
  const { session } = useSession();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "#f9faf7",
        },
      }}
    >
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="change-password" options={{ headerShown: false }} />
        <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
        <Stack.Screen name="sequence-detail" options={{ headerShown: false }} />
        <Stack.Screen name="exercise-detail" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
