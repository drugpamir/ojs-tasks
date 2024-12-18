import { CalendarApi, Task } from "./calendarApi";

export class CalendarFireBaseStorage implements CalendarApi {
  createTask(newTaskFields: Omit<Task, "id" | "createdAt">): Promise<Task> {
    throw new Error("Method not implemented. " + newTaskFields);
  }
  updateTask(updatedTaskFields: Partial<Task>): Promise<Task> {
    throw new Error("Method not implemented. " + updatedTaskFields);
  }
  removeTask(taskToRemove: Task): Promise<Task[]> {
    throw new Error("Method not implemented. " + taskToRemove);
  }
  getTasks(): Promise<Task[]> {
    throw new Error("Method not implemented. ");
  }
  getTasksByDate(dateFrom?: Date, dateTo?: Date): Promise<Task[]> {
    throw new Error(`Method not implemented. ${dateFrom}-${dateTo}`);
  }
}
