import { client } from "@/services/apolloClient";
import { ApolloProvider } from "@apollo/client/react";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import ToastManager from "toastify-react-native";
import "./global.css";

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // For development/testing - you can toggle this to switch between screens
  useEffect(() => {
    // Set to false to show login screen, true to show tabs
    setIsAuthenticated(false);
  }, []);

  return (
    <ApolloProvider client={client}>
      <Stack>
        {isAuthenticated ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}
      </Stack>
      <ToastManager />
    </ApolloProvider>
  );
}
