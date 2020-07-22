import React from "react";
import { AuthContext } from "./auth";
import Enzyme, { mount, shallow } from "enzyme";
import { Screens } from "../Screens";
import { pipe } from "fp-ts/lib/pipeable";
import * as E from "fp-ts/lib/Either";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import { Login, Token, User } from "../types";
import { noop } from "../util/noop";

// WIP: use this guide!
// https://medium.com/@ryandrewjohnson/unit-testing-components-using-reacts-new-context-api-4a5219f4b3fe

// const getAuthContext = (context = {user: undefined, login: ()})

describe("<Screens />", () => {
  it("shows the login page if no user is logged in", () => {});
});
