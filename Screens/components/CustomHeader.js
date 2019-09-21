import React from "react";
import { Header ,Icon} from "react-native-elements";
import {StyleSheet,View,Image,Text} from "react-native";

export default class CustomHeader extends React.Component {
    constructor(props){
        super(props);
    }
    _signOutAsync = async () => {
        //await AsyncStorage.clear();
        global.myvar='';
        this.props.navigation.navigate('Auth');
    };

    render() {
        const Label = this.props.rightC;
        return (
            <Header
              placement="left"
              leftComponent={this.props.leftComponent.children}
              centerComponent={<View style={styles.view}>
                <Image
                    source={require('../../assets/image/logo.png')}
                    style={{ width: 26, height: 26 }}
                />
                <Text style={{marginLeft:10,fontSize:18,color:'white'}}>{this.props.title}</Text>
                </View>
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