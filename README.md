# Taskly — Todo Application

A full-stack Todo application built with **React** (multi-page frontend) and **Node.js + Express** (REST API backend), with JSON file-based persistence.

---

## Features

### Todo List Page (`/`)
- **Create tasks** — title, description, priority (low/medium/high), due date, tags
- **Complete/uncomplete** tasks with a single click
- **Delete** tasks (with confirmation)
- **Filter** by All / Active / Completed
- **Search** by title, description, or tag
- **Sort** by newest, oldest, priority, or due date
- Live stats bar showing active/done/total counts

### Todo Detail Page (`/todo?id=<id>`)
- Full task details: title, description, priority, due date, tags, created & updated timestamps, unique task ID
- **Inline editing** — edit any field in-place and save
- **Toggle complete** directly on the detail page
- **Delete** from detail view
- Overdue date highlighting

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6 |
| Backend | Node.js, Express 4 |
| Storage | JSON file (`todos.json`) |
| Styling | Pure CSS with CSS variables |
| IDs | UUID v4 |

---

## Project Structure

```
todo-app/
├── backend/
│   ├── server.js        # Express server + CRUD routes
│   ├── todos.json       # Data file (auto-created)
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js              # Router setup
│   │   ├── api.js              # API helper functions
│   │   ├── index.js
│   │   ├── index.css           # Global styles / design tokens
│   │   └── pages/
│   │       ├── TodosPage.js        # Page 1: list view
│   │       ├── TodosPage.css
│   │       ├── TodoDetailPage.js   # Page 2: single todo
│   │       └── TodoDetailPage.css
│   └── package.json
└── README.md
```

---

## API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/todos` | Get all todos |
| `GET` | `/todos/:id` | Get single todo by ID |
| `POST` | `/todos` | Create a new todo |
| `PUT` | `/todos/:id` | Update a todo |
| `DELETE` | `/todos/:id` | Delete a todo |

### Todo Object Schema

```json
{
  "id": "uuid-v4",
  "title": "string (required)",
  "description": "string",
  "priority": "low | medium | high",
  "dueDate": "YYYY-MM-DD | null",
  "tags": ["string"],
  "completed": false,
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

### POST /api/todos — Request body
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "medium",
  "dueDate": "2025-12-31",
  "tags": ["personal", "errands"]
}
```

---

## Getting Started

### Prerequisites
- Node.js v16+
- npm

### 1. Start the backend

```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5001
```

### 2. Start the frontend

```bash
cd frontend
npm install
npm start
# App opens at http://localhost:3000
```

### Environment Variables (optional)

In `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Multi-Page Architecture

The app uses **React Router v6** with two distinct pages:

- **`/`** — `TodosPage` — Shows the full list with filtering, search, and creation
- **`/todo?id=<uuid>`** — `TodoDetailPage` — Shows a single todo, receives the todo ID as a query parameter (`?id=...`), and displays all associated information with edit capability

This satisfies the requirement of multiple pages instead of a SPA with a single route.

---

## Data Persistence

Todos are saved in `backend/todos.json`. The file is created automatically on first run. No database setup is required.
