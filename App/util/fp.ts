import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import * as A from "fp-ts/lib/Array";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";

/**
 * @param z Default value
 * @param o An option value
 * @returns The value in the option `o` if any, the one in `z` otherwise
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

/** @returns Whether the given value is undefined or not */
export const isUndefined = <T>(x: T): boolean => x === undefined;

/** @returns Whether give string is the empty string */
export const isEps = (x: string): boolean => x === "";

/** @returns Whether every element of given `xs` array satifies the predicate `p` */
export const allTrue = <T>(p: (x: T) => boolean) => (xs: T[]): boolean => {
  return pipe(
    xs,
    A.reduce<T, boolean>(true, (b: boolean, a: T) => b && p(a))
  );
};

/**
 * Do a side effect by calling `f` and return the value `z`.
 * @returns The original value
 */
export const sideVoid = <U, T>(f: () => T) => (z: U) => {
  f();
  return z;
};

/**
 * Do a side effect by calling `f` with param `x` and return the value `z`.
 * @returns The original value
 */
export const side = <U, T1, T2>(f: (x: T1) => T2, x: T1) => (z: U) => {
  f(x);
  return z;
};

/**
 * Add a the property with name `name` and value `value` to the object
 * `values` is `value` is not undefined.
 *
 * @example
 * ```
 * pipe(
 *   {},
 *   addProp(name: "John"),
 *   addProp(age, undefined)
 * )
 *
 * // Output: {name: "John"}
 * ```
 */
export const addProp = <T>(name: string, value?: T) => <U>(
  values: Partial<Record<string, U>>
): Partial<Record<string, U | T>> => ({
  ...values,
  ...pipe(
    value,
    O.fromNullable,
    O.fold(
      () => ({}),
      (x) => ({ [name]: x })
    )
  ),
});

export const aHead = A.head;
export const oFromNullable = O.fromNullable;
export const oFold = O.fold;
export const teFold = TE.fold;
export const tNever = T.never;
export const tOf = T.of;
export const tUndefined = T.of(undefined);
