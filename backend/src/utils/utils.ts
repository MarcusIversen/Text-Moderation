import path from "path";
import fs from "fs";
import {Request, Response} from "express";
import {HF_ACCESS_TOKEN} from "../config/config";
import axios from "axios";

interface WithRetryArgs {
    retryAttempt?: number;
    maxRetries?: number;
    lastErrorMessage?: string;
}

/**
 * utility method for handling asynchronous operations with promises.
 * Simplifies error handling by encapsulating resolution and rejection logic in a single promise.
 * Takes a promise and returns a promise that resolves to an array of two elements.
 * Returns [null, result] if the promise resolves successfully, or [error, null] if the promise rejects.
 * @param promise
 */
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

/**
 * Utility method for delaying.
 * @param args
 */
export const delay = (args: { waitSeconds: number }): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), args.waitSeconds * 1000);
    });
};

/**
 * Utility method for retrying.
 * @param retryAttempt
 * @param maxRetries
 * @param lastErrorMessage
 */
export const withRetry =
    ({
         retryAttempt = 0,
         maxRetries = 1,
         lastErrorMessage,
     }: WithRetryArgs = {}) =>
        async <T>(fn: Promise<T>): Promise<T> => {
            console.log(`Try number: ${retryAttempt}`);

            if (retryAttempt > maxRetries) {
                throw new Error(lastErrorMessage ?? "Retry failed too many times...");
            }

            return fn.catch((err: Error) =>
                delay({waitSeconds: 4 * retryAttempt}).then(() =>
                    withRetry({
                        retryAttempt: retryAttempt + 1,
                        lastErrorMessage: err.message,
                    })(fn),
                ),
            );
        };

/**
 * Utility method for making HTTP requests.
 * @param modelUrl
 */
export const modelEndpoint =
    (modelUrl: string) => async (req: Request, res: Response) => {
        const headers = {
            Authorization: `Bearer ${HF_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
        };

        const data = {inputs: req.body.inputs};
        const [myError, myValue] = await perhaps(
            withRetry({})
                     (axios.post(modelUrl, data, {headers})),
        );

        if (myError) {
            res.status(parseInt(myError.message.slice(-3), 10)).json({ //Take last three numbers for a precise error status code using: parseInt(myError.message.slice(-3), 10)
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

    const badWords = await getBadWordsList();
    const wordsFromInput = textInput
        .toLowerCase()
        .split(/[,\s]+/)
        .map((word) => word.replace(/[^\w]|_/g, ""))
        .filter((word) => word.length > 0);  // filter out any empty string or just commas

    return wordsFromInput.filter((word) => badWords.includes(word));
}


export async function getBadWordsList() {
    const filePath = path.join(__dirname, "badWords.txt");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return fileContent.split("\n").map((word) => word.trim());
}
