import { Body, Card, CardItem } from "native-base";
import React from "react";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export interface SimpleCardProps {
  cardProps?: any;
  cardHeader?: any;
  cardFooter?: any;
  cardItemProps?: any;
  children: any;
}

export const SimpleCard = (props: SimpleCardProps): React.ReactElement => {
  const { cardProps, cardItemProps, children, cardHeader, cardFooter } = props;
  return (
    <Card {...cardProps}>
      {cardHeader && cardHeader}
      <CardItem {...cardItemProps}>
        <Body>{children && children}</Body>
      </CardItem>
      {cardFooter && cardFooter}
    </Card>
  );
};
