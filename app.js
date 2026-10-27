
let tasks = [];
let currentFilter = "all";

const form = document.getElementById("form");
const input = document.getElementById("text");
const list = document.getElementById("list");
const count = document.getElementById("count");
const clearButton = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll("[data-filter]");

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem("tasks"));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function render() {
  list.innerHTML = "";

  const visibleTasks = tasks.filter((task) => {
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "done") return task.done;
    return true;
  });

  visibleTasks.forEach((task) => {
    const li = document.createElement("li");
    li.dataset.id = task.id;
    li.className = task.done ? "done" : "";

    const label = document.createElement("span");
    label.textContent = task.text;

    const toggleButton = document.createElement("button");
    toggleButton.textContent = task.done ? "Undo" : "Done";
    toggleButton.dataset.action = "toggle";
    toggleButton.type = "button";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.dataset.action = "delete";
    deleteButton.type = "button";

    li.append(label, toggleButton, deleteButton);
    list.append(li);
  });

  const remaining = tasks.filter((task) => !task.done).length;
  count.textContent = `${remaining} tasks left`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text: text,
    done: false
  });

  input.value = "";
  save();
  render();
});

list.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const li = button.closest("li");
  const id = Number(li.dataset.id);

  if (button.dataset.action === "delete") {
    tasks = tasks.filter((task) => task.id !== id);
  }

  if (button.dataset.action === "toggle") {
    tasks.forEach((task) => {
      if (task.id === id) task.done = !task.done;
    });
  }

  save();
  render();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    render();
  });
});

clearButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.done);
  save();
  render();
});

tasks = load();
render();
