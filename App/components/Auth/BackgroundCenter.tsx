import React from "react";
import { Background } from "./Background";

type Props = {
  children: React.ReactNode;
};

const BackgroundCenter = ({ children }: Props): React.ReactElement => (
  <Background containerStyle={{ justifyContent: "center" }}>
    {children}
  </Background>
);

const BackgroundCenterMemo = React.memo(BackgroundCenter);

export { BackgroundCenterMemo as BackgroundCenter };
