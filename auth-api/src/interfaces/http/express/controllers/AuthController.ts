import { Request, Response } from "express";
import { CreateAccountUseCase } from "../../../../application/useCases/CreateAccount/CreateAccountUseCase";
import { LoginUseCase } from "../../../../application/useCases/Login/LoginUseCase";
import { RefreshTokenUseCase } from "../../../../application/useCases/RefreshToken/RefreshTokenUseCase";
import { ChangeAccountRoleUseCase } from "../../../../application/useCases/ChangeRole/ChangeAccountRoleUseCase";
import { GetAccountRoleByIdUseCase } from "../../../../application/useCases/GetAccountRoleById/GetAccountRoleByIdUseCase";
import { AuthRequest } from "../middelware/authMiddleware";

export class AuthController {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly changeAccountRoleUseCase: ChangeAccountRoleUseCase,
    private readonly getAccountRoleByIdUseCase: GetAccountRoleByIdUseCase
  ) {}

  register = async (req: AuthRequest, res: Response) => {
    try {
      const { email, password, role } = req.body;

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Missing authenticated user",
          },
        });
      }

      const result = await this.createAccountUseCase.execute({
        email,
        password,
        role,
        actorRole: req.user.role,
      });

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error("Error in register:", error);

      if (error.message === "INVALID_INPUT") {
        return res.status(400).json({
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Email, password, role and actorRole are required",
          },
        });
      }

      if (error.message === "FORBIDDEN_CREATE_ADMIN") {
        return res.status(403).json({
          success: false,
          error: {
            code: "FORBIDDEN_CREATE_ADMIN",
            message: "ADMIN accounts cannot be created",
          },
        });
      }

      if (error.message === "REQUIRES_MANAGER_TO_CREATE_EMPLOYEE") {
        return res.status(403).json({
          success: false,
          error: {
            code: "REQUIRES_MANAGER_TO_CREATE_EMPLOYEE",
            message: "Only MANAGER can create EMPLOYEE accounts",
          },
        });
      }

      if (error.message === "REQUIRES_EMPLOYEE_TO_CREATE_MANAGER") {
        return res.status(403).json({
          success: false,
          error: {
            code: "REQUIRES_EMPLOYEE_TO_CREATE_MANAGER",
            message: "Only EMPLOYEE can create MANAGER accounts",
          },
        });
      }

      if (error.message === "EMAIL_ALREADY_IN_USE") {
        return res.status(409).json({
          success: false,
          error: {
            code: "EMAIL_ALREADY_IN_USE",
            message: "Email is already registered",
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Internal server error",
        },
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const result = await this.loginUseCase.execute({ email, password });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error("Error in login:", error);

      if (error.message === "INVALID_INPUT") {
        return res.status(400).json({
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Email and password are required",
          },
        });
      }

      if (error.message === "INVALID_CREDENTIALS") {
        return res.status(401).json({
          success: false,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password",
          },
        });
      }

      if (error.message === "ACCOUNT_DELETED") {
        return res.status(403).json({
          success: false,
          error: {
            code: "ACCOUNT_DELETED",
            message: "La cuenta está eliminada y no puede iniciar sesión",
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Internal server error",
        },
      });
    }
  };

  refresh = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      const result = await this.refreshTokenUseCase.execute({ refreshToken });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error("Error in refresh:", error);

      if (error.message === "INVALID_INPUT") {
        return res.status(400).json({
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Refresh token is required",
          },
        });
      }

      if (error.message === "INVALID_REFRESH_TOKEN") {
        return res.status(401).json({
          success: false,
          error: {
            code: "INVALID_REFRESH_TOKEN",
            message: "Invalid or expired refresh token",
          },
        });
      }

      if (error.message === "USER_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          error: {
            code: "USER_NOT_FOUND",
            message: "User not found",
          },
        });
      }

      if (error.message === "ACCOUNT_DELETED") {
        return res.status(403).json({
          success: false,
          error: {
            code: "ACCOUNT_DELETED",
            message: "La cuenta está eliminada y no puede iniciar sesión",
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Internal server error",
        },
      });
    }
  };

  getRoleById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const result = await this.getAccountRoleByIdUseCase.execute({
        accountId: id,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      if (error.message === "INVALID_INPUT") {
        return res.status(400).json({
          success: false,
          error: { code: "INVALID_INPUT", message: "Account id is required" },
        });
      }

      if (error.message === "ACCOUNT_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          error: { code: "ACCOUNT_NOT_FOUND", message: "Account not found" },
        });
      }

      if (error.message === "ACCOUNT_DELETED") {
        return res.status(403).json({
          success: false,
          error: { code: "ACCOUNT_DELETED", message: "Account is deleted" },
        });
      }

      return res.status(500).json({
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Internal server error" },
      });
    }
  };

  changeRole = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Missing authenticated user",
          },
        });
      }

      const result = await this.changeAccountRoleUseCase.execute({
        accountId: id,
        newRole: role,
        actorRole: req.user.role,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error("Error in changeRole:", error);

      if (error.message === "INVALID_INPUT") {
        return res.status(400).json({
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Account id, role and actorRole are required",
          },
        });
      }

      if (error.message === "FORBIDDEN_ROLE_CHANGE") {
        return res.status(400).json({
          success: false,
          error: {
            code: "FORBIDDEN_ROLE_CHANGE",
            message: "Only change to DELETED is allowed",
          },
        });
      }

      if (error.message === "ACCOUNT_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          error: {
            code: "ACCOUNT_NOT_FOUND",
            message: "Account not found",
          },
        });
      }

      if (
        error.message === "FORBIDDEN_ACTOR_ROLE" ||
        error.message === "FORBIDDEN_TARGET_ROLE"
      ) {
        return res.status(403).json({
          success: false,
          error: {
            code: error.message,
            message: "You are not allowed to change this account role",
          },
        });
      }

      if (error.message === "ACCOUNT_ALREADY_DELETED") {
        return res.status(403).json({
          success: false,
          error: {
            code: "ACCOUNT_ALREADY_DELETED",
            message: "Account is already DELETED and cannot be modified",
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Internal server error",
        },
      });
    }
  };
}
