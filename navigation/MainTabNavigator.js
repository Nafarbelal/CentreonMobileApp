import React from 'react'
import { DrawerItems,createDrawerNavigator} from "react-navigation";
import {View,Image,Text} from 'react-native'
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
//navigations
import HostStackNavigator from './HostStackNavigator';
//import ServiceStackNavigator from './ServiceStackNavigator'
import ServiceSwitchNavigator from './ServiceSwitchNavigator'
//screens
import HomeScreen from "../Screens/HomeScreen";
import SettingsScreen from "../Screens/SettingsScreen";

const DrawerContent = (props) => (
  <View>
      <View
          style={{
              backgroundColor: '#00004d',
              height: 220,
              flexDirection:'column',
              alignItems: 'center',
              alignContent:'center',
              justifyContent:'center'
          }}
      >
         <View
             style={{
              flexDirection:'row',
              alignItems: 'center',
              alignContent:'center',
              justifyContent:'center'
          }}
      >
         <Image
              source={require('../assets/image/logo.png')}
              style={{ width: 70, height: 70 }}
              />
              <Text style={{color:"#00ccff",fontSize:25}}>CENTREON</Text>
      
         </View>
         </View>
      <DrawerItems {...props} />
  </View>
);

const navigationOptions={
  //drawerWidth :60,//width of menu
  initialRouteName: 'Home',
  drawerBackgroundColor :"#000000",
  overlayColor: '#1a1a1a',
  contentComponent :DrawerContent,
  contentOptions: {
    activeTintColor: '#eee',//color of item selected in menu
    inactiveTintColor :'#fff',
    activeBackgroundColor: '#262626',//background color item selected in menu
  }
}


const DrawerNavigator = createDrawerNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Dashboard',
      drawerIcon: () => (
        <Icon
          name="dashboard" size={23} color={"white"}
        />
      )
    }),
  },
  Hosts: {
    screen: HostStackNavigator,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Hosts',
      drawerIcon: () => (
        <Icon
          name="server" size={23} color={"white"}
        />
      )
    })
  },
  Services: {
    screen: ServiceSwitchNavigator,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Services',
      drawerIcon: () => (
        <Icon
          name="cogs" size={23} color={"white"}
        />
      )
    })
  }
},navigationOptions);

export default DrawerNavigator;
