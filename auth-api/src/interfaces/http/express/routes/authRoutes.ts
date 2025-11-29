import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { CreateAccountUseCase } from "../../../../application/useCases/CreateAccount/CreateAccountUseCase";
import { LoginUseCase } from "../../../../application/useCases/Login/LoginUseCase";
import { RefreshTokenUseCase } from "../../../../application/useCases/RefreshToken/RefreshTokenUseCase";
import { ChangeAccountRoleUseCase } from "../../../../application/useCases/ChangeRole/ChangeAccountRoleUseCase";
import { JwtTokenService } from "../../../../infrastructure/services/jwt/JwtTokenService";
import { requireAuth } from "../middelware/authMiddleware";

export function createAuthRouter(
  createAccountUseCase: CreateAccountUseCase,
  loginUseCase: LoginUseCase,
  refreshTokenUseCase: RefreshTokenUseCase,
  changeAccountRoleUseCase: ChangeAccountRoleUseCase,
  tokenService: JwtTokenService
) {
  const router = Router();
  const controller = new AuthController(
    createAccountUseCase,
    loginUseCase,
    refreshTokenUseCase,
    changeAccountRoleUseCase
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
  router.post("/register", requireAuth(tokenService), controller.register);

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

  /**
   * @swagger
   * /auth/{id}/role:
   *   patch:
   *     summary: Cambia el rol de una cuenta (solo ADMIN)
   *     description: |
   *       Actualiza el rol de un usuario identificado por su ID.
   *       **Requiere un token de acceso válido y con rol `ADMIN`.**
   *     tags: [Auth]
   *
   *     security:
   *       - bearerAuth: []
   *
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID del usuario cuyo rol será actualizado
   *         schema:
   *           type: string
   *           format: uuid
   *
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - role
   *             properties:
   *               role:
   *                 type: string
   *                 description: Nuevo rol para el usuario
   *                 example: "EMPLOY"
   *
   *     responses:
   *       200:
   *         description: Rol actualizado correctamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                       example: "76703654-deb0-4f31-8ad3-0802eb51cfaf"
   *                     email:
   *                       type: string
   *                       example: "user@example.com"
   *                     role:
   *                       type: string
   *                       example: "EMPLOY"
   *
   *       400:
   *         description: |
   *           Datos inválidos — por ejemplo:
   *           - Falta el campo role
   *           - role no permitido
   *
   *       401:
   *         description: Token faltante o inválido
   *
   *       403:
   *         description: El usuario autenticado no tiene permisos (debe ser ADMIN)
   *
   *       404:
   *         description: Usuario no encontrado
   *
   *       500:
   *         description: Error interno del servidor
   */
  router.patch("/:id/role", requireAuth(tokenService), controller.changeRole);

  return router;
}
