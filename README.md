# ⚡ SmartFlow – Intelligent Task Management System

![SmartFlow Banner](docs/banner.png)

> A next-generation TODO application combining task management with productivity
> insights, smart categorisation, energy tagging, and a streak system.

---

## 🚀 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS    |
| Backend   | Node.js + Express                 |
| Database  | MongoDB 6                         |
| DevOps    | Docker + Docker Compose + Jenkins |

---

## ✨ Key Features

### Core
- **Smart Auto-Categorisation** – Keyword analysis assigns Work / Study / Personal / Urgent
- **Priority System** – Low / Medium / High with colour-coded indicators
- **Status Workflow** – Pending → In Progress → Completed
- **Progress Tracking** – Real-time productivity percentage on the dashboard
- **Daily Focus Mode** – Pin up to 3 tasks as daily focus; highlighted everywhere
- **Task Timeline** – Tasks grouped by due date with a visual timeline

### Unique Features
- **⚡ Energy Tagging** – Low / Medium / High Energy per task
- **🔥 Streak System** – Tracks consecutive days you complete tasks
- **🧠 Smart Suggestion Engine** – Recommends next task based on priority + due date + energy
- **📝 Micro Journal** – Short note/journal entry per task
- **📊 Insight Panel** – Category, priority, and energy breakdowns with progress bars

---

## 🗂️ Folder Structure

```
smartflow/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── api/             # Axios API helpers
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   └── utils/           # Color constants, helpers
│   ├── Dockerfile
│   └── nginx.conf
├── server/                  # Express backend
│   ├── models/              # Mongoose models (Task, Streak)
│   ├── routes/              # API route handlers
│   └── utils/               # Streak helper
├── docker-compose.yml
├── Jenkinsfile
└── README.md
```

---

## 🐳 Quick Start with Docker

### Prerequisites
- Docker ≥ 24
- Docker Compose ≥ 2

### Run everything with one command

```bash
git clone https://github.com/yourorg/smartflow.git
cd smartflow
docker-compose up --build
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:3000      |
| Backend  | http://localhost:5000      |
| MongoDB  | mongodb://localhost:27017  |

### Stop & clean up

```bash
docker-compose down -v
```

---

## 🛠️ Local Development (without Docker)

### Backend

```bash
cd server
cp .env.example .env
# Edit .env – set MONGO_URI to your local MongoDB
npm install
npm run dev          # nodemon auto-reload on :5000
```

### Frontend

```bash
cd client
npm install
npm run dev          # Vite dev server on :3000
```

---

## 🔌 REST API Reference

| Method | Endpoint             | Description                    |
|--------|----------------------|--------------------------------|
| GET    | /api/tasks           | List tasks (filterable)        |
| POST   | /api/tasks           | Create task                    |
| PUT    | /api/tasks/:id       | Update task                    |
| DELETE | /api/tasks/:id       | Delete task                    |
| GET    | /api/tasks/suggest   | Smart next-task suggestion     |
| GET    | /api/insights        | Productivity stats             |
| GET    | /api/streak          | Current streak data            |
| GET    | /health              | Health check                   |

### Filter query params (GET /api/tasks)
```
?status=Pending
?category=Work
?priority=High
?energyLevel=High Energy
?search=keyword
```

---

## ⚙️ CI/CD with Jenkins

### Setup

1. Install Jenkins with Docker and Node plugins
2. Create a credential `dockerhub-credentials` (Username + Password)
3. Update `DOCKERHUB_USERNAME` in `Jenkinsfile`
4. Create a Pipeline job pointing to your repo

### Pipeline stages

```
Checkout → Install Deps → Build Frontend → Docker Login
   → Build Images (parallel) → Push to Hub → Deploy
```

---

## 🔧 Environment Variables

### server/.env

```
PORT=5000
MONGO_URI=mongodb://mongo:27017/smartflow
NODE_ENV=production
```

---

## 📊 Smart Suggestion Algorithm

Each pending task receives a score:

| Factor           | Points                              |
|------------------|-------------------------------------|
| Priority: High   | +40                                 |
| Priority: Medium | +25                                 |
| Priority: Low    | +10                                 |
| Overdue          | +60                                 |
| Due < 1 day      | +50                                 |
| Due < 3 days     | +30                                 |
| Due < 7 days     | +15                                 |
| Category: Urgent | +30                                 |
| Is Focus Task    | +20                                 |

The task with the highest score is returned as the recommendation.

---

## 🙌 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes
4. Open a Pull Request

---

## 📄 License

MIT © SmartFlow Contributors
