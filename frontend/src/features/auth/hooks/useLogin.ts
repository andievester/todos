import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth-service";
import type { AuthRequest } from "../types";

export function useLogin() {
  return useMutation({
    mutationFn: (data: AuthRequest) => login(data),
  });
}
