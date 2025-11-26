import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { CreateAccountUseCase } from "../../../../application/useCases/CreateAccount/CreateAccountUseCase";
import { LoginUseCase } from "../../../../application/useCases/Login/LoginUseCase";
import { RefreshTokenUseCase } from "../../../../application/useCases/RefreshToken/RefreshTokenUseCase";

export function createAuthRouter(
  createAccountUseCase: CreateAccountUseCase,
  loginUseCase: LoginUseCase,
  refreshTokenUseCase: RefreshTokenUseCase
) {
  const router = Router();
  const controller = new AuthController(
    createAccountUseCase,
    loginUseCase,
    refreshTokenUseCase
  );

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Crea una nueva cuenta de usuario
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 example: "user@example.com"
   *               password:
   *                 type: string
   *                 example: "MiClaveSegura123"
   *               role:
   *                 type: string
   *                 example: "EMPLOY"
   *     responses:
   *       201:
   *         description: Cuenta creada correctamente
   *       409:
   *         description: Email ya registrado
   */
  router.post("/register", controller.register);

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Inicia sesión con email y contraseña
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 example: "user@example.com"
   *               password:
   *                 type: string
   *                 example: "MiClaveSegura123"
   *     responses:
   *       200:
   *         description: Login exitoso
   *       400:
   *         description: Datos inválidos
   *       401:
   *         description: Credenciales inválidas
   */
  router.post("/login", controller.login);

  /**
   * @swagger
   * /auth/refresh:
   *   post:
   *     summary: Renueva el access token usando el refresh token
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - refreshToken
   *             properties:
   *               refreshToken:
   *                 type: string
   *                 example: "eyJhbGciOi..."
   *     responses:
   *       200:
   *         description: Tokens renovados
   *       400:
   *         description: Token faltante
   *       401:
   *         description: Token inválido o expirado
   *       404:
   *         description: Usuario no existe
   */
  router.post("/refresh", controller.refresh);

  return router;
}
