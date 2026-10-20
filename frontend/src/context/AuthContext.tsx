import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, logOutUser } from "../features/auth/api";
import type { UserProfile } from "../features/auth/types";

import type { ReactNode } from "react";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to fetch or refresh the current user profile from the backend
  const refreshUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null); // If API fails (e.g., expired token), make sure user is logged out
    } finally {
      setLoading(false);
    }
  };

  // Run this automatically when the app first loads up in the browser
  useEffect(() => {
    refreshUser();
  }, []);

  const logout = async () => {
    try {
      await logOutUser();
    } catch (error) {
      console.error(
        "Logout failed API side, clearing local state anyway:",
        error,
      );
    } finally {
      setUser(null); // Always clear the user state locally
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user, // true if user exists, false if null
        loading,
        logout,
        refreshUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
