import * as Sentry from "@sentry/browser";
import Constants from "expo-constants";
import { IS_SENTRY_SET_UP, RELEASE_CHANNEL } from "../constants";

export default Sentry;

/**
 * Initialize Sentry for web.
 */
export function init(): void {
  if (IS_SENTRY_SET_UP) {
    Sentry.init({
      dsn: Constants.manifest.extra.sentryPublicDsn,
      debug: true,
      release: RELEASE_CHANNEL,
    });

    if (Constants.manifest.revisionId) {
      Sentry.setExtra("sisRevisionId", Constants.manifest.revisionId);
    }
  }
}
