import {
  SessionProvider,
  useSession,
} from "@/context/SessionProvider/SessionProvider";
import { client } from "@/services/apolloClient";
import { ApolloProvider } from "@apollo/client/react";
import { Stack } from "expo-router";
import ToastManager from "toastify-react-native";
import "./global.css";
import SplashScreenController from "./splash";

export default function RootLayout() {
  return (
    <SessionProvider>
      <ApolloProvider client={client}>
        <SplashScreenController />
        <ToastManager />
        <RootNavigator />
      </ApolloProvider>
    </SessionProvider>
  );
}

function RootNavigator() {
  const { session } = useSession();

  return (
    <Stack screenOptions={{ headerShown: false }}>
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
