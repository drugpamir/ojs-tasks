import { generateTask } from "../utils/dataGenerator";
import { Task } from "./calendarApi";
import { CalendarLocalStorage } from "./calendarLocalStorage";

describe("tasks local storage", () => {
  let calendarLocalStorage: CalendarLocalStorage;

  beforeEach(async () => {
    calendarLocalStorage = new CalendarLocalStorage();
  });

  it("getTasks() returns empty task array if tasks not added before", async () => {
    const tasks: Task[] = await calendarLocalStorage.getTasks();
    expect(tasks.length).toBe(0);
  });

  it("getTasks() returns expected tasks count after them added", async () => {
    // const tasksPromises: Promise<Task>[] = [1, 2, 4, 6, 5, 12]
    //   .map((num) => generateTask(num))
    //   .map((task) => calendarLocalStorage.createTask(task));
    // const tasksToCreate = await Promise.all(tasksPromises);

    const tasksToCreate = [
      await calendarLocalStorage.createTask(generateTask(2)),
      await calendarLocalStorage.createTask(generateTask(4)),
      await calendarLocalStorage.createTask(generateTask(7)),
      await calendarLocalStorage.createTask(generateTask(32)),
      await calendarLocalStorage.createTask(generateTask(3)),
      await calendarLocalStorage.createTask(generateTask(4)),
    ];

    const storedTasks = await calendarLocalStorage.getTasks();
    console.log(storedTasks);
    expect(storedTasks.length).toBe(tasksToCreate.length);
  });

  it("createTask() returns added task with same fields and generated id", async () => {
    const newTask = generateTask(1);
    const storedTask: Task = await calendarLocalStorage.createTask(newTask);
    expect(storedTask.id).not.toBeUndefined();
    expect(storedTask.createdAt).not.toBeUndefined();
    expect(newTask.name).toBe(storedTask.name);
    expect(newTask.categories).toBe(storedTask.categories);
    expect(newTask.date).toBe(storedTask.date);
  });
});
