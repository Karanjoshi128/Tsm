# Task Management System (TMS)

A simple Task Management System built with **Next.js (App Router)**, **NextAuth (Credentials)**, **Prisma**, and **PostgreSQL**.

## Live URL

- Live Demo: https://tsm-one.vercel.app/

## Test Credentials (Seeded)

After running the seed (`npx prisma db seed`):

**Admin (can access Projects module)**

- Email: `admin@test.com`
- Password: `admin123`

**Members (dashboard access)**

- Email: `karan1@gmail.com` … `karan9@gmail.com`
- Password (all members): `member123`

## Seeded Data

The seed creates:

- **3 projects**
  - Task Management System (ACTIVE)
  - Marketing Website (ACTIVE)
  - Mobile App MVP (ON_HOLD)
- **4 tasks per project** (12 total)
  - Design UI
  - Build API
  - Write Documentation
  - Testing & QA

## Features

- Auth with email/password (NextAuth Credentials)
- Role-based access control (ADMIN vs MEMBER)
- Basic animations (GSAP)
- Smooth scrolling (Lenis)
- Admin can:
  - View/create projects
  - Delete projects (with typed confirmation)
  - Update project status (dropdown)
  - Add users to a project by email
  - Create tasks inside a project
    - Task assignment is restricted to members of that project
  - Update task status (dropdown)
  - Delete tasks
- Members can:
  - View their assigned tasks on the Dashboard

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- NextAuth v4 (JWT sessions)
- Prisma ORM
- PostgreSQL
- GSAP (basic animations)
- Lenis (smooth scrolling)

## Architecture (High Level)

- **App Router** pages in `src/app/**`
- **Server Components** for data fetching pages (Dashboard, Projects, Project detail)
- **Client Components** only where interaction is needed (forms, status dropdowns, delete button)
- **Prisma** for DB access via `src/lib/prisma.ts`
- **RBAC** enforced in `src/middleware.ts` + API route checks

## Route Protection / RBAC

Implemented in `src/middleware.ts`:

- Unauthenticated users are redirected to `/login`
- Only ADMIN can access:
  - `/projects/*`
  - `/api/projects/*`
- Auth required for:
  - `/dashboard/*`
  - `/api/tasks/*`

## Database Schema

Prisma models:

- `User` (role: `ADMIN | MEMBER`)
- `Project` (status: `ACTIVE | ON_HOLD | COMPLETED`)
- `ProjectMember` (join table between user and project)
- `Task`
  - `priority: LOW | MEDIUM | HIGH`
  - `status: TODO | IN_PROGRESS | DONE`

Schema file: `prisma/schema.prisma`

## Project Structure

High-signal paths:

- `src/app/login/page.tsx` – Login UI
- `src/app/register/page.tsx` – Register UI
- `src/app/dashboard/page.tsx` – Role-based dashboard (admin sees all tasks, member sees own)
- `src/app/projects/page.tsx` – Projects list (ADMIN)
- `src/app/projects/[projectId]/page.tsx` – Project details + task list + status controls (ADMIN)
- `src/app/api/**` – API routes
- `prisma/seed.ts` – Seed logic
- `prisma/seed-runner.cjs` – Seed runner (loads env + runs TS seed reliably)

## Environment Variables

Create a `.env` file in the project root:

```env
# PostgreSQL DB
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require"

# Optional (recommended for Prisma migrations on some hosts)
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secret (example):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Setup (Local)

Prerequisites:

- Node.js (LTS recommended)
- npm

Steps:

```bash
npm install

# Apply migrations
npx prisma migrate dev

# Seed test users/projects/tasks
npx prisma db seed

# Start app
npm run dev
```

Open: http://localhost:3000

## Prisma Studio

```bash
npx prisma studio
```

## API Endpoints (Implemented)

Auth:

- `POST /api/register` – Create a MEMBER user
- `/api/auth/*` – NextAuth endpoints (Credentials login)

Projects (ADMIN via middleware):

- `GET /api/projects` – List projects
- `POST /api/projects` – Create project
- `PATCH /api/projects/:projectId` – Update project status
- `GET /api/projects/:projectId/members` – List project members
- `POST /api/projects/:projectId/members` – Add a project member by email
- `DELETE /api/projects/:projectId` – Delete project (also removes tasks/members)

Tasks (auth required via middleware):

- `GET /api/tasks`
  - ADMIN: all tasks
  - MEMBER: only their assigned tasks
- `POST /api/tasks` – Create task (ADMIN only)
  - The `assignedToId` must be a member of `projectId`
- `PATCH /api/tasks/:taskId`
  - ADMIN: full update
  - MEMBER: can update only status of their own task
- `DELETE /api/tasks/:taskId` – Delete task (ADMIN only)

## Notes

- The `/` route is a simple landing page.

## Screens / Pages

- `/login` – Sign in
- `/register` – Create account
- `/dashboard` – Task overview (role-based)
- `/projects` – Projects module (ADMIN only)
