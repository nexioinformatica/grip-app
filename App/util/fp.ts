import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";

/** Print the value on the console and return it. */
export const log = <T>(x: T): T => {
  console.log(x);
  return x;
};

/** @returns Whether `x` is undefined or not */
export const isUndefined = <T>(x: T): boolean => x === undefined;

/** @returns Whether `x` is the empty string */
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
 * @returns `z`
 */
export const sideVoid = <U, T>(f: () => T) => (z: U): U => {
  f();
  return z;
};

/**
 * Do a side effect by calling `f` with param `x` and return the value `z`.
 * @returns `z`
 */
export const side = <T, U, V>(f: (x: U) => V, x: U) => (z: T): T => {
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
export const oFold = O.fold;
export const teFold = TE.fold;
export const tNever = T.never;
export const tOf = T.of;
export const teLeft = TE.left;
export const teRight = TE.right;

export const toResultTask = <E, A>(te: TE.TaskEither<E, A>): T.Task<A> =>
  pipe(
    te,
    teFold(
      (err) => () => Promise.reject(err),
      (res) => tOf(res)
    )
  );
