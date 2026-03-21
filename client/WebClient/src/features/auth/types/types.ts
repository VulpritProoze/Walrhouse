import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const loginRequestSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
