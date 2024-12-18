import { CalendarApi, type Task } from "./api/calendarApi";
import { calendarApiTypes } from "./api/calendarApiTypes";
import {
  toDatePickerString,
  toDatePickerStringDaysFromNow,
  toDatePickerStringNow,
} from "./utils/date";

const ID_TASKS_FILTER_CB_STORAGE_TYPE = "dd-calendar-api-type";
const ID_TASKS_FILTER_NAME_PATTERN = "tasks-filter-pattern";
const ID_TASKS_FILTER_DATE_FROM = "tasks-filter-date-from";
const ID_TASKS_FILTER_DATE_TO = "tasks-filter-date-to";
const ID_BTN_ADD_TASK = "btn-add-tasks";
const ID_TASKS_TABLE = "tasks-table";
const ID_FORM_CREATE_TASK = "form-create-task";

let calendarApi: CalendarApi;
let tasksTable: HTMLTableElement;
let dateFrom: Date | undefined;
let dateTo: Date | undefined;

export async function runApp(el: HTMLElement) {
  renderTaskListHTML(el);
  addListeners(el);
  fillTasksTable(dateFrom, dateTo);
}

function addListeners(el: HTMLElement) {
  const cbStorageType = el.querySelector(`#${ID_TASKS_FILTER_CB_STORAGE_TYPE}`);

  const tasksFilterPattern = el.querySelector(
    `#${ID_TASKS_FILTER_NAME_PATTERN}`,
  );

  const dtpDateFrom = el.querySelector(
    `#${ID_TASKS_FILTER_DATE_FROM}`,
  ) as HTMLInputElement;
  const dtpDateTo = el.querySelector(
    `#${ID_TASKS_FILTER_DATE_TO}`,
  ) as HTMLInputElement;

  const btnAddTask = el.querySelector(`#${ID_BTN_ADD_TASK}`);

  tasksTable = el.querySelector(`#${ID_TASKS_TABLE}`) as HTMLTableElement;

  cbStorageType?.addEventListener("change", (ev) =>
    setCalendarApi(
      el,
      calendarApiTypes[(ev.target as HTMLSelectElement).value],
    ),
  );
  cbStorageType?.dispatchEvent(new Event("change"));

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

  btnAddTask?.addEventListener("click", () => createTaskForm(el));

  tasksTable.addEventListener("click", (ev) => {
    const rowElement = (ev.target as HTMLElement).closest("tr");
    rowElement?.classList.toggle("tr-selected");
  });
}

function setCalendarApi(el: HTMLElement, newCalendarApi: CalendarApi) {
  calendarApi = newCalendarApi;
  fillTasksTable(dateFrom, dateTo);
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
      <td>${task.categories?.join(", ")}</td>
      <td>${new Date(task.date).toLocaleDateString()}</td>
      <td>${new Date(task.createdAt).toLocaleDateString()}</td>
      <!--td>${task.createdAt}</td-->
    </tr>
    `,
    )
    .join();
}

function createTaskForm(el: HTMLElement) {
  const formEl = el.querySelector(`#${ID_FORM_CREATE_TASK}`);
  if (!formEl) {
    return;
  }
  const ID_CREATING_TASK_NAME = "creating-task-name";
  const ID_CREATING_TASK_DESCRIPTION = "creating-task-description";
  const ID_CREATING_TASK_DUE_DATE = "creating-task-due-date";
  const ID_CREATING_TASK_SUBMIT = "creating-task-submit";

  formEl.classList.add("modal", "active");
  formEl.innerHTML = `
    <div class="modalContent">
      <input
        type="text"
        id="${ID_CREATING_TASK_NAME}"
        placeholder="Название задачи"
        pattern="[a-zA-Zа-яА-Я0-9]{3,50}"
        required
      />
      <input
        type="text"
        id="${ID_CREATING_TASK_DESCRIPTION}"
        placeholder="Категории"
        value=""
      />
      <input
        type="date"
        id="${ID_CREATING_TASK_DUE_DATE}"
        placeholder="Дата выполнения задачи"
        value="${toDatePickerStringDaysFromNow(1)}"
        required
      />
      <button type="submit" id="${ID_CREATING_TASK_SUBMIT}">
        Создать задачу
      </button>
    </div>`;
  console.log(formEl.outerHTML);

  //Скрытие формы в случае клика мимо неё
  formEl.addEventListener("click", () => {
    formEl.classList.remove("modal", "active");
    formEl.innerHTML = "";
  });
  //Форма остаётся видимой в случае клика на неё в область мимо её инпутов
  formEl
    .querySelector(".modalContent")
    ?.addEventListener("click", (ev) => ev.stopPropagation());

  const inputCreatingTaskName = formEl.querySelector(
    `#${ID_CREATING_TASK_NAME}`,
  ) as HTMLInputElement;
  const inputCreatingTaskDescription = formEl.querySelector(
    `#${ID_CREATING_TASK_DESCRIPTION}`,
  ) as HTMLInputElement;
  const inputCreatingTaskDueDate = formEl.querySelector(
    `#${ID_CREATING_TASK_DUE_DATE}`,
  ) as HTMLInputElement;
  // const btnFormCreateTask = formEl.querySelector(`[type="submit"]`);
  const btnFormCreateTask = formEl.querySelector(`#${ID_CREATING_TASK_SUBMIT}`);
  btnFormCreateTask?.addEventListener("click", async (ev) => {
    ev.preventDefault();
    if (!inputCreatingTaskName?.value) {
      window.alert("Укажите имя задачи");
      return;
    }
    formEl.classList.remove("modal", "active");
    formEl.innerHTML = "";
    const createdTask: Task = await calendarApi.createTask({
      name: inputCreatingTaskName?.value,
      categories: inputCreatingTaskDescription?.value.split(" "),
      date: new Date(inputCreatingTaskDueDate?.value),
    });
    console.log(createdTask);
    fillTasksTable(dateFrom, dateTo);
  });
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
      <form id=${ID_FORM_CREATE_TASK}>
      </form>
      <div>
          <select id=${ID_TASKS_FILTER_CB_STORAGE_TYPE}>
              <option value="CalendarDummyStorage" selected>Тестовые данные</option>
              <option value="CalendarLocalStorage">Локальное хранилище</option>
              <option value="CalendarFirebaseStorage">Внешнее хранилище</option>
          </select>
          <input type="text" id=${ID_TASKS_FILTER_NAME_PATTERN} placeholder="Название, описание">
          <input type="date" id=${ID_TASKS_FILTER_DATE_FROM} value=${toDatePickerStringNow()}>
          <input type="date" id=${ID_TASKS_FILTER_DATE_TO} value=${toDatePickerStringDaysFromNow(3)}>
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
