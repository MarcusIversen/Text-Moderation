import * as dotenv from 'dotenv';
import axios from 'axios';
import express from 'express';
import cors from 'cors';
import {Request, Response} from 'express';
import {drizzle} from "drizzle-orm/postgres-js";
import {migrate} from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";


const HF_ACCESS_TOKEN = process.env.HF_ACCESS_TOKEN;
const PORT = process.env.PORT || 3000;
const connectionString = process.env.DATABASE_URL!

const sql = postgres(connectionString, {max: 1})
const db = drizzle(sql);
dotenv.config();


const createModelEndpoint = (modelUrl: any) => async (req: Request, res: Response) => {
  const headers = {
    Authorization: `Bearer ${HF_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };

  const data = { inputs: req.body.inputs };

  /**
   *  Attempt to make a POST request to the given modelUrl with data and headers, using error handling function 'perhaps'
   *  and 'withRetry' function for potential retries
   */
  const [myError, myValue] = await
      perhaps(withRetry({})(axios.post(modelUrl, data, {headers})));

  if (myError) {
    res.status(500).json({
      error: myError.message
    })
    return;
  }

  if (!myValue) {
    res.status(404).json({
      error: 'Not found'
    })
    return;
  }

  res.json(myValue.data);
  return;
};

/**
 *  Function that attempts to execute a promise, and returns either the result value or the error encountered
 */
export async function perhaps<T>(
    promise: Promise<T>
): Promise<[Error | null, T] | [Error, null]> {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    return [error as Error, null];
  }
}


/**
 * Simple delay function
 */
export const delay = (args: { waitSeconds: number }): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), args.waitSeconds * 1000);
  });
};

type WithRetryArgs = {
  retryAttempt?: number;
  maxRetries?: number;
  lastErrorMessage?: string;
};

/**
 * Simple retry function with crude incremental backoff
 */
export const withRetry =
    ({retryAttempt = 0, maxRetries = 5, lastErrorMessage}: WithRetryArgs) =>
        async <T>(fn: Promise<T>): Promise<T> => {
          console.log(`Try number: ${retryAttempt}`)

          if (retryAttempt > maxRetries) {
            throw new Error(lastErrorMessage ?? 'Retry failed too many times...');
          }

          return fn.catch((err: Error) =>
              delay({waitSeconds: 1 * retryAttempt + 1}).then(() =>
                  withRetry({
                    retryAttempt: retryAttempt + 1,
                    lastErrorMessage: err.message,
                  })(fn)
              )
          );
        };


const setupApplication = async () => {
  // Doing some setup stuff
  const app = express()

  app.use(cors());
  app.use(express.json());

  app.post('/api/distilbert', createModelEndpoint('https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english'));
  app.post('/api/nsfw', createModelEndpoint('https://api-inference.huggingface.co/models/michellejieli/inappropriate_text_classifier'));
  app.post('/api/moderation', createModelEndpoint('https://api-inference.huggingface.co/models/KoalaAI/Text-Moderation'));
  app.post('/api/contactInfo', createModelEndpoint('https://api-inference.huggingface.co/models/jakariamd/opp_115_privacy_contact_information'));
  app.post('/api/addresses', createModelEndpoint('https://api-inference.huggingface.co/models/ctrlbuzz/bert-addresses'));

  await migrate(db, {migrationsFolder: "drizzle"});

  return app;
}


setupApplication().then((app) => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})














