import { CalendarApi, type Task } from "./api/calendarApi";
import { CalendarDummyStorage } from "./api/calendarDummyStorage";
import { CalendarFireBaseStorage } from "./api/calendarFireBaseStorage";
import { CalendarLocalStorage } from "./api/calendarLocalStorage";
import {
  toDatePickerString,
  toDatePickerStringDaysFromNow,
  toDatePickerStringNow,
} from "./utils/date";

let calendarApi: CalendarApi;
let tasksTable: HTMLTableElement;
let dateFrom: Date | undefined;
let dateTo: Date | undefined;

type CalendarApiLibrary = {
  [key: string]: CalendarApi;
};
const calendarApiTypes: CalendarApiLibrary = {
  CalendarDummyStorage: new CalendarDummyStorage(),
  CalendarLocalStorage: new CalendarLocalStorage(),
  CalendarFireBaseStorage: new CalendarFireBaseStorage(),
};

export async function runApp(el: HTMLElement) {
  renderTaskListHTML(el);
  setCalendarApi(el, calendarApiTypes.CalendarDummyStorage);
  addListeners(el);
  fillTasksTable(dateFrom, dateTo);
}

const ID_CB_STORAGE_TYPE = "dd-calendar-api-type";
const ID_TASKS_FILTER_PATTERN = "tasks-filter-pattern";
const ID_DTP_DATE_FROM = "date-from";
const ID_DTP_DATE_TO = "date-to";
const ID_BTN_ADD_TASK = "btn-add-tasks";
const ID_TASKS_TABLE = "tasks-table";

function addListeners(el: HTMLElement) {
  const cbStorageType = document.getElementById(
    ID_CB_STORAGE_TYPE,
  ) as HTMLSelectElement;

  const tasksFilterPattern = document.getElementById(
    ID_TASKS_FILTER_PATTERN,
  ) as HTMLInputElement;

  const dtpDateFrom = document.getElementById(
    ID_DTP_DATE_FROM,
  ) as HTMLInputElement;
  const dtpDateTo = document.getElementById(ID_DTP_DATE_TO) as HTMLInputElement;

  const btnAddTask = document.getElementById(ID_BTN_ADD_TASK);

  tasksTable = document.getElementById(ID_TASKS_TABLE) as HTMLTableElement;

  cbStorageType.addEventListener("change", (ev) =>
    setCalendarApi(
      el,
      calendarApiTypes[(ev.target as HTMLSelectElement).value],
    ),
  );

  tasksFilterPattern?.addEventListener("change", () => {});

  dtpDateFrom?.addEventListener("change", () => {
    dateFrom = new Date(dtpDateFrom.value);
    dateTo = new Date(dtpDateTo.value);
    if (dateTo < dateFrom) {
      dtpDateTo.value = toDatePickerString(dateFrom);
    }
  });

  dtpDateTo?.addEventListener("change", () => {
    dateFrom = new Date(dtpDateFrom.value);
    dateTo = new Date(dtpDateTo.value);
    if (dateTo < dateFrom) {
      dtpDateFrom.value = toDatePickerString(dateTo);
    }
  });

  btnAddTask?.addEventListener("click", () => {});

  tasksTable.addEventListener("click", (ev) => {
    const rowElement = (ev.target as HTMLElement).closest("tr");
    rowElement?.classList.toggle("tr-selected");
  });
}

async function fillTasksTable(
  dateFrom?: Date,
  dateTo?: Date,
  // textPattern?: string,
) {
  const tasks: Task[] = await calendarApi.getTasksByDate(dateFrom, dateTo);

  let tasksTableBody = tasksTable.querySelector("tbody");
  if (!tasksTableBody) {
    tasksTableBody = document.createElement("tbody");
    tasksTable.appendChild(tasksTableBody);
  }
  tasksTableBody.innerHTML = tasks
    .map(
      (task) => `
    <tr>
      <td>${task.name}</td>
      <td>${task.categories.join(", ")}</td>
      <td>${new Date(task.date).toLocaleDateString()}</td>
      <td>${new Date(task.createdAt).toLocaleDateString()}</td>
      <!--td>${task.createdAt}</td-->
    </tr>
    `,
    )
    .join();
}

function setCalendarApi(el: HTMLElement, newCalendarApi: CalendarApi) {
  console.log("new calendarApi:", newCalendarApi);
  calendarApi = newCalendarApi;
  fillTasksTable(dateFrom, dateTo);
}

function renderTaskListHTML(el: HTMLElement) {
  el.innerHTML = `
  <!DOCTYPE html>
  <html lang="ru">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Список задач</title>
      <link rel="stylesheet" href="styles.css"> <!-- Подключаем файл стилей -->
  </head>
  <body>
      <h1>Список задач</h1>
      
      <div>
          <select id=${ID_CB_STORAGE_TYPE}>
              <option value="CalendarDummyStorage" selected>Тестовые данные</option>
              <option value="CalendarLocalStorage">Локальное хранилище</option>
              <option value="CalendarFirebaseStorage">Внешнее хранилище</option>
          </select>
          <input type="text" id=${ID_TASKS_FILTER_PATTERN} placeholder="Название, описание">
          <input type="date" id=${ID_DTP_DATE_FROM} value=${toDatePickerStringNow()}>
          <input type="date" id=${ID_DTP_DATE_TO} value=${toDatePickerStringDaysFromNow(3)}>
          <button id=${ID_BTN_ADD_TASK}>Добавить задачу</button>
      </div>

      <table id=${ID_TASKS_TABLE}>
          <thead>
              <tr>
                  <th>Название задачи</th>
                  <th>Категории</th>
                  <th>Дата выполнения</th>
                  <th>Дата создания</th>
              </tr>
          </thead>
          <tbody>              
          </tbody>
      </table>
  </body>
</html>
  `;
}
