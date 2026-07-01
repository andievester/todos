import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Check, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/components/lib/utils";

const todoSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  isCompleted: z.boolean(),
  dueDate: z.string().optional(),
  priority: z.string().min(1, "Please select a priority level."),
});

export type TodoFormValues = z.infer<typeof todoSchema>;

interface TodoFormProps {
  initialData?: TodoFormValues | null;
  onCancel?: () => void;
}

export function TodoForm({ initialData, onCancel }: TodoFormProps) {
  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      isCompleted: false,
      dueDate: "",
      priority: "medium",
    },
  });

  function onSubmit(data: TodoFormValues) {
    console.log("Todo payload:", data);
  }

  return (
    <form
      id="todo-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title-input">Title</FieldLabel>
              <Input
                {...field}
                id="title-input"
                type="text"
                placeholder="What needs to be done?"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description-input">Description</FieldLabel>
              <Textarea
                {...field}
                id="description-input"
                placeholder="Add any extra details here..."
                aria-invalid={fieldState.invalid}
                className="min-h-[100px]"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="dueDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex flex-col gap-2"
            >
              <FieldLabel htmlFor="due-date-input">Due Date</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="due-date-input"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground",
                      fieldState.invalid &&
                        "border-destructive text-destructive focus-visible:ring-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="priority"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="priority-select">Priority</FieldLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger
                  id="priority-select"
                  aria-invalid={fieldState.invalid}
                  className={cn(
                    field.value === "low" && "text-green",
                    field.value === "medium" && "text-yellow",
                    field.value === "high" && "text-red"
                  )}
                >
                  <SelectValue placeholder="Select a priority" />
                </SelectTrigger>

                <SelectContent position="popper">
                  <SelectItem value="low" className="text-green cursor-pointer">
                    Low
                  </SelectItem>
                  <SelectItem
                    value="medium"
                    className="text-yellow cursor-pointer"
                  >
                    Medium
                  </SelectItem>
                  <SelectItem value="high" className="text-red cursor-pointer">
                    High
                  </SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="isCompleted"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex flex-row items-center space-x-2">
                <Checkbox
                  id="is-completed-input"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
                <FieldLabel
                  htmlFor="is-completed-input"
                  className="font-normal cursor-pointer"
                >
                  Mark as completed
                </FieldLabel>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex items-center gap-3 pt-4">
        <Button onClick={onCancel} className="btn-surface btn-lg">
          <X className="text-red" strokeWidth={3} />
          <span>Cancel</span>
        </Button>
        <Button type="submit" form="todo-form" className="btn-surface btn-lg">
          <Check className="text-green" strokeWidth={3}></Check>
          <span>Save Todo</span>
        </Button>
      </div>
    </form>
  );
}
