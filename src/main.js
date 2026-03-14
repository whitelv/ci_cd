import "./style.css";
import { addTask, deleteTask, getTasks } from "./todo.js";

const form = document.querySelector("#todo-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#todo-list");
const status = document.querySelector("#app-status");
const appStatus = import.meta.env.VITE_APP_STATUS ?? "Unknown";

status.textContent = `Mode: ${appStatus}`;

const renderTasks = (tasks) => {
  list.replaceChildren();

  if (tasks.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.textContent = "No tasks yet. Add one to get started.";
    list.append(emptyState);
    return;
  }

  tasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = "todo-item";

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = task.text;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "delete-button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      renderTasks(deleteTask(task.id));
    });

    item.append(text, removeButton);
    list.append(item);
  });
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const tasks = addTask(input.value);
  input.value = "";
  input.focus();
  renderTasks(tasks);
});

renderTasks(getTasks());
