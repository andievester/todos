import type { ReactNode } from "react";
import { AuthProvider } from "./auth-provider";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { CircleCheckIcon, OctagonXIcon } from "lucide-react";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <AuthProvider>
      <BrowserRouter>
        {children}
        <Toaster
          position="top-center"
          icons={{
            success: <CircleCheckIcon className="size-4 text-green" />,
            error: <OctagonXIcon className="size-4 text-red" />,
          }}
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                "w-[325px] flex items-center gap-3 rounded-xl border border-input bg-surface px-4 py-3.5 shadow-lg text-text-primary",

              title: "text-[14px] font-semibold",
              description: "text-[14px] opacity-80",
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
};
