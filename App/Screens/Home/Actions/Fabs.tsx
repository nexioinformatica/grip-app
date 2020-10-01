import React, { useState } from "react";
import { FAB, Portal, Provider } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";

import { ActionTypeKey } from "../../../types/ActionType";
import { ReasonTypeKey } from "../../../types/ReasonType";

export const Fabs = (): React.ReactElement => {
  const navigation = useNavigation();
  const [isOpen, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!isOpen);
  return (
    <Provider>
      <Portal>
        <FAB.Group
          visible={false}
          open={isOpen}
          icon={isOpen ? "rocket" : "plus"}
          actions={[
            {
              icon: "tab-minus",
              label: "Scarico lamiera",
              onPress: () =>
                // TODO: fix navigation, see issue #13
                navigation.navigate("Warehouse", {
                  screen: "Movement",
                  params: {
                    screen: "NewMovement",
                    params: { defaultReasonType: ReasonTypeKey.UnloadProd },
                  },
                }),
            },
            {
              icon: "shape-polygon-plus",
              label: "Carico avanzo",
              onPress: () =>
                // TODO: fix navigation, see issue #13
                navigation.navigate("Warehouse", {
                  screen: "Movement",
                  params: {
                    screen: "NewMovement",
                    params: { defaultReasonType: ReasonTypeKey.LoadRemnant },
                  },
                }),
            },
            {
              icon: "play",
              label: "Inizia attività",
              onPress: () =>
                // TODO: fix navigation, see issue #13
                navigation.navigate("Activity", {
                  tab: "ManageActivityStatus",
                  params: {
                    screen: "StartActivity",
                    params: {
                      defaultActionType: ActionTypeKey.MachineAndOperator,
                    },
                  },
                }),
            },
          ]}
          onStateChange={() => {
            isOpen && toggleOpen();
          }}
          onPress={toggleOpen}
        />
      </Portal>
    </Provider>
  );
};
