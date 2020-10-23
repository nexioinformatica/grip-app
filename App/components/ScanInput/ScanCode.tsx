import { pipe } from "fp-ts/lib/pipeable";
import { Barcode } from "geom-api-ts-client";
import React, { useContext } from "react";

import useCancelablePromise from "@rodw95/use-cancelable-promise";

import { ApiContext } from "../../stores/api";
import { BarcodeDecode } from "../../types/Barcode";
import { makeSettings } from "../../util/api";
import { toResultTask } from "../../util/fp";
import { TextInput } from "../TextInput";
import { ScanInput } from "./ScanInput";

type Props = React.ComponentProps<typeof TextInput> & {
  value?: string | undefined;
  onChangeText: (value: string | undefined) => void;
  onDecodeValue: (decodedValue: BarcodeDecode) => void;
};

export const ScanCode = (props: Props): React.ReactElement => {
  const makeCancelable = useCancelablePromise();
  const { call } = useContext(ApiContext);

  const barcodeDecode = (value: string): Promise<BarcodeDecode> =>
    pipe(
      pipe(
        call(Barcode.decode)({
          value: { Codice: value },
          settings: makeSettings(),
        }),
        toResultTask
      )(),
      makeCancelable
    );

  return <ScanInput<BarcodeDecode> decode={barcodeDecode} {...props} />;
};
