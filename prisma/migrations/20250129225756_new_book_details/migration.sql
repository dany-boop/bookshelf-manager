/*
  Warnings:

  - Made the column `category` on table `Book` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "author" TEXT NOT NULL,
    "pages" INTEGER,
    "language" TEXT,
    "isbn" TEXT,
    "publication_date" DATETIME,
    "publication_place" TEXT,
    "status" TEXT NOT NULL,
    "coverImage" TEXT,
    "pdf" TEXT,
    "publisher" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Book_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Book" ("author", "category", "coverImage", "createdAt", "description", "id", "language", "pages", "status", "title", "updatedAt", "userId") SELECT "author", "category", "coverImage", "createdAt", "description", "id", "language", "pages", "status", "title", "updatedAt", "userId" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
