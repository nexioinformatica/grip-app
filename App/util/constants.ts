import Constants from "expo-constants";

/**
 * The agilecom's api key.
 */
export const API_KEY = Constants.manifest.extra.agilecomApiKey || "test-key";

/**
 * The agilecom's api base url.
 */
export const BASE_URL =
  Constants.manifest.extra.agilecomApiBaseUrl || "http://localhost:3000";
// export const BASE_URL = "https://api.agilecom.it:8443";
// export const BASE_URL = "http://localhost:3000";

/**
 * Value of a second in millisconds.
 */
export const SECOND_MS = 1000;

/**
 * Number of seconds for api request timeout.
 */
export const API_CLIENT_TIMEOUT = 10 * SECOND_MS;

/**
 * The current release channel. Can be one of `development`, `default` or
 * `production-v{version}`.
 */
export const RELEASE_CHANNEL: string =
  Constants.manifest.releaseChannel || "development";

/**
 * Whether we're running a staging version of the app
 */
export const IS_STAGING = RELEASE_CHANNEL === "default";

/**
 * Whether we're running a production version of the app
 */
export const IS_PROD = RELEASE_CHANNEL.startsWith("production-v");

/**
 * Whether or not we should set up Sentry bug tracking
 */
export const IS_SENTRY_SET_UP =
  // We also added sentry on staging btw
  (IS_PROD || IS_STAGING) &&
  typeof Constants.manifest.extra.sentryPublicDsn === "string";
