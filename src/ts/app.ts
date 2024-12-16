export function runApp(el: HTMLElement) {
  renderTaskList(el);
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
          <input type="text" id="taskName" placeholder="Название задачи">
          <input type="date" id="dueDate">
          <button id=filter-tasks">Фильтровать</button>
          <button id=add-task>Добавить задачу</button>
      </div>

      <table id="tasksTable">
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

      <div class="pagination">
          <button id=btn-prev-page">Назад</button>
          <span id="pageInfo">Страница 1 из 1</span>
          <button id=btn-next-page">Вперед</button>
      </div>

      <!-- Подключаем JavaScript файл <script src="script.js"></script> -->
  </body>
</html>
  `;
}
