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

import { loginUser, registerUser } from "../services/auth-service";
import { useAuth } from "@/contexts/auth-context";

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

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: AuthFormValues) {
    try {
      if (isLogin) {
        const response = await loginUser(data);
        setToken(response.token);
        navigate("/");
      } else {
        await registerUser(data);
        navigate("/login");
        toast.success("Registration successful", {
          description: "Please log in with your new credentials.",
        });
      }
    } catch (error) {
      if (
        !isLogin &&
        axios.isAxiosError(error) &&
        error.response?.data?.message
      ) {
        console.error(error.response.data.message);
        form.setError("root", {
          type: "server",
          message: error.response.data.message,
        });
      } else {
        console.error("An unexpected error occurred:", error);
        form.setError("root", {
          type: "server",
          message: isLogin
            ? "Invalid email or password."
            : "Registration failed.",
        });
      }
    }
  }

  const formId = `${mode}-form`;
  const isSubmitting = form.formState.isSubmitting;

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
          disabled={isSubmitting}
        >
          {isLogin
            ? isSubmitting
              ? "Logging in..."
              : "Login"
            : isSubmitting
            ? "Creating Account..."
            : "Create Account"}
        </Button>
      </div>
    </form>
  );
}
