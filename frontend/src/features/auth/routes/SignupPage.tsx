import { AuthPrompt } from "../components/AuthPrompt";
import { AuthLayout } from "../layouts/AuthLayout";
import { AuthForm } from "../components/AuthForm";

export function SignupPage() {
  return (
    <AuthLayout
      title="Create an account"
      description="Enter your details to get started."
    >
      <AuthForm mode="signup" />
      <AuthPrompt
        message="Already have an account?"
        actionText="Login"
        path="/login"
      />
    </AuthLayout>
  );
}
