

![WhatsApp Image 2026-02-15 at 01 06 13](https://github.com/user-attachments/assets/8274d3d9-5e67-4cbc-9754-4a626bea4453)


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
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
