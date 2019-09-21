import React, { Component } from "react";
import { View,TouchableOpacity,ActivityIndicator, Text,TouchableHighlight, Image,ScrollView ,StyleSheet,Picker,AsyncStorage} from "react-native";
import {Icon,Header} from "react-native-elements"
import Menu from "../components/Menu";

class ServiceByHostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading:true,
      error: null,
      refreshing: false,
      centreon_api:''
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

  makeRemoteRequest = function(){
      that=this;
    return fetch(this.state.centreon_api+'/centreon/api/index.php?object=centreon_realtime_hosts&action=list&limit=500', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'centreon-auth-token': global.Token
            }
        }).then(res => res.json())
            .then(function (res) {
                that.setState({ data: res ,loading:false});
            })
            .catch(error => console.error('Error:', error)); 
  };
  getColor = s =>{
        if(s==="0") return "#88b917";
        if(s==="2") return "#f4e640";
        //if(s==="3") return "#990000"; 
        return "#990000";
    }
    getStatus= s =>{
        if(s==="0") return "UP";
        if(s==="2") return "Down";
        //if(s==="3") return "Unreachable";
        return "Unreachable";    
    }
  render() {
    const { navigate } = this.props.navigation;
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
                <Text style={{marginLeft:10,fontSize:18,color:'white'}}>Service Status</Text>
                </View>
            }
              rightComponent={
                <Picker
                selectedValue="By Host"
                style={{height: 50, width: 130,color:"white"}}
                
                onValueChange={(itemValue, itemIndex) =>
                  {
                    //this.setState({language: itemValue})
                    if(itemIndex===0) navigate('All')
                  }
                }>
                <Picker.Item label="All" value="All" />
                <Picker.Item label="By Host" value="By Host" />
              </Picker>
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
                Object.keys(this.state.data).map((key, i) => (
                <TouchableOpacity onPress={() => navigate('Service',{HostName:this.state.data[key].name})} key={key} style={{margin:5,borderRadius:10,backgroundColor:this.getColor(this.state.data[key].state),padding:10,flexDirection:"row",alignItems:'center'}}>
                  <View style={{width:300}}>
                      <Text style={{fontWeight:"bold",fontSize:20}}>{ this.state.data[key].name }</Text>
                      <Text>{ this.getStatus(this.state.data[key].state) }</Text>
                      <Text>{ this.state.data[key].output }</Text>
                  </View>
                  <TouchableHighlight style={{marginLeft:50}}>
                    <Icon name="arrow-forward"/>
                  </TouchableHighlight>  
                </TouchableOpacity>
                ))
            }  
        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  view: {
      flexDirection :'row'
  }

})

export default ServiceByHostScreen;