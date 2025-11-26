import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { CreateAccountUseCase } from "../../../../application/useCases/CreateAccount/CreateAccountUseCase";

export function createAuthRouter(createAccountUseCase: CreateAccountUseCase) {
  const router = Router();
  const controller = new AuthController(createAccountUseCase);

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
   *                     email:
   *                       type: string
   *                     role:
   *                       type: string
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *       400:
   *         description: Datos inválidos
   *       409:
   *         description: Email ya registrado
   *       500:
   *         description: Error interno del servidor
   */
  router.post("/register", controller.register);
  router.post("/register", controller.register);

  return router;
}
