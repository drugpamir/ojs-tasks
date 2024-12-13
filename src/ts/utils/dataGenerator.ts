// import { randomUUID } from "crypto";

import { Task } from "../api/calendarApi";

export function generateID(): string {
  return new Date().toString();
  //   return randomUUID();
}

export function generateTask(num: number): Omit<Task, "id" | "createdAt"> {
  return {
    name: `Task ${num}`,
    categories: [`Category ${num}`],
    date: new Date(2024, 12, 13, 1, 2, 3 + num),
  };
}
