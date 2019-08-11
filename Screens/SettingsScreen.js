import React from "react";
import { View, Text,StyleSheet,FlatList } from "react-native";
import MyHeader from './components/MyHeader'

const SettingsScreen = props  => {
    
  return (
    <View style={{backgroundColor:"#303030",height:"100%"}}>
        <MyHeader navigation={props.navigation || ''} title="Host status" />
    </View>
  );
};


const styles = StyleSheet.create({
    viewStatus: {
        flexDirection :'row',
        justifyContent:'space-around',
        marginTop:10
    },
    viewStatus1:{
    },
    viewStatus2: {
        flexDirection :'column',
        alignItems:"center",
    },
    viewStatus3:{
        alignItems:"center",
        borderColor:"#2b2626",
        borderWidth:1,
        margin:10,
        padding:10
    }
  })


export default SettingsScreen;