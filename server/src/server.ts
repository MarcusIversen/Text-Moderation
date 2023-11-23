import express from "express";
import cors from "cors";
import { setupDatabase } from "./db/setup";
import userRoutes from "./routes/routes";

export const setupApplication = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/routes", userRoutes);

  await setupDatabase();

  return app;
};
