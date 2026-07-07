import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TodosPage } from "./TodosPage";
import { useTodos } from "../hooks/useTodos";
import type { TodoItem } from "../types";

vi.mock("../hooks/useTodos");
const mockedUseTodos = vi.mocked(useTodos);

vi.mock("../components/TodosHeader", () => ({
  TodosHeader: () => <div data-testid="todos-header" />,
}));
vi.mock("../components/TodoModal", () => ({
  TodoModal: () => <div data-testid="todo-modal" />,
}));
vi.mock("../components/DeleteTodoModal", () => ({
  DeleteTodoModal: () => null,
}));

describe("TodosPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the loading state inside the table initially", () => {
    // Arrange
    mockedUseTodos.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as ReturnType<typeof useTodos>);

    // Act
    render(<TodosPage />);

    // Assert
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("filters out completed todos by default and shows them when the checkbox is clicked", async () => {
    // Arrange
    const mockTodos: TodoItem[] = [
      {
        id: 1,
        title: "Active Task",
        description: "",
        isCompleted: false,
        priority: 1,
        dueDate: new Date().toISOString(),
        userId: "test-user-1",
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Finished Task",
        description: "",
        isCompleted: true,
        priority: 2,
        dueDate: new Date().toISOString(),
        userId: "test-user-1",
        createdAt: new Date().toISOString(),
      },
    ];
    mockedUseTodos.mockReturnValue({
      data: mockTodos,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useTodos>);

    const user = userEvent.setup();

    // Act
    render(<TodosPage />);

    // Assert
    expect(screen.getByText("Active Task")).toBeInTheDocument();
    expect(screen.queryByText("Finished Task")).not.toBeInTheDocument();

    // Act
    const showCompletedToggle = screen.getByLabelText("Show completed");
    await user.click(showCompletedToggle);

    // Assert
    expect(screen.getByText("Active Task")).toBeInTheDocument();
    expect(screen.getByText("Finished Task")).toBeInTheDocument();
  });
});
