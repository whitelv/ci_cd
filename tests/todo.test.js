import assert from "node:assert/strict";
import test, { after, beforeEach } from "node:test";
import { addTask, deleteTask, getTasks } from "../src/todo.js";

const originalLocalStorage = globalThis.localStorage;
const originalCrypto = globalThis.crypto;

const createLocalStorageMock = () => {
  const store = new Map();

  return {
    clear() {
      store.clear();
    },
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    }
  };
};

beforeEach(() => {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: createLocalStorageMock()
  });

  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: {
      randomUUID: () => "task-id-1"
    }
  });
});

after(() => {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: originalLocalStorage
  });

  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: originalCrypto
  });
});

test("addTask stores a trimmed task", () => {
  const tasks = addTask("  Buy milk  ");

  assert.equal(tasks.length, 1);
  assert.deepEqual(tasks[0], {
    id: "task-id-1",
    text: "Buy milk"
  });
  assert.deepEqual(getTasks(), tasks);
});

test("deleteTask removes the requested task", () => {
  addTask("Buy milk");

  const tasks = deleteTask("task-id-1");

  assert.deepEqual(tasks, []);
  assert.deepEqual(getTasks(), []);
});

test("addTask ignores empty values", () => {
  const tasks = addTask("   ");

  assert.deepEqual(tasks, []);
  assert.deepEqual(getTasks(), []);
});
