import React from "react";
import { ScrollView, View } from "react-native";
import { Divider, List, Surface } from "react-native-paper";
import {
  API_BASE_URL,
  API_CLIENT_CONNECTION_TIMEOUT,
  API_CLIENT_REQUEST_TIMEOUT,
  API_KEY,
  API_USE_HTTP,
  APP_VERSION,
  IS_SENTRY_SET_UP,
  RELEASE_CHANNEL,
} from "../../util/constants";

export const Info = (): React.ReactElement => {
  return (
    <View>
      <ScrollView>
        <Surface>
          <List.Section>
            <List.Subheader>App info</List.Subheader>
            <List.Item title={APP_VERSION} description="Versione app" />
            <List.Item title={RELEASE_CHANNEL} description="Canale release" />
            <List.Item
              title={`${IS_SENTRY_SET_UP ? "attivo" : "non attivo"}`}
              description="Servizio di reportistica errori e crash"
            />
          </List.Section>
          <Divider />
          <List.Section>
            <List.Subheader>Servizio backend</List.Subheader>

            <List.Item
              title={API_KEY?.substr(API_KEY.length - 6)}
              description="Ultime 6 cirfre API KEY"
            />
            <List.Item
              title={API_BASE_URL}
              description="URL in uso dal servizio backend"
            />
            <List.Item
              title={API_USE_HTTP ? "HTTP" : "HTTPS"}
              description="Protocollo in uso dal servizio backend"
            />
            <List.Item
              title={`${API_CLIENT_REQUEST_TIMEOUT} ms`}
              description="API client connection timeout"
            />
            <List.Item
              title={`${API_CLIENT_CONNECTION_TIMEOUT} ms`}
              description="API client request timeout"
            />
          </List.Section>
          <Divider />
        </Surface>
      </ScrollView>
    </View>
  );
};
