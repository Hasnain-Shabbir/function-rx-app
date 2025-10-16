import { API_CONFIG } from "@/constants/config";
import { useSession } from "@/context/SessionProvider/SessionProvider";
import { getValueFor } from "@/hooks/useOtpVerification";
import { FETCH_USER } from "@/services/graphql/queries/sequencesQueries";
import { useQuery } from "@apollo/client/react";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

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
  refreshUserData: () => Promise<void>;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: false,
  error: null,
  refetch: () => {},
  refreshUserData: async () => {},
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
  const { session } = useSession();

  // Fetch user ID from storage and listen for changes
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getValueFor("user_id");
      setUserId(id);
    };

    // Initial fetch
    fetchUserId();

    // Set up a more efficient polling mechanism
    // Check every 500ms when there's no userId but there's a session
    const interval = setInterval(() => {
      if (!userId && session) {
        fetchUserId();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [userId, session]);

  // Clear user data when session is cleared (logout)
  useEffect(() => {
    if (!session) {
      setUserId(null);
    }
  }, [session]);

  // Manual refresh function to trigger user data fetch
  const refreshUserData = async () => {
    const id = await getValueFor("user_id");
    setUserId(id);
    if (id) {
      refetch();
    }
  };

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
  const user: User | null = userData
    ? (() => {
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
      })()
    : null;

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        refetch,
        refreshUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
