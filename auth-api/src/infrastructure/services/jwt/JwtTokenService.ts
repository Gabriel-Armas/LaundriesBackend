import jwt, { JwtPayload } from "jsonwebtoken";
import {
  AuthTokenPayload,
  ITokenService,
} from "../../../application/ports/services/ITokenService";
import dotenv from "dotenv";

dotenv.config();

const accessSecretEnv = process.env.JWT_ACCESS_SECRET;
const refreshSecretEnv = process.env.JWT_REFRESH_SECRET;
const accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

if (!accessSecretEnv || !refreshSecretEnv) {
  throw new Error("JWT secrets are not defined in .env");
}

const ACCESS_SECRET: string = accessSecretEnv;
const REFRESH_SECRET: string = refreshSecretEnv;

const jwtAny: any = jwt;

export class JwtTokenService implements ITokenService {
  generateAccessToken(payload: AuthTokenPayload): string {
    return jwtAny.sign(payload, ACCESS_SECRET, {
      expiresIn: accessExpiresIn,
    });
  }

  generateRefreshToken(payload: AuthTokenPayload): string {
    return jwtAny.sign(payload, REFRESH_SECRET, {
      expiresIn: refreshExpiresIn,
    });
  }

  verifyAccessToken(token: string): AuthTokenPayload | null {
    try {
      const decoded = jwtAny.verify(token, ACCESS_SECRET) as JwtPayload;

      return {
        userId: decoded.userId as string,
        email: decoded.email as string,
        role: decoded.role as string,
      };
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token: string): AuthTokenPayload | null {
    try {
      const decoded = jwtAny.verify(token, REFRESH_SECRET) as JwtPayload;

      return {
        userId: decoded.userId as string,
        email: decoded.email as string,
        role: decoded.role as string,
      };
    } catch {
      return null;
    }
  }
}
