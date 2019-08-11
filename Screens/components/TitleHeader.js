import React from "react";
import {Image,View,StyleSheet,Text} from 'react-native'


const TitleHeader = props => {
  return (
  <View style={styles.view}>
    <Image
    source={require('../../assets/image/logo.png')}
    style={{ width: 26, height: 26 }}
    />
      <Text style={{marginLeft:10,fontSize:18,color:'white'}}>Centreon Dashboard</Text>
      </View>
  );
};

const styles = StyleSheet.create({
    view: {
        flexDirection :'row'
    }
  
  })

export default TitleHeader;