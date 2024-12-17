import {
  toDatePickerString,
  toDatePickerStringDaysFromNow,
  toDatePickerStringNow,
} from "./utils/date";

export function runApp(el: HTMLElement) {
  renderTaskList(el);
  addListeners();
}

const ID_TASKS_FILTER_PATTERN = "tasks-filter-pattern";
const ID_DTP_DATE_FROM = "date-from";
const ID_DTP_DATE_TO = "date-to";
const ID_BTN_ADD_TASK = "btn-add-tasks";
const ID_TASKS_TABLE = "tasks-table";

function addListeners(/*el: HTMLElement*/) {
  const tasksFilterPattern = document.getElementById(
    ID_TASKS_FILTER_PATTERN,
  ) as HTMLInputElement;
  const dtpDateFrom = document.getElementById(
    ID_DTP_DATE_FROM,
  ) as HTMLInputElement;
  const dtpDateTo = document.getElementById(ID_DTP_DATE_TO) as HTMLInputElement;
  const btnAddTask = document.getElementById(ID_BTN_ADD_TASK);
  const tasksTable = document.getElementById(ID_TASKS_TABLE);

  tasksFilterPattern?.addEventListener("change", () => {});

  dtpDateFrom?.addEventListener("change", () => {
    const dateFrom: Date = new Date(dtpDateFrom.value);
    const dateTo: Date = new Date(dtpDateTo.value);
    if (dateTo < dateFrom) {
      dtpDateTo.value = toDatePickerString(dateFrom);
    }
  });

  dtpDateTo?.addEventListener("change", () => {
    const dateFrom: Date = new Date(dtpDateFrom.value);
    const dateTo: Date = new Date(dtpDateTo.value);
    if (dateTo < dateFrom) {
      dtpDateFrom.value = toDatePickerString(dateTo);
    }
  });

  btnAddTask?.addEventListener("click", () => {});

  tasksTable?.addEventListener("click", () => {});
}

function renderTaskList(el: HTMLElement) {
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
          <input type="text" id=${ID_TASKS_FILTER_PATTERN} placeholder="Название, описание">
          <input type="date" id=${ID_DTP_DATE_FROM} value=${toDatePickerStringNow()}>
          <input type="date" id=${ID_DTP_DATE_TO} value=${toDatePickerStringDaysFromNow(3)}>
          <button id=${ID_BTN_ADD_TASK}>Добавить задачу</button>
      </div>

      <table id=${ID_TASKS_TABLE}>
          <thead>
              <tr>
                  <th>Название задачи</th>
                  <th>Дата выполнения</th>
                  <th>Действия</th>
              </tr>
          </thead>
          <tbody>
              <!-- Здесь будут данные задач -->
          </tbody>
      </table>
  </body>
</html>
  `;
}
