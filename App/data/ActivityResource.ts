import { Call } from "../stores";
import { Activities, Operator } from "geom-api-ts-client";
import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import { Settings } from "geom-api-ts-client/dist/common/api";

export const collectionByOperator = (call: Call) => (
  settings: Settings
): TE.TaskEither<Error, Activities.OperatorCollection> =>
  pipe(
    call(Operator.getMe)({ settings: settings }),
    TE.chain((operator) =>
      call(Activities.collectionByOperator)({
        IdOperatore: operator.IdOperatore,
        settings: settings,
      })
    )
  );

export const collectionByMachine = (call: Call) => (settings: Settings) => (
  IdMacchina: number
): TE.TaskEither<Error, Activities.MachineCollection> =>
  pipe(
    call(Activities.collectionByMachine)({
      IdMacchina: IdMacchina,
      settings: settings,
    })
  );
