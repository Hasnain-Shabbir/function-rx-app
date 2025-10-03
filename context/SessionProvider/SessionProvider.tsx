import { createContext, PropsWithChildren, useContext } from "react";
import { useStorageState } from "../../hooks/useStorageState";

type AuthContextType = {
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
  session?: string | null;
};

export const AuthContext = createContext<AuthContextType>({
  isLoading: false,
  session: null,
  login: () => {},
  logout: () => {},
});

export function useSession() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useSession must be used within an AuthProvider");
  }
  return value;
}

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const [[isLoading, session], setSession] = useStorageState("session");

  const login = (token: string) => {
    setSession(token);
  };

  const logout = () => {
    setSession(null);
  };

  return (
    <AuthContext
      value={{
        isLoading,
        session,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
};
