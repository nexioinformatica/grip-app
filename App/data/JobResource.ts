import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import { Job } from "geom-api-ts-client";
import { Settings } from "geom-api-ts-client/dist/common/api";

import { Call } from "../stores";

export const end = (call: Call) => (settings: Settings) => (
  IdFase: number
): TE.TaskEither<Error, Job.Job> =>
  pipe(
    {
      IdFase: IdFase,
      settings: settings,
    },
    pipe(Job.end, call)
  );
