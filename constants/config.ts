// API Configuration
export const API_CONFIG = {
  BASE_URL:
    process.env.EXPO_PUBLIC_API_URL || "https://staging-api.functionrx.health",
  GRAPHQL_ENDPOINT: `${process.env.EXPO_PUBLIC_API_URL || "https://staging-api.functionrx.health"}/graphql`,
} as const;
