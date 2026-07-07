import { useMutation } from "@tanstack/react-query";
import { register } from "../services/auth-service";
import type { AuthRequest } from "../types";

export function useRegister() {
  return useMutation({
    mutationFn: (data: AuthRequest) => register(data),
  });
}
