import express from "express";
import cors from "cors";
import { setupDatabase } from "./db/setup";
import { modelEndpoint } from "./api/endpoints";
import userRoutes from "./routes/userRoutes";

export const setupApplication = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api", userRoutes);

  app.post(
    "/api/distilbert",
    modelEndpoint(
      "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
    ),
  );
  app.post(
    "/api/nsfw",
    modelEndpoint(
      "https://api-inference.huggingface.co/models/michellejieli/inappropriate_text_classifier",
    ),
  );
  app.post(
    "/api/moderation",
    modelEndpoint(
      "https://api-inference.huggingface.co/models/KoalaAI/Text-Moderation",
    ),
  );
  app.post(
    "/api/contactInfo",
    modelEndpoint(
      "https://api-inference.huggingface.co/models/jakariamd/opp_115_privacy_contact_information",
    ),
  );

  await setupDatabase();

  return app;
};
