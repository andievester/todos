import { LoginForm } from "../components/LoginForm";
import { AuthPrompt } from "../components/AuthPrompt";
import { AuthLayout } from "../layouts/AuthLayout";

export function LoginPage() {
  return (
    <AuthLayout
      title="Welcome"
      description="Enter your email and password to sign in."
    >
      <LoginForm />
      <AuthPrompt
        message="Don't have an account?"
        actionText="Sign up"
        path="/signup"
      />
    </AuthLayout>
  );
}
