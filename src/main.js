import "./style.css";
import posthog from "posthog-js";
import { addTask, deleteTask, getTasks } from "./todo.js";

posthog.init('phc_VvdnbtI3EOsDdHH4GXgbh6wNKY4hmCVTTyiN7OPDXoc', {
  api_host: 'https://us.i.posthog.com',
  session_recording: {
    maskAllInputs: true
  }
});

const form = document.querySelector("#todo-form");
const input = document.querySelector("#task-input");
const filterActions = document.querySelector("#filter-actions");
const list = document.querySelector("#todo-list");
const status = document.querySelector("#app-status");
const appStatus = import.meta.env.VITE_APP_STATUS ?? "Unknown";

status.textContent = `Mode: ${appStatus}`;

const renderUrgentFilterButton = () => {
  filterActions.replaceChildren();

  if (!posthog.isFeatureEnabled("show-urgent-filter")) {
    return;
  }

  const urgentFilterButton = document.createElement("button");
  urgentFilterButton.type = "button";
  urgentFilterButton.className = "filter-button";
  urgentFilterButton.textContent = "Urgent";

  filterActions.append(urgentFilterButton);
};

posthog.onFeatureFlags(() => {
  renderUrgentFilterButton();
});

renderUrgentFilterButton();

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
      const nextTasks = deleteTask(task.id);

      posthog.capture("task_deleted", {
        deleted_from: "todo_list",
        remaining_tasks: nextTasks.length,
        task_length: task.text.length
      });

      renderTasks(nextTasks);
    });

    item.append(text, removeButton);
    list.append(item);
  });
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskText = input.value.trim();
  const hadExistingTasks = getTasks().length > 0;
  const tasks = addTask(input.value);

  if (taskText) {
    posthog.capture("task_created", {
      had_existing_tasks: hadExistingTasks,
      source: "manual_input",
      task_length: taskText.length,
      total_tasks: tasks.length
    });
  }

  input.value = "";
  input.focus();
  renderTasks(tasks);
});

renderTasks(getTasks());
