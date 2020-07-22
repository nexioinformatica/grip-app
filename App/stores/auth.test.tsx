import React from "react";
import { AuthContextProvider } from "./auth";
import Enzyme, { mount } from "enzyme";

// WIP: use this guide!
// https://medium.com/@ryandrewjohnson/unit-testing-components-using-reacts-new-context-api-4a5219f4b3fe

describe("Foo", () => {
  it("Bar", () => {
    expect(1).toBe(1);
  });
});

// describe("<AuthContext />", () => {
//   it("manage login status", () => {
//     const wrapper = mount(
//       <AuthContextProvider>
//         <></>
//       </AuthContextProvider>
//     );
//     // expect(x).toBe(1);
//   });
// });
