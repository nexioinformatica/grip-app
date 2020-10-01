import React, { useState } from "react";
import { ScrollView } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";

import { NewSubdivisionForm } from "../Form/NewSubdivisionForm";
import { FlatSurface } from "../Surface";

type Props = {
  freshman?: { IdArticolo: number };
};

export const NewSubdivisionButton = ({
  freshman,
}: Props): React.ReactElement => {
  const [isVisible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  return (
    <>
      <Button mode="outlined" onPress={showDialog}>
        Nuova suddivisione
      </Button>
      <Portal>
        <Dialog visible={isVisible}>
          <FlatSurface>
            <Dialog.Title>Nuova Suddivisione</Dialog.Title>
            <Dialog.Content style={{ height: 400 }}>
              <ScrollView>
                <NewSubdivisionForm freshman={freshman} />
              </ScrollView>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Chiudi</Button>
            </Dialog.Actions>
          </FlatSurface>
        </Dialog>
      </Portal>
    </>
  );
};
