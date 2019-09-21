import React , { Component }from "react";
import { AsyncStorage,View, Text,StyleSheet,TouchableHighlight ,Button,ActivityIndicator} from "react-native";
import MyHeader from './components/MyHeader'

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading:true,
      error: null,
      hosts:{
        nbr:0,
        up:0,
        down:0,
        unreachable:0,
        pending:0
      },
      services:{
        nbr:0,
        ok:0,
        warning:0,
        critical:0,
        unknown:0
      },
      refreshing: false,
      centreon_api:'',
    };
    this.makeRemoteRequest=this.makeRemoteRequest.bind(this);
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

  makeRemoteRequest = function  (){
      that=this;  
fetch(this.state.centreon_api+'/centreon/api/index.php?action=list&object=centreon_realtime_hosts&viewType=all&order=desc&fields=id,host_id,state&limit=500', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'centreon-auth-token': global.Token
          }
      }).then(res => res.json())
          .then(function (res) {
            var hosts={
              nbr:0,
              up:0,
              down:0,
              unreachable:0,
              pending:0
            };  
            res.forEach(function (r) {
              hosts.nbr++;    
              switch(r.state) {
                      case '0':
                        hosts.up++;;
                          break;
                      case '1':
                        hosts.down++;
                          break;
                      case '2':
                        hosts.unreachable++;
                        break;
                      case '3':
                          hosts.pending++;
                          break;
                  }
              });
              
              that.setState({ hosts: hosts,loading:false }); 
          })
          .catch(error => console.error('Error:', error)); 
  //fetch services
  fetch(this.state.centreon_api+'/centreon/api/index.php?object=centreon_realtime_services&action=list&limit=500', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'centreon-auth-token': global.Token
            }
        }).then(res => res.json())
            .then(function (res) {
              var services={
                nbr:0,
                ok:0,
                warning:0,
                critical:0,
                unknown:0
              };  
              res.forEach(function (r) {
                services.nbr++;    
                switch(r.state) {
                        case '0':
                          services.ok++;;
                            break;
                        case '1':
                          services.warning++;
                            break;
                        case '2':
                          services.critical++;
                          break;
                        case '3':
                          services.unknown++;
                          break;
                    }
                });
                
                that.setState({ services: services }); 
            })
            .catch(error => console.error('Error:', error)); 

        };
  getColor = s =>{
        if(s==="0") return "#88b917";
        if(s==="2") return "#f4e640";
        if(s==="3") return "#990000";
        return "#60bbd9";
    }
    getStatus= s =>{
        if(s==="0") return "UP";
        if(s==="2") return "Down";
        if(s==="3") return "Unreachable";
        return "#60bbd9";    
    }
  render(){
    const { navigate } = this.props.navigation;

    return (
      <View style={{backgroundColor:"#303030",height:"100%"}}>
    <MyHeader navigation={this.props.navigation || ''} title="Centreon Dashboard" />
    {
      this.state.loading===true?
              <View style={{marginTop:100}}>
                <ActivityIndicator size={100} color="#0000ff" />
              </View>
            :
            <>
  <TouchableHighlight style={styles.ButtonContainer} onPress={() => navigate('Hosts')}>
      <Text style={styles.button}>{this.state.hosts.nbr} Hosts</Text>
  </TouchableHighlight>
  
  <View style={styles.viewStatus}>
    <View style={styles.viewStatus2}>
      <Text style={{color:"#87bd23",fontSize:17}}>UP</Text>
      <Text style={{marginTop:15,color:"#87bd23",fontSize:17}}>{this.state.hosts.up}</Text>
    </View>
    
    <View style={styles.viewStatus2}>
      <Text style={{color:"#ed1b23",fontSize:17}}>DOWN</Text>
      <Text style={{marginTop:15,color:"#ed1b23",fontSize:17}}>{this.state.hosts.down}</Text>
    </View>

    <View style={styles.viewStatus2}>
      <Text style={{color:"#818185",fontSize:17}}>UNREACHABLE</Text>
      <Text style={{marginTop:15,color:"#818185",fontSize:17}}>{this.state.hosts.unreachable}</Text>
    </View>

    <View style={styles.viewStatus2}>
      <Text style={{color:"#2ad1d4",fontSize:17}}>PENDING</Text>
      <Text style={{marginTop:15,color:"#2ad1d4",fontSize:17}}>{this.state.hosts.pending}</Text>
    </View>

  </View>
  
  <TouchableHighlight style={styles.ButtonContainer}  onPress={() => navigate('Services')}>
      <Text style={styles.button}>{this.state.services.nbr} Services</Text>
  </TouchableHighlight>  

  <View style={styles.viewStatus}>
    <View style={styles.viewStatus2}>
      <Text style={{color:"#87bd23",fontSize:17}}>OK</Text>
      <Text style={{marginTop:15,color:"#87bd23",fontSize:17}}>{this.state.services.ok}</Text>
    </View>
    
    <View style={styles.viewStatus2}>
      <Text style={{color:"#f4e640",fontSize:17}}>WARNING</Text>
      <Text style={{marginTop:15,color:"#f4e640",fontSize:17}}>{this.state.services.warning}</Text>
    </View>

    <View style={styles.viewStatus2}>
      <Text style={{color:"#ed1c24",fontSize:17}}>CRITICAL</Text>
      <Text style={{marginTop:15,color:"#ed1c24",fontSize:17}}>{this.state.services.critical}</Text>
    </View>

    <View style={styles.viewStatus2}>
      <Text style={{color:"#cdcdcd",fontSize:17}}>UNKNOWN</Text>
      <Text style={{marginTop:15,color:"#cdcdcd",fontSize:17}}>{this.state.services.unknown}</Text>
    </View>

  </View>
  </>}
</View>

    );
  }
}

const styles = StyleSheet.create({
    viewStatus: {
        flexDirection :'row',
        justifyContent:'space-between',
        marginTop:10,
        paddingLeft:20,
        paddingRight:20,
        marginBottom:20
    },
    viewStatus1:{
    },
    viewStatus2: {
        flexDirection :'column',
        alignItems:"center",
    },
    viewStatus3:{
        alignItems:"center",
        borderColor:"#2b2626",
        borderWidth:1,
        margin:10,
        padding:10
    },
    ButtonContainer:{
      alignItems:"center",
      borderWidth:2,
      borderRadius:5,
      borderColor:"#333333",
      backgroundColor:"#262626",
      margin:15,
      padding:10,
   //   marginBottom:15,
      marginTop:20
    },
    button:{
      fontSize:25,
      color:"white"
    }
  })


export default HomeScreen;