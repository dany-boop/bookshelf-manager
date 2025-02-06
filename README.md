# 📚 Bookshelf Manager

Bookshelf Manager is a **feature-rich** and **highly optimized** book management system built using **Next.js 14** with **App Router**, **TypeScript**, **Prisma ORM**, and **Redux**. It supports **both Supabase PostgreSQL and SQLite** databases, providing flexibility in deployment. This project includes **authentication, CRUD functionality, filtering, search, dark mode, and more**.

---

## 🚀 Features

✅ **Authentication & Profile Management** (with avatar upload)  
✅ **Book CRUD** (Create, Read, Update, Delete books)  
✅ **Filtering & Sorting** (by status, category, language)  
✅ **Debounced Search** (by title or author)  
✅ **Dark Mode** (Theme toggle with system mode detection)  
✅ **Supabase & Local Storage** (Choose between cloud or local storage for book covers)  
✅ **Optimized Image Handling** (Uses Sharp for resizing and compression)  
✅ **State Management with Redux** (Auth, Books, User data)  
✅ **Persisted Storage with Redux Persist**  
✅ **Fully Responsive UI** (Built with Tailwind CSS & shadcnUI)  
✅ **Docker Support** for containerized deployment  
✅ **Vercel Deployment Ready** 🚀  

---

## 📂 Project Structure

```
/prisma            # Prisma schema & migrations
/public            # Static assets
   ├── assets      # Images, icons
   ├── uploads     # Local storage (used for SQLite)
/src
  ├── app         # Next.js App Router structure
  │   ├── (pages) # Page components
  │   ├── api     # API routes for backend
  │   ├── layout.tsx, page.tsx, theme-provider.tsx
  ├── components  # Reusable UI components
  │   ├── common  # Common components (login form, book card, table, etc.)
  │   ├── container # Container components for each page
  │   ├── layouts  # Sidebar, Topbar, Layout.tsx (for container layout)
  │   ├── ui      # shadcnUI components
  ├── lib        # Utilities & configurations
  │   ├── data.ts, utils.ts, supabase.ts, etc.
  ├── redux      # Redux state management (authSlice, bookSlice, userSlice)
/middleware.ts     # Middleware for authentication
.env               # Environment variables
.env.example       # Sample env file
Dockerfile         # Docker container setup
```

---

## 🛠️ Technologies Used

- **Next.js 14 (App Router)**
- **TypeScript**
- **Prisma ORM** (with SQLite for local & Supabase PostgreSQL for production)
- **Redux Toolkit & Redux Persist**
- **shadcnUI & Tailwind CSS**
- **Supabase (Authentication & Storage)**
- **Sharp (Image Optimization)**
- **Vercel (Hosting & Deployment)**
- **Docker** (For containerized deployment)

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-repo/bookshelf-manager.git
cd bookshelf-manager
```

### 2️⃣ Install Dependencies
```bash
npm install  # or yarn install
```

### 3️⃣ Setup Environment Variables  
Rename `.env.example` to `.env` and configure the values accordingly.

For **Supabase (PostgreSQL)**:
```
DATABASE_URL="postgresql://your-db-url"
NEXT_PUBLIC_SUPABASE_URL="https://your-supabase-url.supabase.co"
NEXT_PUBLIC_SUPABASE_BUCKET="book-covers"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1h"
```

For **SQLite (Local Development)**:
```
DATABASE_URL="file:./bookshelf.db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1h"
```

### 4️⃣ Configure Prisma
Run migrations and generate Prisma Client:

```bash
# For Supabase (PostgreSQL)
npx prisma migrate dev --name init
npx prisma generate

# For SQLite
npx prisma migrate dev --name init
npx prisma generate
```

###  4️⃣ Database Configuration on Prisma
for Local Development using sqlite place this on shcema.prisma
```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```
for Supabase place this on shcema.prisma
```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

```

### 5️⃣ Run the Development Server
```bash
npm run dev  # or yarn dev
```
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

## 🚢 Deployment

### **Vercel Deployment**  
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Login & Deploy:
   ```bash
   vercel login
   vercel
   ```
3. Set Environment Variables in Vercel Dashboard

### **Docker Deployment**  
1. Build Docker Image:
   ```bash
   docker build -t bookshelf-manager .
   ```
2. Run the Container:
   ```bash
   docker run -p 3000:3000 bookshelf-manager
   ```


© 2025 Bookshelf Manager | Built using Next.js
