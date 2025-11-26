import { Request, Response } from "express";
import { CreateAccountUseCase } from "../../../../application/useCases/CreateAccount/CreateAccountUseCase";

export class AuthController {
  constructor(private readonly createAccountUseCase: CreateAccountUseCase) {}

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
}
