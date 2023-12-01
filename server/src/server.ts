import express from "express";
import cors from "cors";
import { setupDatabase } from "./db/setup";
import userRoutes from "./routes/userRoutes";

export const setupApplication = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api", userRoutes);

  await setupDatabase();

  return app;
};
