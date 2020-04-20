import React from "react";
import { Card, CardItem, Body } from "native-base";

export interface SimpleCardProps {
  cardProps?: any;
  cardHeader?: any;
  cardFooter?: any;
  cardItemProps?: any;
  children: any;
}

export const SimpleCard = (props: SimpleCardProps) => {
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
