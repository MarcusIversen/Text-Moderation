import express from 'express';
import cors from 'cors';
import {setupDatabase} from "./db/setup";
import {createModelEndpoint} from "./api/api";

export const setupApplication = async () => {
  const app = express()

  app.use(cors());
  app.use(express.json());

  app.post('/api/distilbert', createModelEndpoint('https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english'));
  app.post('/api/nsfw', createModelEndpoint('https://api-inference.huggingface.co/models/michellejieli/inappropriate_text_classifier'));
  app.post('/api/moderation', createModelEndpoint('https://api-inference.huggingface.co/models/KoalaAI/Text-Moderation'));
  app.post('/api/contactInfo', createModelEndpoint('https://api-inference.huggingface.co/models/jakariamd/opp_115_privacy_contact_information'));
  app.post('/api/addresses', createModelEndpoint('https://api-inference.huggingface.co/models/ctrlbuzz/bert-addresses'));

  await setupDatabase();

  return app;
}