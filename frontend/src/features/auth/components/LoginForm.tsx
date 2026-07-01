import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useAuth } from "@/providers/auth-provider";
import { loginUser } from "../services/auth-service";

const loginSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      const response = await loginUser(data);
      setToken(response.token);
      navigate("/");
    } catch (error) {
      console.error(error);
      form.setError("root", { message: "Invalid email or password." });
    }
  }

  return (
    <form
      id="login-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      {form.formState.errors.root && (
        <p className="text-red-500">{form.formState.errors.root.message}</p>
      )}

      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email-input">Email</FieldLabel>
              <Input
                {...field}
                id="email-input"
                type="email"
                placeholder="name@example.com"
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
              <FieldLabel htmlFor="password-input">Password</FieldLabel>
              <Input
                {...field}
                id="password-input"
                type="password"
                placeholder="••••••••"
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
          form="login-form"
          className="btn-surface btn-lg"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </div>
    </form>
  );
}
