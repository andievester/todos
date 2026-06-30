import { SignupForm } from "../components/SignupForm";
import { AuthPrompt } from "../components/AuthPrompt";
import { AuthLayout } from "../layouts/AuthLayout";

export function SignupPage() {
  return (
    <AuthLayout
      title="Create an account"
      description="Enter your details to get started."
    >
      <SignupForm />
      <AuthPrompt
        message="Already have an account?"
        actionText="Login"
        path="/login"
      />
    </AuthLayout>
  );
}
