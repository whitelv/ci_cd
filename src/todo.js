const STORAGE_KEY = "unidone.tasks";

const readTasks = () => {
  const storedTasks = localStorage.getItem(STORAGE_KEY);

  if (!storedTasks) {
    return [];
  }

  try {
    const parsedTasks = JSON.parse(storedTasks);
    return Array.isArray(parsedTasks) ? parsedTasks : [];
  } catch {
    return [];
  }
};

const writeTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const getTasks = () => readTasks();

export const addTask = (taskText) => {
  const trimmedTask = taskText.trim();

  if (!trimmedTask) {
    return getTasks();
  }

  const tasks = getTasks();
  const nextTasks = [
    ...tasks,
    {
      id: crypto.randomUUID(),
      text: trimmedTask
    }
  ];

  writeTasks(nextTasks);
  return nextTasks;
};

export const deleteTask = (taskId) => {
  const nextTasks = getTasks().filter((task) => task.id !== taskId);
  writeTasks(nextTasks);
  return nextTasks;
};
