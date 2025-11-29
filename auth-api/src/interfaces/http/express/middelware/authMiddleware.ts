import { Request, Response, NextFunction } from "express";
import { JwtTokenService } from "../../../../infrastructure/services/jwt/JwtTokenService";

export type Role = "ADMIN" | "MANAGER" | "EMPLOYEE" | "DELETED";

export interface AuthUser {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export function requireAuth(tokenService: JwtTokenService) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers["authorization"];

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Missing or invalid Authorization header",
          },
        });
      }

      const token = authHeader.substring("Bearer ".length);

      const payload = tokenService.verifyAccessToken(token);

      if (!payload || !payload.role) {
        return res.status(401).json({
          success: false,
          error: {
            code: "INVALID_TOKEN",
            message: "Invalid access token",
          },
        });
      }

      const allowedRoles: Role[] = ["ADMIN", "MANAGER", "EMPLOYEE", "DELETED"];
      if (!allowedRoles.includes(payload.role as Role)) {
        return res.status(401).json({
          success: false,
          error: {
            code: "INVALID_ROLE",
            message: "Role in token is not allowed",
          },
        });
      }

      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role as Role,
      };

      next();
    } catch (error) {
      console.error("Error in requireAuth middleware:", error);
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_TOKEN",
          message: "Invalid or expired access token",
        },
      });
    }
  };
}
