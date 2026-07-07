import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteTodoModal } from "./DeleteTodoModal";
import { useDeleteTodo } from "../hooks/useDeleteTodo";

vi.mock("../hooks/useDeleteTodo");
const mockedUseDeleteTodo = vi.mocked(useDeleteTodo);

describe("DeleteTodoModal Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls the delete mutation with the correct ID when confirmed", async () => {
    // Arrange
    const mockMutate = vi.fn();
    const mockOnOpenChange = vi.fn();

    mockedUseDeleteTodo.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteTodo>);

    const user = userEvent.setup();

    render(
      <DeleteTodoModal
        open={true}
        onOpenChange={mockOnOpenChange}
        todoId={123}
        todoTitle="Write tests"
      />
    );

    // Act
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteButton);

    // Assert
    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(mockMutate).toHaveBeenCalledWith(123, expect.any(Object));
  });

  it("calls onOpenChange with false when the cancel button is clicked", async () => {
    // Arrange
    const mockOnOpenChange = vi.fn();

    mockedUseDeleteTodo.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteTodo>);

    const user = userEvent.setup();

    render(
      <DeleteTodoModal
        open={true}
        onOpenChange={mockOnOpenChange}
        todoId={123}
        todoTitle="Write tests"
      />
    );

    // Act
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    // Assert
    expect(mockOnOpenChange).toHaveBeenCalledTimes(1);
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});
