import { CalendarApi, Task } from "./calendarApi";
import { generateID } from "../utils/dataGenerator";

export class CalendarLocalStorage implements CalendarApi {
  #tasksStorageKey: string = "tasks";

  async createTask(newTaskFields: Omit<Task, "id">): Promise<Task> {
    const id = generateID();
    const newTask: Task = {
      ...newTaskFields,
      id: id,
    };

    const storedTasks: Task[] = await this.getTasks();
    const newTasks: Task[] = [...storedTasks, newTask];
    localStorage.setItem(this.#tasksStorageKey, JSON.stringify(newTasks));
    return newTask;
  }

  async updateTask(updatedTaskFields: Partial<Task>): Promise<Task> {
    if (!updatedTaskFields.id) {
      throw new Error(`ID field does not found for task: ${updatedTaskFields}`);
    }

    const storedTasks: Task[] = await this.getTasks();
    if (!storedTasks) {
      throw new Error(`There is no tasks at storage`);
    }

    let updatedTask: Task | undefined = undefined;
    const updatedTasks = storedTasks.map((task) => {
      if (task.id === updatedTaskFields.id) {
        return task;
      }
      updatedTask = {
        ...task,
        ...updatedTaskFields,
      };
      return updatedTask;
    });

    if (updatedTask) {
      localStorage.setItem(this.#tasksStorageKey, JSON.stringify(updatedTasks));
      return updatedTask;
    } else {
      throw new Error(
        `Task with ID=${updatedTaskFields.id} not found at storage`,
      );
    }
  }

  async removeTask(taskToRemove: Task): Promise<Task[]> {
    const storedTasks: Task[] = await this.getTasks();
    if (!storedTasks) {
      return [];
    }

    const newTasks = storedTasks.filter((task) => task.id !== taskToRemove.id);
    localStorage.setItem(this.#tasksStorageKey, JSON.stringify(newTasks));
    return this.getTasks();
  }

  async getTasks(): Promise<Task[]> {
    const storedTasks = localStorage.getItem(this.#tasksStorageKey);
    if (!storedTasks) {
      return [];
    }
    const tasks: Task[] = JSON.parse(storedTasks);
    return tasks;
  }

  async getTasksByDate(dateFrom: Date, dateTo: Date): Promise<Task[]> {
    const storedTasks: Task[] = await this.getTasks();
    return storedTasks.filter(
      (task) => task.date >= dateFrom && task.date <= dateTo,
    );
  }
}
