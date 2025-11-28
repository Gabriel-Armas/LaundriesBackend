export type UserRole = 'ADMIN' | 'MANAGER' | 'DELETED';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}