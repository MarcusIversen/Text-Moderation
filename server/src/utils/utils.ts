export async function perhaps<T>(promise: Promise<T>): Promise<[Error | null, T] | [Error, null]> {
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

export const withRetry =
    ({ retryAttempt = 0, maxRetries = 5, lastErrorMessage }: WithRetryArgs = {}): ((fn: Promise<any>) => Promise<any>) =>
        async <T>(fn: Promise<T>): Promise<T> => {
          console.log(`Try number: ${retryAttempt}`);

          if (retryAttempt > maxRetries) {
            throw new Error(lastErrorMessage ?? 'Retry failed too many times...');
          }

          return fn.catch((err: Error) =>
              delay({ waitSeconds: 1 * retryAttempt + 1 }).then(() =>
                  withRetry({
                    retryAttempt: retryAttempt + 1,
                    lastErrorMessage: err.message,
                  })(fn)
              )
          );
        };

interface WithRetryArgs {
  retryAttempt?: number;
  maxRetries?: number;
  lastErrorMessage?: string;
}
