import { Book as PrismaBook } from '@prisma/client';

export type BookProgress = {
  currentPage: number;
  userId: string;
  notes: string | null;
};
export type ExtendedBook = PrismaBook & {
  readingProgress?: number;
  progress?: BookProgress;
  currentPage?: number;
  notes?: string | null;
  categories?: { id: string; name: string }[];
};
