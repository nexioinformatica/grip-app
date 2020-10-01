import * as A from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import {
  Button,
  Caption,
  Dialog,
  Divider,
  List,
  Portal,
  Searchbar,
  Surface,
} from "react-native-paper";

import { ListItem } from "../../types/Item";
import { FlatSurface } from "../Surface";

type Props<T> = {
  items: ListItem<T>[];
  visible: boolean;
  hide: () => void;
  onSelectedChange: (x: ListItem<T>) => void;
};

const searchPredicate = <T,>(searchQuery: string) => (x: ListItem<T>) =>
  x.title.indexOf(searchQuery) > -1 ||
  (!!x.description && x.description.indexOf(searchQuery) > -1);

export const DialogPicker = <T,>({
  items,
  visible,
  hide,
  onSelectedChange,
}: Props<T>): React.ReactElement => {
  const [searchQuery, setSearchQuery] = useState("");

  const collection = useMemo<ListItem<T>[]>(
    () => pipe(items, A.filter(searchPredicate(searchQuery))),
    [items, searchQuery]
  );

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const handleItemSelected = (x: ListItem<T>) => {
    hide();
    onSelectedChange(x);
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hide}>
        <FlatSurface>
          <Dialog.Title>Scegli</Dialog.Title>
          <Dialog.Content>
            <FlatSurface>
              <Searchbar
                placeholder="Cerca"
                onChangeText={onChangeSearch}
                value={searchQuery}
              />
            </FlatSurface>
            <FlatSurface style={styles.list}>
              <Surface style={styles.surface}>
                <ScrollView>
                  {collection.map((x, i) => {
                    const onItemSelected = () => handleItemSelected(x);
                    return (
                      <FlatSurface key={i}>
                        <List.Item
                          title={x.title}
                          description={x.description}
                          left={x.left}
                          onPress={onItemSelected}
                        />
                        <Divider />
                      </FlatSurface>
                    );
                  })}
                </ScrollView>
                <FlatSurface style={styles.details}>
                  <Caption>
                    {collection.length}{" "}
                    {collection.length === 1 ? "elemento" : "elementi"}
                  </Caption>
                </FlatSurface>
              </Surface>
            </FlatSurface>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hide}>Chiudi</Button>
          </Dialog.Actions>
        </FlatSurface>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  surface: {
    elevation: 2,
    width: "100%",
    height: "100%",
  },
  details: {
    alignItems: "flex-end",
    padding: 16,
  },
  list: { height: 200, marginTop: 24 },
});
