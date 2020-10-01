import { pipe } from "fp-ts/lib/pipeable";
import { Operator } from "geom-api-ts-client";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Checkbox,
  Divider,
  List,
  Paragraph,
  Text,
  Title,
  Surface,
  IconButton,
} from "react-native-paper";

import useCancellablePromise from "@rodw95/use-cancelable-promise";

import { ApiContext, AuthContext } from "../../stores";
import { getExpiringIn, getInitials } from "../../types/User";
import { makeSettings } from "../../util/api";
import { toResultTask } from "../../util/fp";
import { FlatSurface } from "../../components/Surface";

export const Profile = (): React.ReactElement => {
  const { user, logout, refresh } = useContext(AuthContext);
  const { call } = useContext(ApiContext);
  const makeCancelable = useCancellablePromise();

  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [operator, setOperator] = useState<Operator.Operator>();

  const access_token = user?.token.access_token;
  const refresh_token = user?.token.refresh_token;

  const getMe = () =>
    pipe(
      pipe(call(Operator.getMe)({ settings: makeSettings() }), toResultTask)(),
      makeCancelable
    );

  const updateData = () => {
    setLoading(true);
    setError(false);

    getMe()
      .then((operator) => {
        setOperator(operator);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    updateData();
  }, []);

  if (isError) {
    return (
      <Surface style={styles.container}>
        <ScrollView>
          <View style={styles.content}>
            <View style={{ alignSelf: "center", alignItems: "center" }}>
              <IconButton icon="alert" onPress={updateData} />
              <Text>Si è verificato un errore</Text>
            </View>
            <View style={styles.actions}>
              <Button onPress={updateData} mode="outlined">
                <Text>Rirova</Text>
              </Button>
              <Button onPress={logout}>
                <Text>Logout</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </Surface>
    );
  }

  if (isLoading)
    return (
      <Surface style={styles.container}>
        <ScrollView>
          <View style={styles.content}>
            <ActivityIndicator />
          </View>
        </ScrollView>
      </Surface>
    );

  return (
    <Surface style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Card>
            <Card.Content>
              <FlatSurface style={{ alignItems: "center" }}>
                <Avatar.Text
                  size={96}
                  label={getInitials(operator?.Nome ?? "")}
                />
                <Title style={styles.title}>{operator?.Nome}</Title>
                <Paragraph>@{operator?.UserName}</Paragraph>

                <Divider style={styles.divider} />

                <FlatSurface style={{ width: "100%" }}>
                  <List.Section title="Informazioni Aggiuntive">
                    <List.Item
                      title="Abilitato API"
                      right={(props) => (
                        <Checkbox
                          {...props}
                          status={
                            operator?.AbilitatoAPI ? "checked" : "unchecked"
                          }
                        />
                      )}
                    />
                    <List.Item
                      title="Abilitato Attività Reparto"
                      right={(props) => (
                        <Checkbox
                          {...props}
                          status={
                            operator?.AbilitatoAttivitaReparto
                              ? "checked"
                              : "unchecked"
                          }
                        />
                      )}
                    />
                  </List.Section>
                </FlatSurface>

                <Divider style={styles.divider} />

                <FlatSurface style={{ width: "100%" }}>
                  <List.Section title="Informazioni Accesso">
                    <List.Item
                      title="Access Token"
                      right={(props) => (
                        <FlatSurface style={{ alignSelf: "center" }} {...props}>
                          <Text>
                            {access_token?.substr(access_token.length - 6)}
                          </Text>
                        </FlatSurface>
                      )}
                    />
                    <List.Item
                      title="Refresh Token"
                      right={(props) => (
                        <FlatSurface style={{ alignSelf: "center" }} {...props}>
                          <Text>
                            {refresh_token?.substr(refresh_token.length - 6)}
                          </Text>
                        </FlatSurface>
                      )}
                    />
                    <List.Item
                      title="Scadenza"
                      right={(props) => (
                        <FlatSurface style={{ alignSelf: "center" }} {...props}>
                          <Text>{getExpiringIn(user)}</Text>
                        </FlatSurface>
                      )}
                    />
                  </List.Section>
                  <Button onPress={() => refresh(true)}>
                    <Text>Aggiorna Token</Text>
                  </Button>
                </FlatSurface>

                <Divider style={styles.divider} />

                <FlatSurface style={{ width: "100%", marginTop: 16 }}>
                  <Button mode="contained" onPress={() => logout()}>
                    Logout
                  </Button>
                </FlatSurface>
              </FlatSurface>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  title: {
    fontWeight: "bold",
    fontSize: 28,
    marginTop: 16,
  },
  caption: {
    fontSize: 18,
    lineHeight: 14,
  },
  divider: { width: "80%", marginTop: 16, height: 2 },
  actions: { marginTop: 16 },
});
