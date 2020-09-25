import { useNavigation } from "@react-navigation/native";
import React, { Children } from "react";
import { StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";

import { MyList } from "../../../components/List";

const Link = ({
  onPress,
  children,
}: {
  onPress?: () => void;
  children: React.ReactNode;
}) => (
  <Button mode="outlined" onPress={onPress}>
    {children}
  </Button>
);

const ActivityQuickLinksSection = (): React.ReactElement => {
  const navigation = useNavigation();

  const handleShow = () =>
    navigation.navigate("Activity", {
      screen: "InProgressActivities",
    });

  const handleManage = () =>
    navigation.navigate("Activity", {
      screen: "ManageActivityStatus",
    });

  return (
    <MyList.Accordion title="Attività" expandedDefault={false}>
      <Link onPress={handleShow}>Visualizza</Link>
      <Link onPress={handleManage}>Gestisci</Link>
    </MyList.Accordion>
  );
};

const WarehouseQuickLinksSection = (): React.ReactElement => {
  const navigation = useNavigation();

  const handleMovement = () =>
    navigation.navigate("Warehouse", {
      screen: "Movement",
    });

  return (
    <MyList.Accordion title="Magazzino" expandedDefault={false}>
      <Link onPress={handleMovement}>Movimento</Link>
    </MyList.Accordion>
  );
};

export const QuickLinksCard = (): React.ReactElement => {
  return (
    <Card>
      <Card.Title title="Azioni rapide" />
      <Card.Content>
        <ActivityQuickLinksSection />
        <WarehouseQuickLinksSection />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  button: { marginTop: 8 },
});
