import Constants from "expo-constants";

/**
 * The agilecom's api key.
 */
export const API_KEY = Constants.manifest.extra.agilecomApiKey || "test-key";

/**
 * The agilecom's api base url.
 */
export const API_BASE_URL =
  Constants.manifest.extra.agilecomApiBaseUrl || "http://localhost:3000";

/**
 * Whether to use HTTP schema for APIs.
 */
export const API_USE_HTTP: boolean =
  Constants.manifest.extra.agilecomApiUseHttp || false;

/**
 * Number of milliseconds for api request timeout.
 */
export const API_CLIENT_REQUEST_TIMEOUT = 10 * 1000;

/**
 * Number of milliseconds for api connection timeout.
 */
export const API_CLIENT_CONNECTION_TIMEOUT = 15 * 1000;

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
