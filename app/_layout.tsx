import { client } from "@/services/apolloClient";
import { ApolloProvider } from "@apollo/client/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import ToastManager from "toastify-react-native";
import "./global.css";

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for authentication token on app start
  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error("Error checking auth token:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthToken();
  }, []);

  // Show loading screen while checking authentication
  if (isLoading) {
    return null; // or a loading component
  }

  return (
    <ApolloProvider client={client}>
      <Stack screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="change-password"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="edit-profile"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="sequence-detail"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="exercise-detail"
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}
      </Stack>
      <ToastManager />
    </ApolloProvider>
  );
}
