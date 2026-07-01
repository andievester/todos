import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("jwt_token")
  );

  const logout = () => {
    localStorage.removeItem("jwt_token");
    setToken(null);
  };

  const handleSetToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("jwt_token", newToken);
    } else {
      localStorage.removeItem("jwt_token");
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

//TODO: investigate warning

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
