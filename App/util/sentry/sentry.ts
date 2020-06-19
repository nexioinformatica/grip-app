import * as Sentry from "sentry-expo";
import Constants from "expo-constants";
import { IS_SENTRY_SET_UP, RELEASE_CHANNEL } from "../constants";

export default Sentry;

/**
 * Initialize Sentry.
 */
export function init(): void {
  if (IS_SENTRY_SET_UP) {
    Sentry.init({
      dsn: Constants.manifest.extra.sentryPublicDsn,
      enableInExpoDevelopment: true,
      debug: true,
      release: RELEASE_CHANNEL,
    });

    if (Constants.manifest.revisionId) {
      Sentry.setExtra("sisRevisionId", Constants.manifest.revisionId);
    }
  }
}
