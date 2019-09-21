import React, { Component } from "react";
import {AsyncStorage, ActivityIndicator,View, StyleSheet,Text, Image,ScrollView } from "react-native";
import Menu from "../components/Menu";
import { Header,Icon} from "react-native-elements";
import moment from 'moment';

class HostDetailScreen extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      data: [],
      error: null,
      color:'',
      loading:true,
      refreshing: false,
      centreon_api:''
    };
  }

  async componentDidMount() {
    that=this;
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      const hostName = this.props.navigation.getParam('desc', 'undefined');  
      AsyncStorage.getItem('centreon_api').then((value)=>{
        that.setState({centreon_api:value});
        this.makeRemoteRequest(hostName);
      });
    })
  }

  // and don't forget to remove the listener
    componentWillUnmount () {
    this.focusListener.remove()
  }

  makeRemoteRequest = (hostName) => {
  that=this;
  return fetch(this.state.centreon_api+'/centreon/api/index.php?object=centreon_realtime_hosts&action=list&search='+hostName, {
    method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'centreon-auth-token': global.Token
            }
        }).then(res => res.json())
            .then(function (res) {
                res[0].last_check=moment.unix(parseInt(res[0].last_check)).format('LLLL');
                res[0].last_state_change=moment.unix(parseInt(res[0].last_state_change)).format('LLLL');
                res[0].last_hard_state_change=moment.unix(parseInt(res[0].last_hard_state_change)).format('LLLL');
                color=that.getColor(res[0].state);
                res[0].state=that.getStatus(res[0].state);
                res[0].criticality=res[0].critically?"Oui":"NON";
                //that.setState({ data: res[0],color:color });
                that.setState({ data: res[0], color:color,loading:false });
            })
            .catch(error => console.error('Error:', error)); 
  };
  getStatus= s =>{
    if(s==="0") return "UP";
    if(s==="1") return "Down";
    //if(s==="1" || s==="3") return "Unreachable";
    return "Unreachable";    
}

  getColor = s =>{
    if(s==="0") return "#88b917";
    if(s==="1" ) return "#990000";
    if(s==="2") return "#f4e640";
      return "#4d4d4d";
    }
    
  render() {
    return (
      <View style={{ flex: 1, alignItems: "stretch", justifyContent: "center" ,backgroundColor:"#212121"}}>
        <Header
              placement="left"
              leftComponent={<Menu navigation={this.props.navigation} />}
              centerComponent={<View style={styles.view}>
              <Image
              source={require('../../assets/image/logo.png')}
              style={{ width: 26, height: 26 }}
              />
                <Text style={{marginLeft:10,fontSize:18,color:'white'}}>Host {this.props.navigation.getParam('desc', 'undefined')}</Text>
                </View>
            }
              rightComponent={<Icon
              color="#fff"
              name="search"
              onPress={this._signOutAsync}        
              />
            }
            backgroundColor="#212121"
            style={{height:10}}
    />

        <ScrollView>
            { 
              this.state.loading===true?
              <View style={{marginTop:100}}>
                <ActivityIndicator size={100} color="#0000ff" />
              </View>
            :
            Object.entries(this.state.data).map(([key,value]) => (
                <View key={key} style={styles.view1}>
                  <View style={styles.view2}>
                      <View style={{marginBottom:5}}>
                        <Text style={{color:"#a09e85",fontSize:17}}>{key}</Text>
                      </View>
                      <View style={{marginBottom:5}}>
                        <Text style={{color:key==="state"?this.state.color:"#bbbbbb",fontSize:19}}>{value}</Text>
                      </View>
                  </View>
                </View>
              ))
            } 
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    view: {
        flexDirection :'row',
        paddingTop:5
    },
    view1:{
      borderRadius:10,
      flex:1,
      flexDirection:"column",
//      justifyContent:"flex-start",
  //    alignItems:"flex-start"
    },
    view2:{
      borderBottomWidth:3,
      borderBottomColor:"#373737",
      backgroundColor:"#303030",
      paddingLeft:10
    }
  });
  
export default HostDetailScreen;