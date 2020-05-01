import { Lazy } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";

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
