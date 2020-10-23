import { pipe } from "fp-ts/lib/pipeable";
import { Job } from "geom-api-ts-client";
import React, { useContext } from "react";

import useCancelablePromise from "@rodw95/use-cancelable-promise";

import { ApiContext } from "../../stores/api";
import { makeSettings } from "../../util/api";
import { toResultTask } from "../../util/fp";
import { TextInput } from "../TextInput";
import { ScanInput } from "./ScanInput";

type Props = React.ComponentProps<typeof TextInput> & {
  value?: string | undefined;
  onChangeText: (value: string | undefined) => void;
  onDecodeValue: (decodedValue: Job.Job) => void;
};

export const ScanPhase = (props: Props): React.ReactElement => {
  const makeCancelable = useCancelablePromise();
  const { call } = useContext(ApiContext);

  const jobDecode = (value: string): Promise<Job.Job> =>
    pipe(
      pipe(
        call(Job.byName)({
          search: { Nome: value },
          settings: makeSettings(),
        }),
        toResultTask
      )(),
      makeCancelable
    );

  return <ScanInput<Job.Job> decode={jobDecode} {...props} />;
};
