import React, { Component } from "react";
import { View, AsyncStorage,TouchableOpacity,TouchableHighlight,StyleSheet,Text, Image,ActivityIndicator,ScrollView,Picker } from "react-native";
import Menu from "../components/Menu";
import { Icon,Header,SearchBar} from "react-native-elements";

class ServiceScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      search:'',
      error: null,
      loading:true,
      centreon_api:'',
      _isMounted:false,
      refreshing: false,
      search: ''
    };
  }

  async componentDidMount() {
    that=this;
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.setState({_isMounted:true});
      host = this.props.navigation.getParam('HostName', '');
      AsyncStorage.getItem('centreon_api').then((value)=>{
        if(that.state._isMounted)
          that.setState({centreon_api:value});
        this.makeRemoteRequest(host);
      });
    })
  }

  // and don't forget to remove the listener
    componentWillUnmount () {
    this.focusListener.remove();
    this.setState({_isMounted:false});
  }

  makeRemoteRequest = host => {
    that=this;
    return fetch(this.state.centreon_api+'/centreon/api/index.php?object=centreon_realtime_services&action=list&limit=500&fields=id,description,state,output,host_name&searchHost='+host, {
      //fields=description  
      method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'centreon-auth-token': global.Token
            }
        }).then(res => res.json())
            .then(function (res) {
              if(that.state._isMounted)  
              that.setState({ data: res,loading:false });
            })
            .catch(error => console.error('Error:', error)); 
  };
  getColor = color =>{
        if(color.toLowerCase().startsWith("ok")) return "#88b917";
        if(color.toLowerCase().startsWith("warning")) return "#f4e640";
        if(color.toLowerCase().startsWith("critical")) return "#e00b3d";
        return "#60bbd9";
    }
    updateSearch = search => {
      this.setState({ search });
  };
  handleQueryChange= query => {
    this.setState(state => ({ ...state, search: query || "" }));
  }
  handleSearchCancel = () => this.handleQueryChange("");
  handleSearchClear = () => this.handleQueryChange(""); // maybe differentiate between cancel and clear
  render() {
    const { search } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1, alignItems: "stretch", justifyContent: "center" ,backgroundColor:"#212121"}}>
         <Header
              placement="left"
              leftComponent={this.props.navigation.getParam('HostName', '')!==''?<Icon name="arrow-back" color={"white"} onPress={() => this.props.navigation.navigate('ByHost')} />:<Menu navigation={this.props.navigation} />}
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
                selectedValue={this.props.navigation.getParam('HostName')?"By Host":"All"}
                style={{height: 50, width: 130,color:"white"}}
                onValueChange={(itemValue, itemIndex) =>
                  {
                    if(itemIndex===1) navigate('ByHost')
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
              <View>
                  {this.props.navigation.getParam('HostName')?
                    <View style={{margin:5,borderRadius:10,backgroundColor:"#333300",padding:10}}><Text style={{fontSize:18,color:"#eee"}}>Services for Host : <Text style={{fontSize:20,fontWeight:"bold"}}>{this.props.navigation.getParam('HostName')}</Text></Text></View>
                    :<Text></Text>
                  }
                {Object.keys(this.state.data).map((key, i) => (
                  <TouchableOpacity key={key} onPress={() => navigate('ServiceDetail',{ServiceName: this.state.data[key].description,HostName:this.state.data[key].host_name})} style={{margin:5,borderRadius:10,backgroundColor:this.getColor(this.state.data[key].output.split(":")[0]),padding:10,flexDirection:"row",alignItems:'center'}}>
                    <View key={key} style={{width:300}}>
                        <Text style={{fontWeight:"bold",fontSize:20}}>{ this.state.data[key].description }</Text>
                        <Text>{ this.state.data[key].output }{"\n"}</Text>
                    </View>
                    <TouchableHighlight style={{marginLeft:50}}>
                      <Icon name="arrow-forward"/>
                    </TouchableHighlight>
                  </TouchableOpacity>
              ))}
            </View>
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
  
export default ServiceScreen;