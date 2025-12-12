import React, { createContext, useState, useContext, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  googleId?: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithGoogle: (token: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Mock login
    setTimeout(() => {
        setUser({
            id: "1",
            username: "Demo User",
            email: email,
            role: "admin"
        });
        setIsLoading(false);
    }, 500);
  };

  const loginWithGoogle = async (token: string) => {
     // Mock google login
     setIsLoading(true);
     setTimeout(() => {
         setUser({
             id: "1",
             username: "Google User",
             email: "google@example.com",
             role: "user"
         });
         setIsLoading(false);
     }, 500);
  };

  const register = async (username: string, email: string, password: string) => {
    // Mock register
    setIsLoading(true);
    setTimeout(() => {
        setUser({
            id: "1",
            username: username,
            email: email,
            role: "user"
        });
        setIsLoading(false);
    }, 500);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, loginWithGoogle, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
