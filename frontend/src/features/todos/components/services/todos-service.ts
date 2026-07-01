import { axiosInstance } from "@/lib/axios";
import type { CreateTodoPayload, TodoItem } from "../../types";

export const getTodos = async (): Promise<TodoItem[]> => {
  const response = await axiosInstance.get<TodoItem[]>("/todos");
  return response.data;
};

export const createTodo = async (
  data: CreateTodoPayload
): Promise<TodoItem> => {
  const response = await axiosInstance.post<TodoItem>("/todos", data);
  return response.data;
};
