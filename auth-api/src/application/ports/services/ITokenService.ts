export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface ITokenService {
  generateAccessToken(payload: AuthTokenPayload): string;
  generateRefreshToken(payload: AuthTokenPayload): string;

  verifyAccessToken(token: string): AuthTokenPayload | null;
  verifyRefreshToken(token: string): AuthTokenPayload | null;
}
