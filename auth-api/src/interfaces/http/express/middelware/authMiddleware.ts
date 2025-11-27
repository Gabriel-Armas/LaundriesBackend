import { Request, Response, NextFunction } from "express";
import { JwtTokenService } from "../../../../infrastructure/services/jwt/JwtTokenService";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export function requireAdmin(tokenService: JwtTokenService) {
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

      if (payload.role !== "ADMIN") {
        return res.status(403).json({
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Only ADMIN users can change roles",
          },
        });
      }

      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };

      next();
    } catch (error) {
      console.error("Error in requireAdmin middleware:", error);
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
