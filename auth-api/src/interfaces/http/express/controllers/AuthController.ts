import { Request, Response } from "express";
import { CreateAccountUseCase } from "../../../../application/useCases/CreateAccount/CreateAccountUseCase";
import { LoginUseCase } from "../../../../application/useCases/Login/LoginUseCase";
import { RefreshTokenUseCase } from "../../../../application/useCases/RefreshToken/RefreshTokenUseCase";

export class AuthController {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  register = async (req: Request, res: Response) => {
    try {
      const { email, password, role } = req.body;

      const result = await this.createAccountUseCase.execute({
        email,
        password,
        role,
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
            message: "Email and password are required",
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
