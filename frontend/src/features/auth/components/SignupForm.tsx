import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerUser } from "../services/auth-service";
import { toast } from "sonner";
import axios from "axios";

const signupSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const navigate = useNavigate();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: SignupFormValues) {
    try {
      // TODO: don't necessarily need the token back if you're redirecting to login,
      // but the backend will return it.
      await registerUser(data);

      navigate("/login");
      toast.success("Registration successful.", {
        description: "Please log in with your new credentials.",
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        console.error("Server says:", error.response.data.message);

        form.setError("root", {
          type: "server",
          message: error.response.data.message,
        });
      } else {
        console.error("An unexpected error occurred:", error);

        form.setError("root", {
          type: "server",
          message: "Registration failed.",
        });
      }
    }
  }
  return (
    <form
      id="signup-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      {form.formState.errors.root && (
        <div className="bg-red/20 text-red text-sm py-1 px-2 rounded-lg w-fit">
          {form.formState.errors.root.message}
        </div>
      )}
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
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
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                {...field}
                id="password"
                type="password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex flex-col">
        <Button type="submit" form="signup-form" className="btn-surface btn-lg">
          Create Account
        </Button>
      </div>
    </form>
  );
}
