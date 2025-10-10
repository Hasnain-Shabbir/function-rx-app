/**
 * JWT Token Utilities for HIPAA Compliance
 * Handles token expiration checks and validation
 */

export interface JWTPayload {
  exp: number;
  iat: number;
  [key: string]: any;
}

/**
 * Decodes a JWT token without verification
 * @param token - The JWT token string
 * @returns Decoded payload or null if invalid
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];

    // Add padding if needed for base64 decoding
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);

    // Decode base64url
    const decodedPayload = atob(
      paddedPayload.replace(/-/g, "+").replace(/_/g, "/")
    );

    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

/**
 * Checks if a JWT token is expired
 * @param token - The JWT token string
 * @returns true if token is expired, false if valid, null if invalid token
 */
export const isTokenExpired = (token: string): boolean | null => {
  const payload = decodeJWT(token);

  if (!payload || typeof payload.exp !== "number") {
    return null; // Invalid token
  }

  // Get current time in seconds (JWT exp is in seconds)
  const currentTime = Math.floor(Date.now() / 1000);

  // Check if token is expired (with 5 minute buffer for safety)
  const bufferTime = 5 * 60; // 5 minutes in seconds
  return payload.exp < currentTime + bufferTime;
};

/**
 * Gets the expiration time of a JWT token
 * @param token - The JWT token string
 * @returns Expiration time as Date object or null if invalid
 */
export const getTokenExpiration = (token: string): Date | null => {
  const payload = decodeJWT(token);

  if (!payload || typeof payload.exp !== "number") {
    return null;
  }

  // Convert seconds to milliseconds
  return new Date(payload.exp * 1000);
};

/**
 * Gets the time remaining until token expiration
 * @param token - The JWT token string
 * @returns Time remaining in milliseconds or null if invalid/expired
 */
export const getTimeUntilExpiration = (token: string): number | null => {
  const expiration = getTokenExpiration(token);

  if (!expiration) {
    return null;
  }

  const currentTime = Date.now();
  const timeRemaining = expiration.getTime() - currentTime;

  return timeRemaining > 0 ? timeRemaining : null;
};
