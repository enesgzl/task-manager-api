# TaskManagerApi 

A modern, full-stack Task Management application built with a .NET 8 RESTful API, SQLite, and a custom vanilla JavaScript frontend featuring a unique "blueprint" UI theme.


## 🚀 Features

* **Full CRUD Operations:** Create, read, update, and delete tasks seamlessly.
* **Modern UI/UX:** Custom dark mode "blueprint" engineering theme with responsive design.
* **Real-time Statistics:** Dynamically updates total, active, and completed task counts.
* **Same-Origin Setup:** The frontend is served directly from the `.NET` application's `wwwroot` folder, eliminating CORS overhead.
* **Asynchronous Processing:** Powered by modern Vanilla JavaScript (`fetch` API) for smooth, page-reload-free interactions.
* **Data Transfer Objects (DTOs):** Secure and structured data flow between the client and server.

## 🛠️ Tech Stack

**Backend:**
* .NET 8 (ASP.NET Core Web API)
* Entity Framework Core
* SQLite (Lightweight, file-based database)

**Frontend:**
* Vanilla JavaScript (ES6+)
* HTML5 & CSS3 (Custom styling, no external CSS frameworks)

## **🔌 API Endpoints**
 **HTTP Method** ---,**Endpoint**,  ---          **Description**
* GET,--- /api/taskitems,---     Retrieves all tasks (Supports isCompleted & search query filters)
* GET, ---      /api/taskitems/{id}  ---  Retrieves a specific task by its ID
* POST,---/api/taskitems,---Creates a new task
* PUT,---/api/taskitems/{id},---"Updates an existing task (title, description, status)"
* DELETE,---/api/taskitems/{id},---Deletes a task from the database
