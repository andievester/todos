import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import type { AuthRequest, AuthResponse } from "../types";
import { tokenService } from "@/services/token-service";

export const loginUser = async (data: AuthRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const registerUser = async (
  data: AuthRequest
): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    "/auth/register",
    data
  );
  return response.data;
};

export const refreshSession = async (): Promise<string> => {
  const refreshToken = tokenService.getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await axiosInstance.post<{
    token: string;
    refreshToken: string;
  }>("/auth/refresh", { refreshToken });

  tokenService.setTokens(response.data.token, response.data.refreshToken);
  return response.data.token;
};

export const handleSessionExpired = (): void => {
  tokenService.clearTokens();

  toast.error("Session expired", {
    description: "Please log in again to continue.",
  });

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};
