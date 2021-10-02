import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, } from 'react-native';
import MyTabs from './tabnav'
import Comments from './comments';
import { Ionicons } from '@expo/vector-icons';
import { NavigationEvents } from 'react-navigation';


function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require('../assets/icon.png')}
    />
  );
}


const Stack = createStackNavigator();

export default function MyStack() {
  return (

      <Stack.Navigator
      initialRouteName="Feed"      
        >

      <Stack.Screen 
  name="Feed"
  component={MyTabs}
  options={{
    header: ()=> null,
    headerTransparent: true
  }}

   />


      <Stack.Screen 
       options={({ navigation }) => ({
        
        headerTintColor: 'white',
        headerStyle: { 
          backgroundColor: '#8080ea',
          height:70
        },
        headerLeft: () =>
          
            <Ionicons
              name="chevron-back-outline"
              color="white"
              size={32}
              onPress={() => navigation.goBack()}
            />
          })
        }
     
      name="Comments" component={Comments} />
    </Stack.Navigator>

  )
}
