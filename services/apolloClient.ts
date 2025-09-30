import { API_CONFIG } from "@/constants/config";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const httpLink = new HttpLink({
  uri: API_CONFIG.GRAPHQL_ENDPOINT,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem("auth_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});
