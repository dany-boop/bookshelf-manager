import { BookStatus } from '@prisma/client';
import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  categories: z.array(z.string()).min(1, 'categories is required'),
  status: z.nativeEnum(BookStatus, {
    errorMap: () => ({ message: 'Status is required' }),
  }),
  description: z.string().optional(),
  publisher: z.string().optional(),
  publication_place: z.string().optional(),

  isbn: z
    .string()
    .min(1, 'ISBN is required')
    .refine(
      (val) => !val || /^(?:\d{9}X|\d{10}|\d{13})$/.test(val.replace(/-/g, '')),
      {
        message: 'Invalid ISBN! Must be ISBN-10 or ISBN-13 format.',
      }
    ),

  pages: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), {
      message: 'Pages must be a valid number.',
    }),

  currentPage: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), {
      message: 'Current Page must be a valid number.',
    }),

  language: z.string().optional(),

  coverImage: z
    .any()
    .optional()
    .refine(
      (files) =>
        !files ||
        (files instanceof FileList && files.length === 0) ||
        (files instanceof FileList && files[0].size <= 5 * 1024 * 1024),
      {
        message: 'Cover image must be smaller than 5MB.',
      }
    )
    .refine(
      (files) =>
        !files ||
        (files instanceof FileList && files.length === 0) ||
        (files instanceof FileList &&
          ['image/jpeg', 'image/png', 'image/webp'].includes(files[0].type)),
      {
        message: 'Cover image must be in JPG, PNG, or WEBP format.',
      }
    ),
});

export type BookFromValues = z.infer<typeof bookSchema>;
