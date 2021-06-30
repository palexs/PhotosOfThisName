import React, {FC} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {SafeAreaProvider} from 'react-native-safe-area-context';

import MainPage from './MainPage';
import ContactsPage from './ContactsPage';
import {Icon} from 'react-native-elements';
import {Contact} from 'react-native-contacts';

export type RootStackParamList = {
  Main: undefined;
  Contacts: {onSelectContact: (contact: Contact) => void};
};

const Stack = createStackNavigator<RootStackParamList>();

const App: FC = () => {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <Stack.Navigator initialRouteName="Main" mode="modal">
          <Stack.Screen
            name="Main"
            component={MainPage}
            options={{title: 'Photos Of This Name'}}
          />
          <Stack.Screen
            name="Contacts"
            component={ContactsPage}
            options={({navigation}) => ({
              title: 'Choose a contact',
              headerLeft: () => null,
              headerRight: () => (
                <Icon
                  name="close-outline"
                  type="ionicon"
                  color={'black'}
                  size={32}
                  containerStyle={{paddingRight: 10}}
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
              ),
            })}
          />
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default App;
