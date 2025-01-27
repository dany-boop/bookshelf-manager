/*
  Warnings:

  - You are about to drop the `BookDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `detailId` on the `Book` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "BookDetail_bookId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BookDetail";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "author" TEXT NOT NULL,
    "pages" INTEGER,
    "language" TEXT,
    "status" TEXT NOT NULL,
    "coverImage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Book_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Book" ("author", "coverImage", "createdAt", "id", "status", "title", "updatedAt", "userId") SELECT "author", "coverImage", "createdAt", "id", "status", "title", "updatedAt", "userId" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
