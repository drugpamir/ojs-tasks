export type Task = {
  id: string;
  name: string;
  categories: string[];
  createdAt: Date;
  date: Date;
};

export interface CalendarApi {
  createTask(addedTasks: Omit<Task, "id" | "createdAt">): Promise<Task>;

  updateTask(updatedTask: Partial<Task>): Promise<Task>;

  removeTask(taskToRemove: Task): Promise<Task[]>;

  getTasks(): Promise<Task[]>;

  getTasksByDate(dateFrom: Date, dateTo: Date): Promise<Task[]>;
}
