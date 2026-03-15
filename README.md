# TaskFlow — Scalable REST API with Authentication & Role-Based Access

A full-stack task management application built with Node.js, Express, MongoDB, and React.js. Implements JWT authentication, role-based access control, and full CRUD operations.

---

## Project Structure

```
project/
├── backend/          # Node.js + Express + MongoDB API (MVC)
└── frontend/         # React.js client
```

---

## Backend Setup

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### Installation

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Environment Variables

| Variable     | Description                        | Default               |
|--------------|------------------------------------|-----------------------|
| PORT         | Server port                        | 5000                  |
| MONGO_URI    | MongoDB connection string          | mongodb://localhost/taskmanager |
| JWT_SECRET   | Secret key for JWT signing         | (required)            |
| JWT_EXPIRE   | JWT expiry duration                | 7d                    |
| NODE_ENV     | Environment                        | development           |
| CLIENT_URL   | Frontend URL for CORS              | http://localhost:3000 |

### API Base URL
```
http://localhost:5000/api/v1
```

### API Documentation (Swagger)
```
http://localhost:5000/api-docs
```

---

## Frontend Setup

### Installation

```bash
cd frontend
npm install
npm start
```

Runs on `http://localhost:3000` and proxies API requests to `http://localhost:5000`.

---

## API Endpoints

### Auth — `/api/v1/auth`

| Method | Endpoint    | Access  | Description         |
|--------|-------------|---------|---------------------|
| POST   | /register   | Public  | Register new user   |
| POST   | /login      | Public  | Login user          |
| GET    | /me         | Private | Get current user    |

### Tasks — `/api/v1/tasks`

| Method | Endpoint   | Access       | Description                             |
|--------|------------|--------------|-----------------------------------------|
| GET    | /          | Private      | Get tasks (own for user, all for admin) |
| POST   | /          | Private      | Create task                             |
| GET    | /:id       | Private      | Get single task                         |
| PUT    | /:id       | Private      | Update task                             |
| DELETE | /:id       | Private      | Delete task                             |

### Users — `/api/v1/users` (Admin only)

| Method | Endpoint   | Access | Description       |
|--------|------------|--------|-------------------|
| GET    | /          | Admin  | Get all users     |
| GET    | /:id       | Admin  | Get user by ID    |
| PUT    | /:id       | Admin  | Update user       |
| DELETE | /:id       | Admin  | Delete user       |

---

## Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are returned on `/auth/register` and `/auth/login`.

---

## Roles

| Role  | Permissions                                      |
|-------|--------------------------------------------------|
| user  | CRUD on own tasks only                           |
| admin | CRUD on all tasks, manage all users              |

---

## Features

- JWT authentication with bcrypt password hashing
- Role-based access control (user / admin)
- Full CRUD for tasks with filtering & pagination
- Input validation via `express-validator`
- MongoDB sanitization against NoSQL injection
- Rate limiting (100 requests / 15 min)
- Security headers via `helmet`
- Winston structured logging to files
- Swagger UI API documentation
- React frontend with protected routes, toast notifications, and responsive layout

---

## Scalability Notes

### Current Architecture
The application is structured as a modular MVC monolith with clean separation of concerns. Each domain (auth, tasks, users) has its own controller, route, and validator files, making it straightforward to split into independent services when needed.

### Path to Microservices
When traffic grows, the three domains map cleanly to independent microservices:
- **Auth Service** — handles identity, token issuance, and validation
- **Task Service** — owns task CRUD and business logic
- **User Service** — manages user profiles and admin operations

An API Gateway (e.g. NGINX, Kong) would sit in front to route requests and forward JWTs for validation.

### Caching
Redis can be introduced at two levels:
- **Session/token blacklist** — store invalidated JWTs so logout is instant without a DB call
- **Query caching** — cache `GET /tasks` responses per user, invalidated on write

### Load Balancing
The Express app is stateless (JWTs, no server-side sessions), so horizontal scaling is trivial. Run N instances behind NGINX or use a cloud load balancer (AWS ALB, GCP Cloud Load Balancing). A process manager like PM2 in cluster mode can saturate all CPU cores on a single machine immediately.

### Database Scaling
MongoDB scales horizontally via sharding. Shard the `tasks` collection on `owner` so each user's tasks are co-located. Add read replicas to offload analytics and admin queries.

### Deployment
The backend and frontend can each be containerized with Docker and orchestrated via Docker Compose (dev) or Kubernetes (production). A sample `docker-compose.yml` can spin up `mongo`, `backend`, and `frontend` with a single command.

---

## Running with Docker (Optional)

```bash
# From project root
docker-compose up --build
```

See `docker-compose.yml` for the full configuration.
