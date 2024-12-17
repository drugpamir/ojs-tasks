import { generateID } from "../utils/dataGenerator";
import { CalendarApi, Task } from "./calendarApi";

export class CalendarDummyStorage implements CalendarApi {
  #tasks: Task[] = [];

  async getTasks(): Promise<Task[]> {
    return [
      {
        id: "1",
        name: "Сходить в магазин",
        categories: ["Покупки", "Прогулка"],
        date: new Date(2024, 12, 15),
        createdAt: new Date(2024, 12, 14),
      },
      {
        id: "3",
        name: "Помыть посуду",
        categories: ["Домашнее"],
        date: new Date(2024, 12, 14),
        createdAt: new Date(2024, 12, 13),
      },
      {
        id: "10",
        name: "Заплатить за квартиру",
        categories: ["Покупки", "Домашнее"],
        date: new Date(2024, 12, 15),
        createdAt: new Date(2024, 12, 15),
      },
      {
        id: "11",
        name: "Помочь тёще",
        categories: ["Семья", "Поездка"],
        date: new Date(2024, 12, 15),
        createdAt: new Date(2024, 12, 16),
      },
      {
        id: "13",
        name: "Покормить кота",
        categories: ["Семья", "Домашнее"],
        date: new Date(2024, 12, 12),
        createdAt: new Date(2024, 12, 14),
      },
    ];
  }

  async getTasksByDate(dateFrom: Date, dateTo: Date): Promise<Task[]> {
    const storedTasks: Task[] = await this.getTasks();
    return storedTasks.filter(
      (task) =>
        (!dateFrom || task.date >= dateFrom) &&
        (!dateTo || task.date <= dateTo),
    );
  }

  async createTask(
    newTaskFields: Omit<Task, "id" | "createdAt">,
  ): Promise<Task> {
    const id = generateID();
    const newTask: Task = {
      ...newTaskFields,
      id: id,
      createdAt: new Date(),
    };
    this.#tasks.push(newTask);
    return newTask;
  }

  async removeTask(taskToRemove: Task): Promise<Task[]> {
    return this.#tasks.filter((task) => task.id !== taskToRemove.id);
  }

  async updateTask(updatedTaskFields: Partial<Task>): Promise<Task> {
    let updatedTask: Task | undefined = undefined;
    this.#tasks.map((task) => {
      if (task.id !== updatedTaskFields.id) {
        return task;
      }
      updatedTask = {
        ...task,
        ...updatedTaskFields,
      };
      return updatedTask;
    });

    if (!updatedTask) {
      throw new Error(
        `Task with ID=${updatedTaskFields.id} not found at storage`,
      );
    }

    return updatedTask;
  }
}
