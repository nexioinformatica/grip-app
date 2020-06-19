import Sentry from "./sentry/sentry";
import { init } from "./sentry/sentry";
import { IS_SENTRY_SET_UP } from "./constants";

/**
 * Note: this module is a wrapper for `sentry-expo` and `@sentry/browser`, because the first
 * is not cross platform. See https://github.com/expo/sentry-expo/issues/77.
 *
 * We followed https://github.com/expo/sentry-expo/issues/77#issuecomment-646099545 in order to
 * solve this problem. The solution was to create two files
 *  - sentry.ts
 *  - sentry.web.ts
 * and write there the right sentry import and the specific initialization function for each
 * package. Then in this module we import all from `"./sentry/sentry"` and expo automatically
 * imports the right version of the file.
 *
 * Sentry and the initialization function can be imported from this file.
 */

export default Sentry;

export { init };

// We don't send the following errors to Sentry
const UNTRACKED_ERRORS: string[] = [
  // empty, for now
];

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
