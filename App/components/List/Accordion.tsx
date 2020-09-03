import React, { useState } from "react";
import { List } from "react-native-paper";

const ListAccordion = List.Accordion;
type Props = React.ComponentProps<typeof ListAccordion> & {
  expandedDefault?: boolean;
};

export const Accordion = ({
  expanded,
  expandedDefault,
  onPress,
  children,
  ...rest
}: Props) => {
  const [isExpanded, setExpanded] = useState(
    expanded || expandedDefault || false
  );
  const handlePress = () => {
    setExpanded(!isExpanded);
    onPress && onPress();
  };
  return (
    <List.Accordion expanded={isExpanded} onPress={handlePress} {...rest}>
      {children}
    </List.Accordion>
  );
};
