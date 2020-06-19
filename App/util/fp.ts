import { Lazy } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";

/**
 * @param z Default value.
 * @param o An option value.
 * @returns The value in the option `o` if any, the one in `z` otherwise.
 */
export const foldDefault = <T>(z: T) => (o: O.Option<T>): T =>
  pipe(
    o,
    O.fold(
      () => z,
      (x) => x
    )
  );

/** Print the value on the console and return it. */
export const log = <T>(x: T): T => {
  console.log(x);
  return x;
};
