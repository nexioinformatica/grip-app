import { pipe } from "fp-ts/lib/pipeable";
import { Operator } from "geom-api-ts-client";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Checkbox,
  Divider,
  List,
  Paragraph,
  Title,
} from "react-native-paper";

import useCancellablePromise from "@rodw95/use-cancelable-promise";

import { ApiContext, AuthContext } from "../../stores";
import { getExpiringIn, getInitials } from "../../types/User";
import { makeSettings } from "../../util/api";
import { toResultTask } from "../../util/fp";
import { theme } from "../../util/theme";

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
      <View>
        <Text>Sorry, there was a problem</Text>
        <Button onPress={updateData}>
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  if (isLoading)
    return (
      <View style={{ flex: 1, margin: 16 }}>
        <ActivityIndicator />
      </View>
    );

  return (
    <ScrollView>
      <View style={{ flex: 1, margin: 16 }}>
        <Card>
          <Card.Content>
            <View style={{ alignItems: "center" }}>
              <Avatar.Text
                size={96}
                label={getInitials(operator?.Nome ?? "")}
              />
              <Title style={styles.title}>{operator?.Nome}</Title>
              <Paragraph>@{operator?.UserName}</Paragraph>

              <Divider style={styles.divider} />

              <View style={{ width: "100%" }}>
                <List.Section title="Informazioni Aggiuntive">
                  <List.Item
                    title="Abilitato API"
                    right={(props) => (
                      <Checkbox
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
                        status={
                          operator?.AbilitatoAttivitaReparto
                            ? "checked"
                            : "unchecked"
                        }
                      />
                    )}
                  />
                </List.Section>
              </View>

              <Divider style={styles.divider} />

              <View style={{ width: "100%" }}>
                <List.Section title="Informazioni Accesso">
                  <List.Item
                    title="Access Token"
                    right={(props) => (
                      <View style={{ alignSelf: "center" }}>
                        <Text>
                          {access_token?.substr(access_token.length - 6)}
                        </Text>
                      </View>
                    )}
                  />
                  <List.Item
                    title="Refresh Token"
                    right={(props) => (
                      <View style={{ alignSelf: "center" }}>
                        <Text>
                          {refresh_token?.substr(refresh_token.length - 6)}
                        </Text>
                      </View>
                    )}
                  />
                  <List.Item
                    title="Scadenza"
                    right={(props) => (
                      <View style={{ alignSelf: "center" }}>
                        <Text>{getExpiringIn(user)}</Text>
                      </View>
                    )}
                  />
                </List.Section>
                <Button onPress={() => refresh(true)}>
                  <Text>Aggiorna Token</Text>
                </Button>
              </View>

              <Divider style={styles.divider} />

              <View style={{ width: "100%", marginTop: 16 }}>
                <Button mode="contained" onPress={() => logout()}>
                  <Text>Logout</Text>
                </Button>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
});
