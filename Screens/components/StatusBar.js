'use strict'
import React, {Component} from 'react';
import {StatusBar,View, Text, StyleSheet, Platform} from 'react-native';


console.log('hjeight is :'+StatusBar.currentHeight)

class StatusBarBackground extends Component{
  render(){
    return(
      <View style={[styles.statusBarBackground, this.props.style || {}]}> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  statusBarBackground: {
    height: (Platform.OS === 'ios') ? 18 : StatusBar.currentHeight, //this is just to test if the platform is iOS to give it a height of 18, else, no height (Android apps have their own status bar)
    backgroundColor: "white",
  }

})

module.exports= StatusBarBackground