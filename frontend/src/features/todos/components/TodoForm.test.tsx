import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useSaveTodo } from "../hooks/useSaveTodo";
import { TodoForm } from "./TodoForm";

vi.mock("../hooks/useSaveTodo");
const mockedUseSaveTodo = vi.mocked(useSaveTodo);

describe("TodoForm Component", () => {
  it("submits the form and calls the mutation function with correct data", async () => {
    // Arrange
    const mockMutate = vi.fn();

    mockedUseSaveTodo.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useSaveTodo>);

    const user = userEvent.setup();
    render(<TodoForm />);

    // Act
    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    const submitButton = screen.getByRole("button", { name: /save todo/i });

    await user.type(titleInput, "Ship the assessment");
    await user.click(submitButton);

    // Assert
    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(mockMutate).toHaveBeenCalledWith(
      {
        id: undefined,
        data: {
          title: "Ship the assessment",
          description: "",
          isCompleted: false,
          priority: undefined,
          dueDate: undefined,
        },
      },
      expect.any(Object)
    );
  });
});
