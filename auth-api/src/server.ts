import express from "express";
import { sequelize } from "./infrastructure/db/sequelize/sequelize";
import "./infrastructure/db/sequelize/AccountModel";
//import authRoutes from "./interfaces/http/express/routes/authRoutes";

async function bootstrap() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database");
    await sequelize.sync({ alter: true });
    console.log("Database synchronized");

    const app = express();
    app.use(express.json());

    app.get("/", (_req, res) => {
      res.json({ message: "Auth service running" });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Auth service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error during bootstrap:", error);
    process.exit(1);
  }
}

bootstrap();
