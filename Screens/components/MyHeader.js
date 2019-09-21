import React from "react";
import { Header ,Icon} from "react-native-elements";
import {StyleSheet,View,Image,Text} from "react-native";
import Menu from "./Menu";
import TitleHeader from "./TitleHeader";


export default class MyHeader extends React.Component {
    constructor(props){
        super(props);
    }
    _signOutAsync = async () => {
        //await AsyncStorage.clear();
        global.myvar='';
        this.props.navigation.navigate('Auth');
    };

    render() {
        return (
            <Header
              placement="left"
              leftComponent={<Menu navigation={this.props.navigation} />}
              centerComponent={<View style={styles.view}>
              <Image
              source={require('../../assets/image/logo.png')}
              style={{ width: 26, height: 26 }}
              />
                <Text style={{marginLeft:10,fontSize:18,color:'white'}}>{this.props.title}</Text>
                </View>
            }
              rightComponent={<Icon
              color="#fff"
              name="power-settings-new"
              onPress={this._signOutAsync}
            />
    }
    backgroundColor="#212121"
      style={{height:10}}
    />
        );
    }

}

const styles = StyleSheet.create({
  view: {
      flexDirection :'row'
  }
})
