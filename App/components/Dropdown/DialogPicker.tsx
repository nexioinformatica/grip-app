import React, { useState, useMemo } from "react";
import {
  Portal,
  Dialog,
  Button,
  List,
  Searchbar,
  Surface,
  Caption,
  Divider,
} from "react-native-paper";
import { pipe } from "fp-ts/lib/pipeable";
import * as A from "fp-ts/lib/Array";
import { View, StyleSheet, ScrollView } from "react-native";
import { ListItem } from "../../types/Item";

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
        <Dialog.Title>Scegli</Dialog.Title>
        <Dialog.Content>
          <View>
            <Searchbar
              placeholder="Cerca"
              onChangeText={onChangeSearch}
              value={searchQuery}
            />
          </View>
          <View style={{ height: 200, marginTop: 24 }}>
            <Surface style={styles.surface}>
              <ScrollView>
                {collection.map((x, i) => {
                  const onItemSelected = () => handleItemSelected(x);
                  return (
                    <View key={i}>
                      <List.Item
                        title={x.title}
                        description={x.description}
                        left={x.left}
                        onPress={onItemSelected}
                      />
                      <Divider />
                    </View>
                  );
                })}
              </ScrollView>
              <View style={styles.details}>
                <Caption>
                  {collection.length}{" "}
                  {collection.length === 1 ? "elemento" : "elementi"}
                </Caption>
              </View>
            </Surface>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hide}>Chiudi</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  surface: {
    elevation: 2,
    width: "100%",
  },
  details: {
    alignItems: "flex-end",
    margin: 16,
  },
});
