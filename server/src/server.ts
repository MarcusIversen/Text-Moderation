import express from "express";
import cors from "cors";
import {migrateDB} from "./db/setup";
import { modelEndpoint } from "./api/endpoints";
import userRoutes from "./routes/userRoutes";

export const setupApplication = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api", userRoutes);

  await migrateDB();

  return app;
};
