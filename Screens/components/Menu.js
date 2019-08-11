import React from "react";
import { Icon } from "react-native-elements";
import {View,StyleSheet} from 'react-native';

const Menu = props => {
  return (
<View style={styles.view}>
        <Icon
      color="#fff"
      name="menu"
      size={30}
      onPress={() => props.navigation.toggleDrawer()} 
    />
    </View>
  );
};

const styles = StyleSheet.create({
    view: {
        flexDirection :'row',
     //   borderWidth:5,
       // borderColor:"#eee"
    }
  
  })

export default Menu;