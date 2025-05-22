import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .nonempty('Username cannot be empty')
    .min(3, { message: 'Username must be at least 3 characters' }),
  email: z
    .string()
    .nonempty('Email cannot be empty')
    .email('email must be have @ something')
    .min(3, { message: 'email must be at least 3 characters' }),
  password: z
    .string()
    .nonempty('Password cannot be empty')
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
