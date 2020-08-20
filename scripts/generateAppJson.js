#!/usr/bin/env node

/**
 * This script will take the `app.example.json` file from the root folder, and
 * override the default values with ones that are in the environment variables.
 * The output will be `app.json` in the root folder.
 */

/* eslint-disable @typescript-eslint/no-var-requires */

const APP_EXAMPLE_JSON = "app.example.json";
const APP_JSON = "app.json";

require("dotenv").config(); // load .env file by default
const jsonfile = require("jsonfile");
const merge = require("lodash/merge");

const defaultAppJson = require(`../${APP_EXAMPLE_JSON}`);
const pkgJson = require("../package.json");

// script start

console.log("Setting up variables ...");
let names = [
  "SENTRY_PUBLIC_DNS",
  "SENTRY_ORG",
  "SENTRY_PROJECT",
  "SENTRY_AUTH_TOKEN",
  "AGILECOM_API_KEY",
  "AGILECOM_API_BASE_URL",
  "AGILECOM_API_USE_HTTP",
];
let variables = loadVariables(names);

console.log("Checking variable values ...");
checkVariables(variables);

console.log(`Building overrides from ${APP_EXAMPLE_JSON} ...`);
let overrides = buildOverrides(variables);

console.log(`Writing overrides to ${APP_JSON} ...`);
writeAppJson(defaultAppJson, overrides);

console.log("OK");

// script stop

// *******************************************************
// UTILS

/**
 * Load variable from `process.env` with given name.
 * @returns The variable value or undefined
 */
function loadVariable(name) {
  return process.env[name];
}

/**
 * Foreach name in names call `loadVariable` and return an object with variables key values.
 * @param array names Name or variables to load
 * @returns An object `{varName1: varValue1, varName2: varValue2, ...}`
 */
function loadVariables(names) {
  let variables = {};
  for (let i = 0; i < names.length; i++) {
    let name = names[i];
    variables = { ...variables, [name]: loadVariable(name) };
  }
  return variables;
}

/**
 * @param {*} variable The variable value
 * @returns True whether the variable value is present, false if it is null or undefined
 */
function isFound(value) {
  return value ? true : false;
}

/**
 * Check whether variables are defined. If not, throw an error.
 * @param {*} variables
 */
function checkVariables(variables) {
  Object.entries(variables).forEach(([name, value]) => {
    let found = isFound(value);
    console.log("  " + (found ? "found" : "not found") + " " + name);

    if (!found)
      throw new Error("The variable " + name + " is null or undefined.");
  });
}

/**
 * Produce the overrides object with values from variables.
 * @param {*} variables An object with variables key values.
 */
function buildOverrides(variables) {
  const overrides = {
    expo: {
      extra: {
        sentryPublicDsn: variables.SENTRY_PUBLIC_DNS || null,
        agilecomApiKey: variables.AGILECOM_API_KEY || null,
        agilecomApiBaseUrl: variables.AGILECOM_API_BASE_URL || null,
        agilecomApiUseHttp: variables.AGILECOM_API_USE_HTTP || false,
      },
      hooks: {
        postPublish: [
          {
            file: "sentry-expo/upload-sourcemaps",
            config: {
              organization: variables.SENTRY_ORG || null,
              project: variables.SENTRY_PROJECT || null,
              authToken: variables.SENTRY_AUTH_TOKEN || null,
            },
          },
        ],
      },
      version: pkgJson.version,
    },
  };
  return overrides;
}

/**
 * Write the `app.json` file with overrides from env variables.
 * @param {*} defaultAppJson
 * @param {*} overrides
 */
function writeAppJson(defaultAppJson, overrides) {
  jsonfile.writeFileSync(APP_JSON, merge(defaultAppJson, overrides));
}
