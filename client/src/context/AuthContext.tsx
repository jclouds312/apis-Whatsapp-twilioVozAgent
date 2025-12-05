import { createContext, useContext, useState } from "react";

type User = {
  id: string;
  username: string;
  role: string;
} | null;

type AuthContextType = {
  user: User;
  login: (username: string) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({ id: "1", username: "Demo User", role: "admin" });
  const [isLoading, setIsLoading] = useState(false);

  const login = (username: string) => {
    setUser({ id: "1", username, role: "admin" });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
