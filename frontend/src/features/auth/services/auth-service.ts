import { axiosInstance } from "@/lib/axios";
import type { AuthRequest, AuthResponse } from "../types";

export const loginUser = async (data: AuthRequest) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

export const registerUser = async (
  data: AuthRequest
): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};
