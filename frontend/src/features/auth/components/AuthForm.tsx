import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useAuth } from "@/contexts/auth-context";
import { useLogin } from "../hooks/useLogin";
import { useRegister } from "../hooks/useRegister";

const loginSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }),
  password: z.string().min(1, "Password is required."),
});

const signupSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type AuthFormValues = z.infer<typeof signupSchema>;

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === "login";
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const { mutate: login, isPending: isLoggingIn } = useLogin();
  const { mutate: register, isPending: isRegistering } = useRegister();
  const isPending = isLoggingIn || isRegistering;

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: AuthFormValues) {
    if (isLogin) {
      login(data, {
        onSuccess: (response) => {
          setToken(response.token);
          navigate("/");
        },
        onError: (error) => {
          console.error("Login failed:", error);
          form.setError("root", {
            type: "server",
            message: "Invalid email or password.",
          });
        },
      });
    } else {
      register(data, {
        onSuccess: () => {
          navigate("/login");
          toast.success("Registration successful", {
            description: "Please log in with your new credentials.",
          });
        },
        onError: (error) => {
          let message = "Registration failed.";
          if (axios.isAxiosError(error) && error.response?.data?.message) {
            message = error.response.data.message;
          } else {
            console.error("An unexpected error occurred:", error);
          }
          form.setError("root", { type: "server", message });
        },
      });
    }
  }

  const formId = `${mode}-form`;

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      {form.formState.errors.root && (
        <div className="form-submission-error">
          {form.formState.errors.root.message}
        </div>
      )}

      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`${mode}-email-input`}>Email</FieldLabel>
              <Input
                {...field}
                id={`${mode}-email-input`}
                type="email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`${mode}-password-input`}>
                Password
              </FieldLabel>
              <Input
                {...field}
                id={`${mode}-password-input`}
                type="password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex flex-col">
        <Button
          type="submit"
          form={formId}
          className="btn-surface btn-lg"
          disabled={isPending}
        >
          {isLogin
            ? isPending
              ? "Logging in..."
              : "Login"
            : isPending
            ? "Creating Account..."
            : "Create Account"}
        </Button>
      </div>
    </form>
  );
}
