import express from "express";
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

    const app = express();
    app.use(express.json());

    app.get("/", (_req, res) => {
      res.json({ message: "Auth service running" });
    });

    const authRouter = createAuthRouter(
      createAccountUseCase,
      loginUseCase,
      refreshTokenUseCase,
      changeAccountRoleUseCase,
      tokenService
    );
    app.use("/auth", authRouter);

    const PORT = process.env.PORT || 3000;
    app.use("/auth/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.listen(PORT, () => {
      console.log(`Auth service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error during bootstrap:", error);
    process.exit(1);
  }
}

bootstrap();
