import React, { Component } from "react";
import { View, TouchableHighlight,StyleSheet,Text, Image,ActivityIndicator,ScrollView,Picker } from "react-native";
import Menu from "../components/Menu";
import { Icon,Header,SearchBar} from "react-native-elements";
import { centreon_api_key } from 'react-native-dotenv'
import CustomHeader from '../components/MyHeader'

class ServiceScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      search:'',
      error: null,
      loading:true,
      //language:'',
      refreshing: false,
      search: ''
    };
  }

  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      host = this.props.navigation.getParam('desc', '');
      console.log("host is : "+host);    
      this.makeRemoteRequest(host);
        console.log("services screen mounted");
    })
  }

  // and don't forget to remove the listener
    componentWillUnmount () {
    this.focusListener.remove()
  }

  makeRemoteRequest = host => {
      that=this
    return fetch('http://'+centreon_api_key+'/centreon/api/index.php?object=centreon_realtime_services&action=list&limit=500&searchHost='+host, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'centreon-auth-token': global.Token
            }
        }).then(res => res.json())
            .then(function (res) {
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
      console.log("state :"+this.state.search);
  };
  handleQueryChange= query => {
    this.setState(state => ({ ...state, search: query || "" }));
  }
  handleSearchCancel = () => this.handleQueryChange("");
  handleSearchClear = () => this.handleQueryChange(""); // maybe differentiate between cancel and clear
  render() {
    const { search } = this.state;
       
    //console.log("stat=======================================================\n"+JSON.stringify(this.state.data[0]))
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1, alignItems: "stretch", justifyContent: "center" ,backgroundColor:"#212121"}}>
         <Header
              placement="left"
              leftComponent={this.props.navigation.getParam('desc', '')!==''?<Icon name="arrow-back" color={"white"} onPress={() => this.props.navigation.navigate('ByHost')} />:<Menu navigation={this.props.navigation} />}
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
                selectedValue="All"
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
        <SearchBar
          placeholder="Service Name..."
          onChangeText={this.updateSearch}
          value={search}
          round
          cancelIcon
          clearIcon={{size:30,paddingRight:5}}
          inputContainerStyle={{paddingRight:20}}
          rightIconContainerStyle={{width:50}}
          value={this.state.search}
          onChangeText={this.handleQueryChange}
          onClear={this.handleSearchClear}
        />
          { 
            this.state.loading===true?
              <View style={{marginTop:100}}>
                <ActivityIndicator size={100} color="#0000ff" />
              </View>
            :
              Object.keys(this.state.data).map((key, i) => (
                <View key={key} style={{margin:5,borderRadius:10,backgroundColor:this.getColor(this.state.data[key].output.split(":")[0]),padding:10,flexDirection:"row",alignItems:'center'}}>
                  <View key={key} onPress={()=>{console.log("it works")}} style={{width:300}}>
                      <Text style={{fontWeight:"bold",fontSize:20}}>{ this.state.data[key].description }</Text>
                      <Text>{ this.state.data[key].output }{"\n"}</Text>
                  </View>
                  <TouchableHighlight style={{marginLeft:50}}  onPress={() => navigate('ServiceDetail',{desc: this.state.data[key].description})}>
                    <Icon name="arrow-forward"/>
                  </TouchableHighlight>
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
        flexDirection :'row'
    }
  
  })
  
export default ServiceScreen;