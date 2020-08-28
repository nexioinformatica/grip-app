import { FormikProps } from "formik";
import { pipe } from "fp-ts/lib/pipeable";
import { Barcode } from "geom-api-ts-client";
import React from "react";

import { ScanFreshman } from "../ScanInput";

interface ExecutiveOrder {
  phase?: { IdFase: number };
  position?: { IdPosizione: number };
  header?: { IdTestata: number };

  barcode: {
    phase: string;
    position: string;
    header: string;
  };
}

export const ExecutiveOrderFormSection = <T extends ExecutiveOrder>({
  handleChange,
  setFieldValue,
  handleBlur,
  values,
  errors,
}: FormikProps<T>): React.ReactElement => {
  return (
    <>
      <ScanFreshman
        label="Fase"
        onChangeText={(x?: string) => handleChange("barcode.phase")(x ?? "")}
        onDecodeValue={(x) =>
          setFieldValue(
            "phase",
            pipe(x, Barcode.Util.getDecode<Barcode.PhaseDecode>("F"))
          )
        }
        value={values.barcode.phase}
        returnKeyType="next"
        onBlur={handleBlur("phase")}
        error={!!errors.phase}
        errorText={errors.phase?.toString()}
        keyboardType="default"
      />
      <ScanFreshman
        label="Posizione"
        onChangeText={(x?: string) => handleChange("barcode.position")(x ?? "")}
        onDecodeValue={(x) =>
          setFieldValue(
            "position",
            pipe(x, Barcode.Util.getDecode<Barcode.PositionDecode>("P"))
          )
        }
        value={values.barcode.position}
        returnKeyType="next"
        onBlur={handleBlur("position")}
        error={!!errors.position}
        errorText={errors.position?.toString()}
        keyboardType="default"
      />
      <ScanFreshman
        label="Testata"
        onChangeText={(x?: string) => handleChange("barcode.header")(x ?? "")}
        onDecodeValue={(x) =>
          setFieldValue(
            "header",
            pipe(x, Barcode.Util.getDecode<Barcode.HeaderDecode>("T"))
          )
        }
        value={values.barcode.header}
        returnKeyType="next"
        onBlur={handleBlur("header")}
        error={!!errors.header}
        errorText={errors.header?.toString()}
        keyboardType="default"
      />
    </>
  );
};
