import React from "react";
import { AsyncStorage,Alert, Image, Text, TextInput, TouchableHighlight, TouchableOpacity,View} from "react-native";
import {SearchBar,Icon} from 'react-native-elements'
import Dialog from "react-native-dialog";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: 'bilal',
            password: '0FguUFaF',
            centreon_api:'',
            dialogVisible:false,
        };
        this._signInAsync =this._signInAsync.bind(this);
        this.handleEdit=this.handleEdit.bind(this);
        this.handleCancel=this.handleCancel.bind(this);
    }

    handleCancel = () => {
        this.setState({ dialogVisible: false });
        that=this;
        AsyncStorage.getItem('centreon_api').then(item=>item?that.setState({centreon_api:item}):null);
    };
     
    handleEdit (){
        console.log("edit fired");
        AsyncStorage.setItem('centreon_api', this.state.centreon_api).then(this.setState({ dialogVisible: false}));
        
    };
    async componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            that=this;
            AsyncStorage.getItem('centreon_api').then((value)=>{
                console.log("centreon_api"+JSON.stringify(value));
                if(value) that.setState({centreon_api:value});
                else that.setState({dialogVisible:true});
                console.log('initial state '+this.state.centreon_api); 
            });
        });
      }

    componentWillUnmount () {
        this.focusListener.remove()
    }
    
    _signInAsync = function () {
        var login = this.state.login;
        var pass = this.state.password;
        var formData = new FormData();
        formData.append('username', login);
        formData.append('password', pass);
        var that = this;
        console.log("Begin auth process"+login+pass)  
        console.log("res : "+this.state)  
        return fetch(this.state.centreon_api+'/centreon/api/index.php?action=authenticate', {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                //'Content-Type': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: formData
        }).then(res => {
            if (res.ok) {                
                return res.json()
            }
            throw new Error('Something went wrong');
        }).then(res =>{
                var token = res.authToken;
                console.log("token from server :"+token);
                if (token) {
                    global.Token=token;
                    console.log("stored Token "+global.Token);
                    that.props.navigation.navigate('App');
                } else Alert.alert("Invalid credentials", "Incorrect Username or Password");
            }).catch(error => Alert.alert("Unable to connect", "we can't connect to the server. check your network connection and server address")) 
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
                            value={this.state.login}
                            autoCapitalize="none"
                            underlineColorAndroid='transparent'
                            onChangeText={(login) => this.setState({login:login})}
                            ref= {(el) => { this.login = el; }}
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
                               value={this.state.password}
                               autoCapitalize="none"
                               secureTextEntry={true}
                               underlineColorAndroid='transparent'
                               onChangeText={(password) => this.setState({password:password})}
                               ref={(input) => this.passwordInput = input}
                               onSubmitEditing={this._signInAsync}
                    />
                </View>

                <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={this._signInAsync}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableHighlight>

                <TouchableOpacity onPress={()=>this.setState({ dialogVisible: true})}>
                    <Text style={{color:"white"}}>Settings</Text>
                </TouchableOpacity>
                
                <Dialog.Container visible={this.state.dialogVisible}>
                    <Dialog.Title>REST API URL :</Dialog.Title>
                    <Dialog.Input
                        placeholder="Centreon url"
                        style={styles.inputAlert}
                        value={this.state.centreon_api}
                        autoCapitalize="none"
                        underlineColorAndroid='transparent'
                        onChangeText={(centreon_api) => this.setState({centreon_api:centreon_api})}
                    />
                    <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                    <Dialog.Button label="Edit" onPress={this.handleEdit} />
                </Dialog.Container>
                    
            </View>

        );
    }
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
    inputAlert:{
        borderBottomColor:'#000000',
        borderBottomWidth:2,
        width:200,
        justifyContent: 'center'
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