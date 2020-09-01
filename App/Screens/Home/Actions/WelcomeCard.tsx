import React from "react";
import { Card, Caption } from "react-native-paper";
import moment from "moment";

const humanizedGreetings = (): string => {
  const split_morning = 5;
  const split_afternoon = 12;
  const split_evening = 17;

  const now = moment().hours();

  if (now >= split_evening || now < split_morning) return "Buona sera";
  if (now >= split_afternoon) return "Buon pomeriggio";
  return "Buon giorno";
};

export const WelcomeCard = (): React.ReactElement => {
  return (
    <Card>
      <Card.Title title={humanizedGreetings()} />
      <Card.Content>
        <Caption>
          Inizia un lavoro tramite i tasti rapidi o dal menù a sinistra.
        </Caption>
      </Card.Content>
    </Card>
  );
};
