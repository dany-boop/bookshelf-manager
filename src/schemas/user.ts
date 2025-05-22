import { z } from 'zod';

export const userSchema = z.object({
  username: z
    .string()
    .nonempty('Username cannot be empty')
    .min(3, { message: 'Username must be at least 3 characters' }),
  email: z
    .string()
    .nonempty('Email cannot be empty')
    .email('email must be have @ something')
    .min(3, { message: 'email must be at least 3 characters' }),
  password: z.string().optional(),
  photo_url: z.any().optional(),
});

export type UserValues = z.infer<typeof userSchema>;
