#!/usr/bin/env node

/**
 * This script will take the `app.example.json` file from the root folder, and
 * override the default values with ones that are in the environment variables.
 * The output will be `app.json` in the root folder.
 */

/* eslint-disable @typescript-eslint/no-var-requires */

require("dotenv").config();
const jsonfile = require("jsonfile");
const merge = require("lodash/merge");

const defaultAppJson = require("../app.example.json");
const pkgJson = require("../package.json");

const overrides = {
  expo: {
    extra: {
      sentryPublicDsn: process.env.SENTRY_PUBLIC_DNS || null,
      agilecomApiKey: process.env.AGILECOM_API_KEY || null,
      agilecomApiBaseUrl: process.env.AGILECOM_API_BASE_URL || null,
    },
    hooks: {
      postPublish: [
        {
          file: "sentry-expo/upload-sourcemaps",
          config: {
            organization: process.env.SENTRY_ORG || null,
            project: process.env.SENTRY_PROJECT || null,
            authToken: process.env.SENTRY_AUTH_TOKEN || null,
          },
        },
      ],
    },
    version: pkgJson.version,
  },
};

jsonfile.writeFileSync("app.json", merge(defaultAppJson, overrides));
