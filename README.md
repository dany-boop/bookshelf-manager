# Bookshelf Manager

**Bookshelf Manager** is a full-stack web application built with Next.js 14 (using the App Router) and TypeScript. It leverages Prisma as the ORM with a dual-database configuration: SQLite for local development and PostgreSQL (via Supabase) for production. The project also uses Redux for state management, shadcnUI for beautiful UI components, and Docker for containerization. Bookshelf Manager supports CRUD operations for books, user authentication with profile editing (including avatar upload), dark mode, filtering by book status, category, and language, and debounced search functionality by title or author.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or later)
- **npm**, **yarn**, or **pnpm**
- **Docker** (optional, for containerized deployments)
- A [Supabase](https://supabase.com/) account (for production PostgreSQL)

---

## 🛠 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/bookshelf-manager.git
cd bookshelf-manager
2. Install Dependencies
bash
Copy
Edit
npm install
# or
yarn install
3. Set Up Environment Variables
Local Development (SQLite)
Create a file named .env.local with the following content:

env
Copy
Edit
DATABASE_URL="file:./bookshelf.db"
JWT_SECRET="your-local-secret-key"
JWT_EXPIRES_IN="1h"
Production (Supabase PostgreSQL)
Create a file named .env.production with your Supabase credentials:

env
Copy
Edit
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/YOUR_DATABASE?sslmode=require"
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
JWT_SECRET="your-production-secret-key"
JWT_EXPIRES_IN="1h"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
NEXT_PUBLIC_SUPABASE_BUCKET="book-covers"
Note: Replace YOUR_PASSWORD, YOUR_PROJECT, and YOUR_DATABASE with your actual Supabase details.

4. Prisma Setup
This project uses two separate Prisma schema files—one for local development and one for production.

a. Local Schema (prisma/schema.dev.prisma)
prisma
Copy
Edit
// prisma/schema.dev.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// Define your models (User, Book, etc.) here.
Run the following commands for local development:

bash
Copy
Edit
npx prisma migrate dev --schema=./prisma/schema.dev.prisma --name init
npx prisma generate --schema=./prisma/schema.dev.prisma
b. Production Schema (prisma/schema.prod.prisma)
prisma
Copy
Edit
// prisma/schema.prod.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Define your models (User, Book, etc.) here (same as development).
To deploy your production database:

Copy your production environment variables:
bash
Copy
Edit
cp .env.production .env
Run the production migrations:
bash
Copy
Edit
npx prisma migrate deploy --schema=./prisma/schema.prod.prisma
npx prisma generate --schema=./prisma/schema.prod.prisma
📁 Project Structure & Architecture
java
Copy
Edit
bookshelf-manager/
├── prisma/
│   ├── schema.dev.prisma        // Prisma schema for SQLite (development)
│   ├── schema.prod.prisma       // Prisma schema for PostgreSQL (production)
│   ├── migrations/              // Prisma migration files
│   └── seed.ts                  // Seeding script for initial data
├── public/
│   ├── assets/                  // Static assets (e.g., images, icons)
│   └── uploads/                 // File uploads storage (used with SQLite)
├── src/
│   ├── app/
│   │   ├── api/                 // API routes
│   │   │   ├── auth/            // Authentication endpoints
│   │   │   ├── books/           // Book CRUD endpoints
│   │   │   └── ...              // Other API routes
│   │   ├── layout.tsx           // Global layout (includes theme-provider, etc.)
│   │   ├── page.tsx             // Landing page
│   │   └── theme-provider.tsx   // Theme context/provider (dark/light mode)
│   ├── components/
│   │   ├── common/              // Common components (login form, book card, skeleton, table, etc.)
│   │   ├── container/           // Container components for each page
│   │   ├── layouts/             // Layout components (sidebar, topbar, main layout)
│   │   └── ui/                  // shadcnUI components
│   ├── lib/
│   │   ├── prisma.ts            // Prisma client initialization
│   │   ├── supabase.ts          // Supabase client initialization
│   │   └── utils.ts             // Utility functions
│   ├── redux/
│   │   ├── authSlice.ts         // Redux slice for authentication
│   │   ├── bookSlice.ts         // Redux slice for books
│   │   ├── userSlice.ts         // Redux slice for user
│   │   └── store.ts             // Redux store configuration (with persist)
│   ├── middleware.ts            // Custom Next.js middleware
├── .env.local                   // Environment file for development
├── .env.production              // Environment file for production
├── dockerfile                   // Docker configuration file
├── package.json
└── README.md
Architecture Highlights:

API Routes: Implemented using Next.js API routes (located under src/app/api) for authentication, book CRUD operations, and file uploads.
Prisma ORM: Manages your database with two configurations:
Local: SQLite (using schema.dev.prisma).
Production: PostgreSQL via Supabase (using schema.prod.prisma).
State Management: Redux (with redux-persist) for managing authentication, books, and user data.
UI Components: Built with shadcnUI and Tailwind CSS for a modern, responsive design.
Fullstack Next.js App: Uses Next.js 14's App Router and TypeScript, providing a scalable fullstack application.
Docker: Containerization for consistent deployment environments.
🛠 Technologies Used
Next.js 14 & TypeScript: Modern framework and language for building scalable, fullstack applications.
Prisma ORM: Manages database interactions; uses SQLite for local development and PostgreSQL (via Supabase) for production.
Redux & Redux Toolkit: For global state management with persistent storage.
shadcnUI & Tailwind CSS: For building elegant, customizable, and responsive user interfaces.
Supabase: Managed PostgreSQL database solution used in production.
SQLite: Lightweight database for local development.
Docker: Ensures consistency between development and production environments.
Additional Libraries: Ethers.js, NextAuth, Zod, and more for a robust and feature-rich application.
🌟 Implemented Features
User Authentication: Secure login, registration, and session management.
Book CRUD Operations: Create, read, update, and delete book records with file uploads for cover images.
Dual Database Configuration:
Local: SQLite for rapid development and testing.
Production: PostgreSQL via Supabase for scalable deployments.
File Uploads:
Local file storage in /public/uploads for development.
Supabase Storage integration for production file uploads.
Responsive UI & Theming: Modern UI built with shadcnUI and Tailwind CSS, including dark mode support.
Filtering & Debounced Search: Filter books by status, category, language; debounced search functionality by title or author.
State Management: Redux (with redux-persist) for managing global state (auth, books, and user data).
Docker Support: A Dockerfile for containerized builds and deployments.
Prisma Migrations & Seeding: Separate migration configurations for local and production environments.
📦 Running the Project
Local Development (SQLite)
Environment Setup:
Create a .env.local file with:
env
Copy
Edit
DATABASE_URL="file:./bookshelf.db"
JWT_SECRET="your-local-secret-key"
JWT_EXPIRES_IN="1h"
Prisma Migrations:
Run:
bash
Copy
Edit
npx prisma migrate dev --schema=./prisma/schema.dev.prisma --name init
npx prisma generate --schema=./prisma/schema.dev.prisma
Start the Development Server:
bash
Copy
Edit
npm run dev
Open http://localhost:3000 in your browser.
Production (Supabase PostgreSQL)
Environment Setup:
Create a .env.production file with:
env
Copy
Edit
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/YOUR_DATABASE?sslmode=require"
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
JWT_SECRET="your-production-secret-key"
JWT_EXPIRES_IN="1h"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
NEXT_PUBLIC_SUPABASE_BUCKET="book-covers"
Prisma Migrations:
Copy production environment to .env and run:
bash
Copy
Edit
cp .env.production .env
npx prisma migrate deploy --schema=./prisma/schema.prod.prisma
npx prisma generate --schema=./prisma/schema.prod.prisma
Deploy on Vercel:
Push your code to GitHub.
In your Vercel dashboard, add the production environment variables.
Vercel will use the production schema during the build.
Your project should now connect to Supabase PostgreSQL in production.
Using Docker
If deploying with Docker, build and run the container:

bash
Copy
Edit
docker build -t bookshelf-manager .
docker run -p 3000:3000 bookshelf-manager
Ensure your Dockerfile uses the production schema and environment variables.

💬 Contributing
Contributions are welcome! Please open an issue or submit a pull request with improvements or bug fixes.

📜 License
This project is licensed under the MIT License.

By following these instructions, you can run Bookshelf Manager locally using SQLite and in production with Supabase PostgreSQL. Enjoy building amazing web solutions and feel free to reach out if you have any questions!


if you want to use supabase use this .env file 

DATABASE_URL="postgresql://postgres.gyzskfbyqbzfopfxejnh:bycpDApaJ2ykYHhg@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="OxsyzWimgiYHFyugzfsZlvduusyw0kHdjinqSMkuV2SNnPEv2zxCRRod6KSUCvn+5n0fwUDQEaFZHTcYXf6UvA=="
JWT_EXPIRES_IN="1h"

and also change the prisma schema datasource to 
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

and then run command 

>npx prisma migrate dev --name
and run npx prisma generate

if you want to use the sqlite use this .env file 
 DATABASE_URL="file:./bookshelf.db"
 JWT_SECRET="3afb0658974a6d4051a3166963544729c790b097c960996f202683a685bad071436de276d6c53afff0583f6db443382247836d90111e416a681354fa366650d1"
 JWT_EXPIRES_IN="1h"

and also change the prisma schema datasoure to

 datasource db {
   provider = "sqlite"
   url      = env("DATABASE_URL")
 }

 >npx prisma migrate dev --name
and run npx prisma generate