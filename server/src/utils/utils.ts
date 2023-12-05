import path from "path";
import fs from "fs";
import {Request, Response} from "express";
import {HF_ACCESS_TOKEN} from "../config/config";
import axios from "axios"

interface WithRetryArgs {
  retryAttempt?: number;
  maxRetries?: number;
  lastErrorMessage?: string;
}

export async function perhaps<T>(
    promise: Promise<T>,
): Promise<[Error | null, T] | [Error, null]> {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    return [error as Error, null];
  }
}

export const delay = (args: { waitSeconds: number }): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), args.waitSeconds * 1000);
  });
};

/**
 * Utility method for retrying, used for http requests
 * @param retryAttempt
 * @param maxRetries
 * @param lastErrorMessage
 */
export const withRetry =
    ({
       retryAttempt = 0,
       maxRetries = 10,
       lastErrorMessage,
     }: WithRetryArgs = {}) =>
        async <T>(fn: Promise<T>): Promise<T> => {
          console.log(`Try number: ${retryAttempt}`);

          if (retryAttempt > maxRetries) {
            throw new Error(lastErrorMessage ?? "Retry failed too many times...");
          }

          return fn.catch((err: Error) =>
              delay({waitSeconds: 2 * retryAttempt + 1}).then(() =>
                  withRetry({
                    retryAttempt: retryAttempt + 1,
                    lastErrorMessage: err.message,
                  })(fn),
              ),
          );
        };

export const modelEndpoint =
    (modelUrl: string) => async (req: Request, res: Response) => {
      const headers = {
        Authorization: `Bearer ${HF_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      };

      const data = {inputs: req.body.inputs};
      const [myError, myValue] = await perhaps(
          withRetry({})(axios.post(modelUrl, data, {headers})),
      );

      if (myError) {
        res.status(500).json({
          error: myError.message,
        });
        return;
      }

      if (!myValue) {
        res.status(404).json({
          error: "Not found",
        });
        return;
      }

      res.json(myValue.data);
      return;
    };

/**
 * Method for displaying the bad words found in input, in an array.
 * .split(/[,\s]+/) Regular Expression (RegEx) to split by commas and or whitespace
 * replace(/[^\w]/g, '') RegEx to remove non-word characters from each word
 * @param textInput
 */
export async function getBadWordsFromInput(textInput: string) {
  if (!textInput) {
    return [];
  }

  const badWords = getBadWordsList();
  const wordsFromInput = textInput
      .toLowerCase()
      .split(/[,\s]+/)
      .map((word) => word.replace(/[^\w]/g, ""));

  return wordsFromInput.filter((word) => badWords.includes(word));
}

/**
 * Boolean method for checking bad words
 * .split(/[,\s]+/) Regular Expression (RegEx) to split by commas and or whitespace
 * replace(/[^\w]/g, '') RegEx to remove non-word characters from each word
 * @param textInput
 */
export async function hasBadWords(textInput: string) {
  if (!textInput) {
    return false;
  }

  const badWords = getBadWordsList();
  const wordsFromInput = textInput
      .toLowerCase()
      .split(/[,\s]+/)
      .map((word) => word.replace(/[^\w]/g, ""));

  for (const word of wordsFromInput) {
    if (badWords.includes(word)) {
      return true;
    }
  }
  return false;
}

export function getBadWordsList() {
  const filePath = path.join(__dirname, "badWords.txt");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return fileContent.split("\n").map((word) => word.trim());
}