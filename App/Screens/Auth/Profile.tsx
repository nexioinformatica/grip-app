import { Button, Content, H1, H2, Text } from "native-base";
import React, { useContext } from "react";

import { StackNavigationProp } from "@react-navigation/stack";

import { SimpleCard } from "../../components";
import { AuthContext } from "../../stores";
import { RootStackParamList } from "../Screens";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type ProfileProps = {
  navigation: HomeScreenNavigationProp;
};

export const Profile = (
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  props: ProfileProps
): React.ReactElement => {
  const { user, logout, refresh } = useContext(AuthContext);

  return (
    <>
      <Content padder>
        <SimpleCard>
          <H1>Il mio profilo</H1>
          <Text>Sei autenticato come {user()?.username}</Text>
        </SimpleCard>
        <SimpleCard>
          <H2>Accesso</H2>
          <Text>Token: {user()?.token.access_token}</Text>
          <Text>Refresh: {user()?.token.refresh_token}</Text>
          <Text>
            Scadenza:{" "}
            {user()
              ?.timestamp.add(user()?.token.expires_in, "seconds")
              .fromNow()}
          </Text>
          <Button transparent>
            <Text onPress={() => refresh()}>Aggiorna Token</Text>
          </Button>
        </SimpleCard>
        <SimpleCard>
          <Button onPress={() => logout()}>
            <Text>Logout</Text>
          </Button>
        </SimpleCard>
      </Content>
    </>
  );
};
