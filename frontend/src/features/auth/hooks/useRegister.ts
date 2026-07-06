import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/auth-service";
import type { AuthRequest } from "../types";

export function useRegister() {
  return useMutation({
    mutationFn: (data: AuthRequest) => registerUser(data),
  });
}
