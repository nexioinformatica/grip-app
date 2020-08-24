import { Button, Content, H1, H2, Text } from "native-base";
import React, { useContext } from "react";

import { StackNavigationProp } from "@react-navigation/stack";

import { SimpleCard } from "../../components";
import { AuthContext } from "../../stores";
import { RootStackParamList } from "../Screens";
import { getExpiringIn } from "../../types/User";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type ProfileProps = {
  navigation: HomeScreenNavigationProp;
};

export const Profile = (
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  props: ProfileProps
): React.ReactElement => {
  const { user, logout, refresh } = useContext(AuthContext);

  const access_token = user()?.token.access_token;
  const refresh_token = user()?.token.refresh_token;

  return (
    <>
      <Content padder>
        <SimpleCard>
          <H1>Il mio profilo</H1>
          <Text>Sei autenticato come {user()?.username}</Text>
        </SimpleCard>
        <SimpleCard>
          <H2>Accesso</H2>
          <Text>Token: {access_token?.substr(access_token.length - 6)}</Text>
          <Text>
            Refresh: {refresh_token?.substr(refresh_token.length - 6)}
          </Text>
          <Text>Scadenza: {getExpiringIn(user())}</Text>
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
