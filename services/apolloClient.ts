import { API_CONFIG } from "@/constants/config";
import { getValueFor, removeValue } from "@/hooks/useOtpVerification";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { router } from "expo-router";
import { Platform } from "react-native";

// Flag to prevent multiple logout attempts
let isLoggingOut = false;

const httpLink = new HttpLink({
  uri: API_CONFIG.GRAPHQL_ENDPOINT,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await getValueFor("session");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError((error: any) => {
  // Check for GraphQL errors in different possible locations
  let graphQLErrors = error.graphQLErrors || error.error || [];

  // If error.error is a single error, wrap it in an array
  if (graphQLErrors && !Array.isArray(graphQLErrors)) {
    graphQLErrors = [graphQLErrors];
  }

  if (graphQLErrors && graphQLErrors.length > 0) {
    const messages = graphQLErrors.map((err: any) => {
      // Handle different error message formats
      return err.message || err.toString() || String(err);
    });

    // Check for unauthorized errors
    const isUnauthorized = messages.some(
      (message: string) =>
        message.includes("Unauthorized") ||
        message.includes("unauthorized") ||
        message.includes("session expired") ||
        message.includes("authentication required") ||
        message.includes("invalid token") ||
        message.includes("token expired")
    );

    if (isUnauthorized && !isLoggingOut) {
      isLoggingOut = true;

      // Clear all storage
      const clearAllStorage = async () => {
        try {
          // Clear all possible storage keys
          await removeValue("session");
          await removeValue("biometric_session");
          await removeValue("reset_token");

          // Clear localStorage on web platform
          if (Platform.OS === "web") {
            localStorage.clear();
          }

          // Clear Apollo cache
          client.clearStore();

          // Navigate to login with a small delay to ensure storage is cleared
          setTimeout(() => {
            router.replace("/(auth)/login");
          }, 100);
        } catch (error) {
          console.error("Error during logout:", error);
        } finally {
          // Reset the flag after a delay
          setTimeout(() => {
            isLoggingOut = false;
          }, 2000);
        }
      };

      clearAllStorage();
    }
  }

  if (error.networkError) {
    console.error("Network error:", error.networkError);
  }
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([errorLink, authLink, httpLink]),
});
