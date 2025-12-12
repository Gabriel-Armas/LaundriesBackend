import express from "express";
import cors from "cors";
import { sequelize } from "./infrastructure/db/sequelize/sequelize";
import "./infrastructure/db/sequelize/AccountModel";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

import { AccountRepositorySequelize } from "./infrastructure/db/sequelize/AccountRepositorySequelize";
import { BcryptCryptographyService } from "./infrastructure/services/cryptography/BcryptCryptographyService";
import { CreateAccountUseCase } from "./application/useCases/CreateAccount/CreateAccountUseCase";
import { createAuthRouter } from "./interfaces/http/express/routes/authRoutes";
import { LoginUseCase } from "./application/useCases/Login/LoginUseCase";
import { RefreshTokenUseCase } from "./application/useCases/RefreshToken/RefreshTokenUseCase";
import { JwtTokenService } from "./infrastructure/services/jwt/JwtTokenService";
import { ChangeAccountRoleUseCase } from "./application/useCases/ChangeRole/ChangeAccountRoleUseCase";
import { GetAccountRoleByIdUseCase } from "./application/useCases/GetAccountRoleById/GetAccountRoleByIdUseCase";

async function bootstrap() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database");

    await sequelize.sync({ alter: true });
    console.log("Database synchronized");

    const accountRepository = new AccountRepositorySequelize();
    const cryptoService = new BcryptCryptographyService();
    const tokenService = new JwtTokenService();

    const createAccountUseCase = new CreateAccountUseCase(
      accountRepository,
      cryptoService
    );

    const loginUseCase = new LoginUseCase(
      accountRepository,
      cryptoService,
      tokenService
    );

    const refreshTokenUseCase = new RefreshTokenUseCase(
      accountRepository,
      tokenService
    );

    const changeAccountRoleUseCase = new ChangeAccountRoleUseCase(
      accountRepository
    );

    const getAccountRoleByIdUseCase = new GetAccountRoleByIdUseCase(
      accountRepository
    );

    const app = express();

    app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    app.use(express.json());

    app.get("/", (_req, res) => {
      res.json({ message: "Auth service running" });
    });

    // ✅ Ahora sí: 6 argumentos (incluye getAccountRoleByIdUseCase y tokenService)
    const authRouter = createAuthRouter(
      createAccountUseCase,
      loginUseCase,
      refreshTokenUseCase,
      changeAccountRoleUseCase,
      getAccountRoleByIdUseCase,
      tokenService
    );

    app.use("/auth", authRouter);

    app.use("/auth/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    const PORT = Number(process.env.PORT) || 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Auth service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error during bootstrap:", error);
    process.exit(1);
  }
}

bootstrap();
