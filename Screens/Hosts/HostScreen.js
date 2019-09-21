import React, { Component } from "react";
import {TouchableOpacity,AsyncStorage, View,ActivityIndicator, Text,TouchableHighlight, Image,ScrollView } from "react-native";
import {Icon} from "react-native-elements"
import MyHeader from '../components/MyHeader'

class HostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      error: null,
      centreon_api:'',
      loading:true,
      refreshing: false,
    };
  }

  async componentDidMount() {
    that=this;
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      AsyncStorage.getItem('centreon_api').then((value)=>{
        that.setState({centreon_api:value});
        this.makeRemoteRequest();
      });
    })
  }

  // and don't forget to remove the listener
    componentWillUnmount () {
    this.focusListener.remove()
  }

  makeRemoteRequest = () => {
    that=this;
    return fetch(this.state.centreon_api+'/centreon/api/index.php?object=centreon_realtime_hosts&action=list&limit=500', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'centreon-auth-token': global.Token
            }
        }).then(res => res.json())
            .then(function (res) {
              console.log(JSON.stringify(res))
                that.setState({ data: res,loading:false});
            })
            .catch(error => console.error('Error:', error)); 
  };
  getColor = s =>{
        if(s==="0") return "#88b917";
        if(s==="1") return "#990000";
        if(s==="3") return "#f4e640";
        return "#4d4d4d";
    }
    getStatus= s =>{
        if(s==="0") return "UP";
        if(s==="1" || s==="2") return "Down";
        //if(s==="3") return "Unreachable";
        return "Unreachable";    
    }
  render() {
    const { navigate } = this.props.navigation;
    console.log("stat=======================================================\n"+this.state.data)
    return (
      <View style={{ flex: 1, alignItems: "stretch", justifyContent: "center" ,backgroundColor:"#212121"}}>
        <MyHeader  navigation={this.props.navigation || ''} title="Host status" />
        <ScrollView>
            { this.state.loading===true?
              <View style={{marginTop:100}}>
                <ActivityIndicator size={100} color="#0000ff" />
              </View>
            :
                Object.keys(this.state.data).map((key, i) => (
                <TouchableOpacity onPress={() => navigate('HostDetail',{desc:this.state.data[key].name})}  key={key} style={{margin:5,borderRadius:10,backgroundColor:this.getColor(this.state.data[key].state),padding:10,flexDirection:"row",alignItems:'center'}}>
                  <View onPress={()=>{console.log("it works")}} style={{width:300}}>
                      <Text style={{fontWeight:"bold",fontSize:20}}>{ this.state.data[key].name }</Text>
                      <Text>{ this.getStatus(this.state.data[key].state) }</Text>
                      <Text>{ this.state.data[key].output }</Text>
                  </View>
                  <TouchableHighlight n style={{marginLeft:50}}>
                    <Icon name="arrow-forward"/>
                  </TouchableHighlight>  
                </TouchableOpacity >
                ))
            }  
        </ScrollView>
      </View>
    );
  }
}

export default HostScreen;