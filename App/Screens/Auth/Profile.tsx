import React, { useContext } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Screens";
import { Content, Button, Text, H1 } from "native-base";
import { SimpleCard } from "../../components";
import { AuthContext } from "../../stores";
import { OperatorContext } from "../../stores";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type ProfileProps = {
  navigation: HomeScreenNavigationProp;
};

export const Profile = (props: ProfileProps): React.ReactElement => {
  const { navigation } = props;
  const { user, logout } = useContext(AuthContext);
  const { operator, setOperator } = useContext(OperatorContext);

  return (
    <>
      <Content padder>
        <SimpleCard>
          <H1>Il mio profilo</H1>
          <Text>Sei autenticato come: {user?.username}</Text>
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
