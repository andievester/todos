import type { ReactNode } from "react";
import { AuthProvider } from "./auth-provider";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

interface AppProviderProps {
  children: ReactNode;
}

// TODO: style toast

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <AuthProvider>
      <BrowserRouter>
        {children}
        <Toaster position="top-center" />
      </BrowserRouter>
    </AuthProvider>
  );
};
