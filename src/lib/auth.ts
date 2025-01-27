import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Compare password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a JWT with user id and role.
 * @param payload - Object containing user id and role.
 * @returns JWT string.
 */
// Generate JWT
export function generateToken(userId: string, username: string): string {
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  return jwt.sign({ userId, username }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

/**
 * Verify a JWT token.
 * @param token - JWT string.
 * @returns Decoded token payload.
 */
// Verify JWT
export function verifyToken(token: string): string | jwt.JwtPayload {
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  console.log('Generated Token:', token);
  return jwt.verify(token, process.env.JWT_SECRET!);
}
