import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { Predicate } from "fp-ts/lib/function";

export const notNullParser = E.fromNullable(
  new Error("Invalid nullish value supplied")
);

export const getItemOrDefault = <T extends U, U>(
  eitherParser: (a: U | null) => E.Either<Error, U>
) => (validatePredicate: Predicate<U> = () => true) => (defaultTheme: T) => (
  current: U | null
): T =>
  pipe(
    current,
    eitherParser,
    E.fold(
      E.left,
      E.fromPredicate(
        validatePredicate,
        () => new Error("Invalid string type supplied")
      )
    ),
    E.fold(
      () => defaultTheme,
      (theme) => theme as T
    )
  );
