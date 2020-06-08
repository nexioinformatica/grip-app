import { Lazy } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as O from "fp-ts/lib/Option";
import * as A from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";

/**
 * Convert a Promise<A> into a TaskEither<Error, A>
 * @param fn - Function returning a Promise
 */
export function promiseToTE<A>(
  fn: Lazy<Promise<A>>,
  namespace: string
): TE.TaskEither<Error, A> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return TE.tryCatch(fn, (reason: any) => {
    let error: Error | undefined;
    // FIXME GraphQLError is empty
    // https://github.com/apollographql/apollo-client/issues/2810#issuecomment-401738389
    if (
      reason.networkError &&
      reason.networkError.result &&
      reason.networkError.result.errors &&
      reason.networkError.result.errors[0]
    ) {
      error = new Error(reason.networkError.result.errors[0].message);
    } else {
      error = reason instanceof Error ? reason : new Error(String(reason));
    }

    return error;
  });
}

export const foldDefaultMap = <T, U>(z: U, f: (x: T) => U) => (
  o: O.Option<T>
): U =>
  pipe(
    o,
    O.fold(
      () => z,
      (x) => f(x)
    )
  );

export const foldDefault = <T>(z: T) => (o: O.Option<T>): T =>
  pipe(
    o,
    O.fold(
      () => z,
      (x) => x
    )
  );
