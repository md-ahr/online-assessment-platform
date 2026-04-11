# Online Assessment Platform

**Live:** [https://ibos-assessment-platform.vercel.app/](https://ibos-assessment-platform.vercel.app/)

A full-stack **Next.js** application for employers to create and manage online tests and for candidates to browse assessments, take timed exams (MCQ, multi-select, and written questions), and view completion or timeout flows. Authentication uses **JWT** sessions in **httpOnly** cookies; data lives in **MongoDB** via **Mongoose**.

---

## Table of contents

- [Online Assessment Platform](#online-assessment-platform)
  - [Table of contents](#table-of-contents)
  - [Features](#features)
  - [Tech stack](#tech-stack)
  - [Prerequisites](#prerequisites)
  - [Getting started](#getting-started)
    - [1. Clone and install](#1-clone-and-install)
    - [2. Configure environment](#2-configure-environment)
    - [3. Seed users (recommended)](#3-seed-users-recommended)
    - [4. Start the dev server](#4-start-the-dev-server)
    - [5. Log in](#5-log-in)
  - [Environment variables](#environment-variables)
  - [Database seeding](#database-seeding)
  - [Scripts](#scripts)
  - [Application routes](#application-routes)
  - [Project structure](#project-structure)
  - [Authentication and sessions](#authentication-and-sessions)
  - [Testing and code quality](#testing-and-code-quality)
  - [Production build](#production-build)
  - [Troubleshooting](#troubleshooting)
  - [License](#license)

---

## Features

- **Employer dashboard** — list online tests, create/edit tests with a multi-step wizard (basic info, questions with rich text, MCQ / checkbox / text types).
- **Candidate experience** — catalog of tests, timed question flow with progress and timer, **timeout modal** when time expires, **completion** screen after the last question.
- **Security-minded assessments** — candidate-facing question payloads **do not** expose correct answers (`isCorrect` is never sent to the client).
- **Theming** — light/dark UI via `next-themes`.
- **Strict TypeScript** — `strict` mode enabled.

---

## Tech stack

| Area               | Technology                                                   |
| ------------------ | ------------------------------------------------------------ |
| Framework          | [Next.js 16](https://nextjs.org/) (App Router)               |
| UI                 | React 19, Tailwind CSS v4, Base UI / shadcn-style components |
| Forms & validation | React Hook Form, Zod                                         |
| Rich text          | Tiptap                                                       |
| Database           | MongoDB, Mongoose                                            |
| Auth               | jose (JWT), bcryptjs (password hashing)                      |
| Testing            | Vitest, Testing Library                                      |
| Tooling            | ESLint, Prettier, Husky, lint-staged                         |

---

## Prerequisites

- **Node.js** 20+ (recommended; aligned with Next.js 16)
- **pnpm** 9+ (lockfile: `pnpm-lock.yaml`)
- **MongoDB** 6+ reachable from your machine (local or Atlas)

---

## Getting started

### 1. Clone and install

```bash
cd online-assessment-platform
pnpm install
```

### 2. Configure environment

Copy the example file and edit values:

```bash
cp .env.example .env.local
```

- Set **`JWT_SECRET`** to a random string **at least 32 characters** (required by `lib/env.ts`).
- Set **`MONGODB_URI`** to your MongoDB connection string (must pass Zod’s URL validation; standard `mongodb://` / `mongodb+srv://` URIs work).

See [Environment variables](#environment-variables) for the full list.

### 3. Seed users (recommended)

Seeds create or update employer and candidate users used for login. They require variables in `.env.local` (see `.env.example`).

```bash
pnpm seed:employer
pnpm seed:candidate
```

Run both if you need both roles. Re-running seeds **upserts** users by email or business `userId`.

### 4. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) (root redirects to `/auth/login`).

### 5. Log in

- Use the **employer** email/password and business user id from your seed env (e.g. `SEED_EMPLOYER_EMAIL` / `SEED_EMPLOYER_PASSWORD`; login accepts **email or user id**).
- Use the **candidate** credentials for the candidate area.

After code changes that alter JWT claims (e.g. display `name` in the header), **log out and log in again** so the session cookie is refreshed.

---

## Environment variables

| Variable      | Required for app | Purpose                                                           |
| ------------- | ---------------- | ----------------------------------------------------------------- |
| `MONGODB_URI` | Yes              | MongoDB connection string                                         |
| `JWT_SECRET`  | Yes              | HMAC secret for session JWT (min 32 chars)                        |
| `NODE_ENV`    | Optional         | `development` / `test` / `production` (validated in `lib/env.ts`) |

**Seeding** (`pnpm seed:employer` / `pnpm seed:candidate`) additionally requires the `SEED_*` variables shown in `.env.example` (names, emails, passwords, ids, and `SEED_EMPLOYER_ROLE` for the employer script).

> **Note:** Seed scripts load `.env.local` via `node --env-file=.env.local` (see `package.json` scripts).

---

## Database seeding

| Command               | Description                                                                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm seed:employer`  | Upserts employer (or candidate if `SEED_EMPLOYER_ROLE=candidate`) user with `name`, email, hashed password, business `userId`, and role. |
| `pnpm seed:candidate` | Upserts candidate user with the same shape.                                                                                              |

Implementation: `scripts/seed-user-shared.mjs` (shared Mongoose schema + `updateOne` upsert). The in-app user model lives in `lib/db/models/user.ts` and includes a required **`name`** field—seeds must set it (see `SEED_*_NAME` in `.env.example`).

---

## Scripts

| Script               | Description                           |
| -------------------- | ------------------------------------- |
| `pnpm dev`           | Next.js development server            |
| `pnpm build`         | Production build                      |
| `pnpm start`         | Run production server (after `build`) |
| `pnpm lint`          | ESLint                                |
| `pnpm lint:fix`      | ESLint with auto-fix                  |
| `pnpm format`        | Prettier write for common file types  |
| `pnpm typecheck`     | TypeScript (`tsc --noEmit`)           |
| `pnpm test`          | Vitest watch mode                     |
| `pnpm test:run`      | Vitest single run (CI-friendly)       |
| `pnpm test:coverage` | Vitest with coverage                  |

---

## Application routes

| Path                                     | Who       | Description                                  |
| ---------------------------------------- | --------- | -------------------------------------------- |
| `/`                                      | Public    | Redirects to `/auth/login`                   |
| `/auth/login`                            | Public    | Login (email or business user id + password) |
| `/auth/forgot-password`                  | Public    | Placeholder / forgot flow                    |
| `/dashboard`                             | Employer  | Dashboard listing online tests               |
| `/dashboard/create-online-test`          | Employer  | Create test wizard                           |
| `/dashboard/create-online-test/[testId]` | Employer  | Edit existing test                           |
| `/candidate`                             | Candidate | Browse online tests                          |
| `/candidate/tests/[testId]`              | Candidate | Take assessment (questions + timer)          |
| `/candidate/tests/[testId]/complete`     | Candidate | Post-submit completion screen                |

Access control is enforced in **Server Components** and **server actions** via `requireEmployerSession()` and `requireCandidateSession()` in `lib/auth/guards.ts` (redirect to login or wrong role home). The repo includes an optional **`proxy.ts`** helper (JWT + redirects for `/dashboard` and `/auth/login`) that you can wire into **`middleware.ts`** if you want edge-level protection; there is **no** committed `middleware.ts` today, so do not assume dashboard routes are blocked before the server runs unless you add it.

---

## Project structure

```text
app/                      # Next.js App Router pages & layouts
  (public)/auth/          # Login, forgot password
  dashboard/              # Employer UI
  candidate/              # Candidate catalog, test session, completion
components/
  auth/                   # Login UI
  candidate/              # Candidate overview, test session, timeout modal, completion
  dashboard/              # Employer dashboard & create-test wizard
  layout/                 # Header, footer, theme switcher
  ui/                     # Shared UI primitives
lib/
  auth/                   # JWT, cookies, guards
  db/                     # Mongoose connection, models, repositories
public/                   # Static assets
scripts/                  # Node seed scripts (.mjs)
```

Path alias: `@/*` → project root (see `tsconfig.json`).

---

## Authentication and sessions

- On successful login, `loginAction` loads the user from MongoDB, verifies the password with **bcrypt**, and calls `setSessionCookie` with `email`, `name`, `role`, MongoDB `_id` as JWT `sub` (stored in session as `userId`), and business **`userId`** from the document as `username` in the payload (used in the UI as “Ref. ID”).
- The JWT is stored in the **`assessment_session`** cookie (`lib/auth/constants.ts`), **httpOnly**, **12-hour** TTL by default.
- `getSessionFromCookies()` verifies the token and is used in the root layout to hydrate the **Header** with the signed-in user.

---

## Testing and code quality

- **Vitest** config: `vitest.config.ts`, setup: `vitest.setup.ts`.
- **Husky** + **lint-staged** run ESLint (and Prettier on staged files) on pre-commit when configured in your clone.

```bash
pnpm test:run
pnpm lint
pnpm typecheck
```

---

## Production build

```bash
pnpm build
pnpm start
```

Set the same environment variables on the host (especially `MONGODB_URI`, `JWT_SECRET`, and `NODE_ENV=production` for secure cookies where applicable). Ensure `JWT_SECRET` is never committed.

---

## Troubleshooting

| Issue                                          | What to check                                                                                                    |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `Invalid environment configuration` on startup | `JWT_SECRET` length ≥ 32; `MONGODB_URI` is a valid URL string.                                                   |
| Seed script errors                             | All `SEED_*` keys from `.env.example` exist in `.env.local`; no stray quotes breaking values unless intentional. |
| Header shows wrong / missing name              | Re-login after user or JWT shape changes so the cookie is reissued.                                              |
| Candidate test not found                       | `testId` must be a valid MongoDB ObjectId string; seed tests via employer UI or your own data.                   |
| Timer / modal behavior                         | Timed tests use `durationMinutes` from the test document; `null` means no countdown.                             |

---

## License

This repository is **private** (`"private": true` in `package.json`).
