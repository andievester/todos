import { AuthContext } from "@/contexts/auth-context";
import { useState, type ReactNode } from "react";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/services/token-service";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(ACCESS_TOKEN_KEY)
  );

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setToken(null);
  };

  const handleSetToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, newToken);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
    setToken(newToken);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken: handleSetToken,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
