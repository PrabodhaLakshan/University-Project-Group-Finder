# University-Project-Group-Finder
This is a Next.js Project 

# Project Group Finder (Next.js + Prisma + Supabase PostgreSQL)

A real-world web application to help university students create profiles, find project group members, and manage collaboration.

---

## Tech Stack
- **Frontend/Backend:** Next.js (App Router)
- **Database:** Supabase PostgreSQL (Cloud)
- **ORM:** Prisma
- **Auth:** JWT (JSON Web Token)
- **Password Hashing:** bcryptjs
- **UI:** Tailwind CSS (optional)

---

## Features (Current)
- Student Register (API)
- Student Login (API)
- Get current user details (API: `/api/me`)

---

## Folder Structure (Important)
> `app/api` = backend routes  
> `app/(auth)` and `app/(protected)` = frontend pages (route groups)

Example:
src/app
api/
auth/login/route.ts
auth/register/route.ts
me/route.ts

(auth)/
login/page.tsx
register/page.tsx

(protected)/
dashboard/page.tsx
profile/page.tsx






හරි ✅ ඔයාට GitHub README එකට “full complete” එකක් දෙනවා — dependencies, install order, env setup, prisma steps, run, common errors (TLS), plus API endpoints.
(ඔයා npm use කරනවා කියලා assume කරලා දානවා.)

> ⚠️ Security note: `.env` එක GitHub එකට commit කරන්න එපා.

---

## ✅ FULL `README.md` (copy–paste)

```md
# Project Group Finder (Next.js + Prisma + Supabase PostgreSQL)

A real-world web application to help university students create profiles, find project group members, and manage collaboration.

---

## Tech Stack
- **Frontend/Backend:** Next.js (App Router)
- **Database:** Supabase PostgreSQL (Cloud)
- **ORM:** Prisma
- **Auth:** JWT (JSON Web Token)
- **Password Hashing:** bcryptjs
- **UI:** Tailwind CSS (optional)

---

## Features (Current)
- Student Register (API)
- Student Login (API)
- Get current user details (API: `/api/me`)

---

## Folder Structure (Important)
> `app/api` = backend routes  
> `app/(auth)` and `app/(protected)` = frontend pages (route groups)

Example:
```

src/app
api/
auth/login/route.ts
auth/register/route.ts
me/route.ts

(auth)/
login/page.tsx
register/page.tsx

(protected)/
dashboard/page.tsx
profile/page.tsx

````

---

## Requirements
- Node.js (LTS recommended)
- npm (comes with Node.js)
- Supabase account + a PostgreSQL project

---

## Setup Guide

### 1) Clone the repository
```bash
git clone <YOUR_REPO_URL>
cd project-group-finder
````

### 2) Install dependencies

```bash
npm install
```

---

## Dependencies Explained (Why we install them)

### ✅ Prisma + Database

Install Prisma and PostgreSQL driver packages:

```bash
npm install prisma @prisma/client pg
```

If your project uses Supabase pooling adapter:

```bash
npm install @prisma/adapter-pg
```

### ✅ Authentication

Password hashing + JWT:

```bash
npm install bcryptjs jsonwebtoken
```

TypeScript types (recommended):

```bash
npm install -D @types/jsonwebtoken
```

> **bcryptjs** = used to hash passwords safely (never store plain passwords)
> **jsonwebtoken** = used to create login tokens (JWT)

---

## 3) Environment Variables (`.env`)

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://postgres.<project-ref>:<DB_PASSWORD>@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=no-verify&uselibpqcompat=true"
JWT_SECRET="your_super_secret_key"
```

### Supabase Values

* `<project-ref>` = your Supabase project ref (example: `orinbntgsotpsarcvrga`)
* `<DB_PASSWORD>` = your Supabase database password

✅ **Important**

* Use **Supabase Pooler (Transaction mode)** port **6543**
* This URL includes SSL params to avoid TLS issues in some environments.

---

## 4) Prisma Setup

### Generate Prisma Client

```bash
npx prisma generate
```

### If you already have tables in Supabase (existing DB)

Pull schema from DB:

```bash
npx prisma db pull
```

### If you are creating tables using Prisma migrations

```bash
npx prisma migrate dev
```

---

## 5) Run the Project

```bash
npm run dev
```

Open:

* [http://localhost:3000](http://localhost:3000)

---

## Prisma Studio (Optional)

To view database tables:

```bash
npx prisma studio
```

---



