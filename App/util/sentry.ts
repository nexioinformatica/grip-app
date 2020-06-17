import * as Sentry from "sentry-expo";

import { IS_SENTRY_SET_UP } from "./constants";

// We don't send the following errors to Sentry
const UNTRACKED_ERRORS: string[] = [];

/**
 * Send an error to Sentry.
 *
 * @see https://sentry.io
 * @param error - The error to send
 */
export function sentryError(namespace: string) {
  return function (error: Error): void {
    if (
      IS_SENTRY_SET_UP &&
      !UNTRACKED_ERRORS.some((msg) => error.message.includes(msg))
    ) {
      Sentry.captureException(error);
    }

    console.log(`[${namespace}]: ${error.message}`);
  };
}
