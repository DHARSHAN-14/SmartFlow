# SmartFlow API Documentation

Base URL: `http://localhost:5000/api`

---

## Tasks

### GET /tasks
Returns all tasks. Supports query filters:
- `status` – Pending | In Progress | Completed
- `category` – Work | Study | Personal | Urgent
- `priority` – Low | Medium | High
- `energyLevel` – Low Energy | Medium Energy | High Energy
- `search` – string (title search)

### POST /tasks
Create a new task.

**Body:**
```json
{
  "title": "string (required)",
  "description": "string",
  "category": "Work|Study|Personal|Urgent|auto",
  "priority": "Low|Medium|High",
  "status": "Pending|In Progress|Completed",
  "energyLevel": "Low Energy|Medium Energy|High Energy",
  "dueDate": "ISO date string",
  "isFocusTask": false,
  "note": "string"
}
```

### PUT /tasks/:id
Update a task by ID. Same fields as POST.

### DELETE /tasks/:id
Delete a task by ID.

### GET /tasks/suggest
Returns the single highest-priority task recommendation.

---

## Insights

### GET /insights
Returns productivity statistics:
```json
{
  "total": 10,
  "completed": 4,
  "inProgress": 2,
  "pending": 4,
  "overdue": 1,
  "productivity": 40,
  "byCategory": { "Work": 3, "Study": 2, "Personal": 4, "Urgent": 1 },
  "byPriority":  { "High": 3, "Medium": 5, "Low": 2 },
  "byEnergy":    { "High Energy": 3, "Medium Energy": 4, "Low Energy": 3 }
}
```

---

## Streak

### GET /streak
Returns streak info:
```json
{
  "currentStreak": 5,
  "longestStreak": 12,
  "lastCompletedDate": "2025-01-15T00:00:00.000Z",
  "totalCompletedDays": 28
}
```
