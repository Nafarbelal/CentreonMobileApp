import React from "react";
import { AsyncStorage,Alert, Image, Text, TextInput, TouchableHighlight, View} from "react-native";
import {SearchBar,Icon} from 'react-native-elements'
import { centreon_api_key } from 'react-native-dotenv'


export default class Login extends React.Component {
    constructor(props) {
        super(props);
        console.log(centreon_api_key);
        state = {
            login: 'admin',
            password: 'centreon',
       
        };
        this._signInAsync =this._signInAsync.bind(this);
    }

    static navigationOptions = {
        //title:'adadada'
    };

    

    render() {
        return (
            <View style={styles.container}>
                <View style={{flexDirection:'row',alignItems:'center',marginBottom:70}}>
                <Image
                    source={require('../assets/image/logo.png')}
                    style={{ width: 70, height: 70 }}
                />
                <Text style={{fontSize:45,marginLeft:10,color:'#00ccff'}}>Centreon</Text>
            </View>
                <View style={styles.inputContainer}>
                <Icon
                    name='person'
                    type= 'ionic'
                    color={"#303030"}
                    iconStyle={{marginLeft:10}}
                />
                <TextInput style={styles.inputs}
                            placeholder="Username"
                            value={state.login}
                            autoCapitalize="none"
                            underlineColorAndroid='transparent'
                            ref= {(el) => { this.login = el; }}
                            onChangeText={(login) => this.setState({login})}
                            returnKeyType="next"
                            onSubmitEditing={() => this.passwordInput.focus()}
                />
                </View>


                <View style={styles.inputContainer}>
                <Icon
                    name='lock'
                    type= 'feathericons'
                    color={"#303030"}
                    iconStyle={{marginLeft:10}}
                />
                <TextInput style={styles.inputs}
                               placeholder="Password"
                               value={state.password}
                               autoCapitalize="none"
                               secureTextEntry={true}
                               underlineColorAndroid='transparent'
                               onChangeText={(password) => this.setState({password})}
                               ref={(input) => this.passwordInput = input}
                               onSubmitEditing={this._signInAsync}
                    />
                </View>

                <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={this._signInAsync.bind(this)}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableHighlight>
            </View>

        );
    }
    _signInAsync = function () {
        var login = state.login;
        var pass = state.password;
        var formData = new FormData();
        formData.append('username', login);
        formData.append('password', pass);
        console.log("login :----------- "+login);
        console.log("password :-------------"+pass);
        var that = this;
        return fetch('http://'+centreon_api_key+'/centreon/api/index.php?action=authenticate', {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                //'Content-Type': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: formData
        }).then(res => {
            console.log("rrrrrrrrrrrrrrrrrrrrrrr"+res);
            if (res.ok) {                
                return res.json()
            }
            throw new Error('Something went wrong');
            }).then(res =>{
                var token = res.authToken;
                console.log("token from server :"+token);
                if (token) {
                    //AsyncStorage.setItem('Token', token);
                    global.Token=token;
                    console.log("stored Token "+global.Token);

                    that.props.navigation.navigate('App');
                    // this.props.navigation.navigate('Register'); //this.navigate.navigate('Register');
                } else Alert.alert("Invalid credentials", "Incorrect Username or Password");
            }).catch(error => Alert.alert("Unable to connect", "we can't connect to the server. check your network connection and server address")) 
    };
}

const styles = {
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor:'#303030',
        paddingTop:170
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        width:300,
        height:45,
        marginBottom:20,
        flexDirection: 'row',
        alignItems:'center',
    },
    inputs:{
        height:45,
        marginLeft:10,
        borderBottomColor: '#FFFFFF',
        flex:1,
    },
    inputIcon:{
        width:30,
        height:30,
        marginLeft:15,
        justifyContent: 'center'
    },
    buttonContainer: {
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:300,
        //  borderRadius:30,
    },
    loginButton: {
        backgroundColor: "#00b5ec",
    },
    loginText: {
        color: 'white',
        fontSize:20
    }
};