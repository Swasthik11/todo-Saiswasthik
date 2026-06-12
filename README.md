# Taskly — Todo Application

A full-stack Todo application built with **React** (multi-page frontend) and **Node.js + Express** (REST API backend), featuring JSON file-based persistence for lightweight data storage.

---

## Features

### Todo List Page (`/`)

* Create tasks with title, description, priority, due date, and tags
* Mark tasks as complete/incomplete with a single click
* Delete tasks with confirmation
* Filter tasks by All, Active, or Completed
* Search tasks by title, description, or tags
* Sort tasks by newest, oldest, priority, or due date
* Real-time statistics showing total, active, and completed tasks

### Todo Detail Page (`/todo?id=<id>`)

* View complete task information
* Inline editing for all task fields
* Toggle completion status
* Delete task directly from detail page
* View created and updated timestamps
* Overdue task highlighting
* Unique task ID display

---

## Tech Stack

| Layer    | Technology               |
| -------- | ------------------------ |
| Frontend | React 18                 |
| Routing  | React Router v6          |
| Backend  | Node.js, Express 4       |
| Storage  | JSON File (`todos.json`) |
| Styling  | Pure CSS                 |
| IDs      | UUID v4                  |

---

## Project Structure

```text
todo-app/
├── backend/
│   ├── server.js
│   ├── todos.json
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── api.js
│   │   ├── index.js
│   │   ├── index.css
│   │   └── pages/
│   │       ├── TodosPage.js
│   │       ├── TodosPage.css
│   │       ├── TodoDetailPage.js
│   │       └── TodoDetailPage.css
│   └── package.json
└── README.md
```

---

## API Reference

**Base URL**

```text
http://localhost:5001/api
```

| Method | Endpoint     | Description       |
| ------ | ------------ | ----------------- |
| GET    | `/todos`     | Get all todos     |
| GET    | `/todos/:id` | Get a single todo |
| POST   | `/todos`     | Create a todo     |
| PUT    | `/todos/:id` | Update a todo     |
| DELETE | `/todos/:id` | Delete a todo     |

### Todo Schema

```json
{
  "id": "uuid-v4",
  "title": "string",
  "description": "string",
  "priority": "low | medium | high",
  "dueDate": "YYYY-MM-DD | null",
  "tags": ["string"],
  "completed": false,
  "createdAt": "ISO Date",
  "updatedAt": "ISO Date"
}
```

### Example Create Request

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

## Installation & Setup

### Prerequisites

* Node.js v16 or higher
* npm

### Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs at:

```text
http://localhost:5001
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at:

```text
http://localhost:3000
```

---

## Environment Variables (Optional)

Create a `.env` file inside the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5001/api
```

---

## Application Routes

| Route             | Description      |
| ----------------- | ---------------- |
| `/`               | Todo List Page   |
| `/todo?id=<uuid>` | Todo Detail Page |

The application uses React Router v6 to provide a multi-page experience with dedicated routes for task listing and task details.

---

## Data Persistence

All todos are stored in:

```text
backend/todos.json
```

The file is automatically created when the application starts for the first time. No external database setup is required.

---

## Author

**Saiswasthik D Shetty**

Built as part of a Full-Stack Developer Assignment using React, Node.js, and Express.
