import { AuthPrompt } from "../components/AuthPrompt";
import { AuthLayout } from "../layouts/AuthLayout";
import { AuthForm } from "../components/AuthForm";

export function LoginPage() {
  return (
    <AuthLayout
      title="Welcome"
      description="Enter your email and password to sign in."
    >
      <AuthForm mode="login" />
      <AuthPrompt
        message="Don't have an account?"
        actionText="Sign up"
        path="/signup"
      />
    </AuthLayout>
  );
}
