import React, { useState } from "react";
import { FAB, Portal, Provider } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";

import { ActionTypeKey } from "../../../types/ActionType";

export const Fabs = (): React.ReactElement => {
  const navigation = useNavigation();
  const [isOpen, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!isOpen);
  return (
    <Provider>
      <Portal>
        <FAB.Group
          visible={true}
          open={isOpen}
          icon={isOpen ? "rocket" : "plus"}
          actions={[
            {
              icon: "stop",
              label: "Pausa Attvità",
              onPress: () =>
                navigation.navigate("Activities", {
                  screen: "StopActivity",
                  params: {
                    actionType: ActionTypeKey.MachineAndOperator,
                    isMachineReadFromBarcode: true,
                  },
                }),
            },
            {
              icon: "play",
              label: "Inizia Attività",
              onPress: () =>
                navigation.navigate("Activities", {
                  screen: "StartActivity",
                  params: {
                    actionType: ActionTypeKey.MachineAndOperator,
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
