import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { FETCH_USER } from "@/services/graphql/queries/sequencesQueries";
import { getValueFor } from "@/hooks/useOtpVerification";
import { API_CONFIG } from "@/constants/config";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  imageUrl: string | null;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  gender: string;
  dateOfBirth: string;
  clinicId: string;
  clinicName: string;
  userType: string;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  error: any;
  refetch: () => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: false,
  error: null,
  refetch: () => {},
});

export function useUser() {
  const value = useContext(UserContext);
  if (!value) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return value;
}

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch user ID from storage
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getValueFor("user_id");
      setUserId(id);
    };
    fetchUserId();
  }, []);

  // Fetch user data
  const {
    data: userData,
    loading,
    error,
    refetch,
  } = useQuery(FETCH_USER, {
    variables: { fetchUserId: userId },
    skip: !userId,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

  // Process user data
  const user: User | null = userData ? (() => {
    try {
      const rawUser = (userData as any)?.fetchUser?.user;
      if (!rawUser) return null;

      // Construct full image URL with backend URL
      const fullImageUrl = rawUser.imageUrl
        ? `${API_CONFIG.BASE_URL}${rawUser.imageUrl}`
        : null;

      return {
        id: rawUser.id || "",
        firstName: rawUser.firstName || "",
        lastName: rawUser.lastName || "",
        fullName: rawUser.fullName || "",
        email: rawUser.email || "",
        phone: rawUser.phone || "",
        imageUrl: fullImageUrl,
        address: rawUser.address || "",
        city: rawUser.city || "",
        state: rawUser.state || "",
        zipCode: rawUser.zipCode || "",
        gender: rawUser.gender || "",
        dateOfBirth: rawUser.dateOfBirth || "",
        clinicId: rawUser.clinicId || "",
        clinicName: rawUser.clinicName || "",
        userType: rawUser.userType || "",
      };
    } catch (error) {
      console.error("Error processing user data:", error);
      return null;
    }
  })() : null;

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        refetch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
