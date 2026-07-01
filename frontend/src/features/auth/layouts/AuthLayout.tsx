import type { ReactNode } from "react";
import { AuthHeader } from "../components/AuthHeader";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

// TODO: can we put page-root in just one spot
// TODO: style page error message for unsuccessful login/signup

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <div className="page-root items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <AuthHeader title={title} description={description} />
        {children}
      </div>
    </div>
  );
}
