import { axiosInstance } from "@/lib/axios";
import type {
  CreateTodoPayload,
  TodoItem,
  UpdateTodoPayload,
} from "../../types";

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

export const updateTodo = async (
  id: number,
  data: UpdateTodoPayload
): Promise<TodoItem> => {
  const response = await axiosInstance.put<TodoItem>(`/todos/${id}`, data);
  return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/todos/${id}`);
};
