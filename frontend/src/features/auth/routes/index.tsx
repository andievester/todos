// auth/routes/index.tsx
import { LoginPage } from "./LoginPage";
import { SignupPage } from "./SignupPage";

export const AuthRoutes = [
  { path: "login", element: <LoginPage /> },
  { path: "signup", element: <SignupPage /> },
];
