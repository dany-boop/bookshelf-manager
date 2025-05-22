import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty('Email cannot be empty')
    .email('email must be have @ something')
    .min(3, { message: 'email cannot be empty' }),
  password: z
    .string()
    .nonempty('Password cannot be empty')
    .min(6, { message: 'Password cannot be empty' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
