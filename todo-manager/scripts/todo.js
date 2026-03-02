#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");

const DATA_FILE = path.join(os.homedir(), ".claude", "custom", "todo-data.json");

function loadTodos() {
  if (!fs.existsSync(DATA_FILE)) {
    return { todos: [], nextId: 1 };
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function saveTodos(data) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function add(title) {
  if (!title) {
    console.error("Error: title is required");
    process.exit(1);
  }
  const data = loadTodos();
  const todo = {
    id: data.nextId,
    title,
    done: false,
    createdAt: new Date().toISOString(),
  };
  data.todos.push(todo);
  data.nextId = (data.nextId || 1) + 1;
  saveTodos(data);
  console.log(JSON.stringify(todo));
}

function list() {
  const data = loadTodos();
  console.log(JSON.stringify(data.todos));
}

function done(idStr) {
  const id = parseInt(idStr, 10);
  if (isNaN(id)) {
    console.error("Error: valid todo ID is required");
    process.exit(1);
  }
  const data = loadTodos();
  const todo = data.todos.find((t) => t.id === id);
  if (!todo) {
    console.error(`Error: todo #${id} not found`);
    process.exit(1);
  }
  todo.done = true;
  todo.doneAt = new Date().toISOString();
  saveTodos(data);
  console.log(JSON.stringify(todo));
}

function generateHtml() {
  const data = loadTodos();
  const todos = data.todos || [];

  const pending = todos.filter((t) => !t.done);
  const completed = todos.filter((t) => t.done);

  const formatDuration = (start, end) => {
    const ms = new Date(end) - new Date(start);
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days >= 1) {
      const rh = hours % 24;
      return rh > 0 ? `${days}d ${rh}h` : `${days}d`;
    }
    if (hours >= 1) {
      const rm = minutes % 60;
      return rm > 0 ? `${hours}h ${rm}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  const renderItem = (t) => {
    const status = t.done ? "completed" : "pending";
    const checkbox = t.done ? "checked" : "";
    let dateInfo;
    if (t.done && t.doneAt) {
      const doneStr = new Date(t.doneAt).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
      const duration = formatDuration(t.createdAt, t.doneAt);
      dateInfo = `完成于 ${doneStr}, 用时 ${duration}`;
    } else {
      dateInfo = new Date(t.createdAt).toLocaleDateString("zh-CN");
    }
    return `<li class="todo-item ${status}">
      <input type="checkbox" ${checkbox} disabled />
      <span class="title">${escapeHtml(t.title)}</span>
      <span class="date">${dateInfo}</span>
    </li>`;
  };

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My TODOs</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #f5f5f5;
      color: #333;
      padding: 2rem;
      max-width: 700px;
      margin: 0 auto;
    }
    h1 {
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
      color: #1a1a1a;
    }
    .stats {
      color: #888;
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }
    h2 {
      font-size: 1.1rem;
      color: #555;
      margin: 1.5rem 0 0.8rem;
      padding-bottom: 0.3rem;
      border-bottom: 1px solid #ddd;
    }
    ul { list-style: none; }
    .todo-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: #fff;
      border-radius: 8px;
      margin-bottom: 0.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .todo-item.completed .title {
      text-decoration: line-through;
      color: #aaa;
    }
    .todo-item input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #4caf50;
    }
    .title { flex: 1; font-size: 1rem; }
    .date { font-size: 0.8rem; color: #aaa; white-space: nowrap; }
    .empty { color: #aaa; text-align: center; padding: 2rem; }
    .footer {
      text-align: center;
      color: #ccc;
      font-size: 0.75rem;
      margin-top: 3rem;
    }
  </style>
</head>
<body>
  <h1>My TODOs</h1>
  <p class="stats">${pending.length} 待完成 / ${completed.length} 已完成 / ${todos.length} 总计</p>

  ${pending.length > 0 ? `<h2>待完成</h2><ul>${pending.map(renderItem).join("\n")}</ul>` : ""}
  ${completed.length > 0 ? `<h2>已完成</h2><ul>${completed.map(renderItem).join("\n")}</ul>` : ""}
  ${todos.length === 0 ? '<p class="empty">暂无待办事项</p>' : ""}

  <p class="footer">Generated at ${new Date().toLocaleString("zh-CN")}</p>
</body>
</html>`;

  const htmlFile = path.join(os.homedir(), ".claude", "custom", "todo.html");
  fs.writeFileSync(htmlFile, html, "utf-8");
  console.log(htmlFile);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const [, , command, ...args] = process.argv;

switch (command) {
  case "add":
    add(args.join(" "));
    break;
  case "list":
    list();
    break;
  case "done":
    done(args[0]);
    break;
  case "html":
    generateHtml();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    console.error("Usage: todo.js <add|list|done|html> [args]");
    process.exit(1);
}
