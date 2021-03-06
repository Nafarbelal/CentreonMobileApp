import React, { Component } from "react";
import { View, StyleSheet,AsyncStorage,TouchableHighlight,Text, Image,FlatList,ScrollView ,ActivityIndicator} from "react-native";
import Menu from "../components/Menu";
import { Header,Icon,ListItem} from "react-native-elements";
import { centreon_api_key } from 'react-native-dotenv'
import moment from 'moment';
import ChartView from 'react-native-highcharts';

class ServiceDetailScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      chartData:[],
      color:"#bbbbbb",
      startDate:0,
      loading:true,
      error: null,
      refreshing: false,
    };
  }

  async componentDidMount() {
    that=this;
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
    //=================
    this.setState({_isMounted:true});
    const serviceDesc = this.props.navigation.getParam('ServiceName', 'undefined');  
    AsyncStorage.getItem('centreon_api').then((value)=>{
      if(that.state._isMounted)
        that.setState({centreon_api:value});
        this.makeRemoteRequest(serviceDesc);
      });
    //============
      })
  }

  // and don't forget to remove the listener
    componentWillUnmount () {
    this.focusListener.remove()
  }

  DataReWrite = perfdata =>{
    series=[];
    //perfdata="'used'=515141632B;0:3178751590;0:3576095539;0;3973439488 'buffer'=204521472B;;;0; 'cached'=584175616B;;;0; 'shared'=9220096B;;;0;";
    s=perfdata.split(' ');
    i=1;
    s.forEach(function(elet){
        d=elet.split('=');
        serie={
            'name':d[0],
            'data':d[1].split(';'),
           // 'yAxis':i
        };
        j=serie.data.length;
        for(i=0;i<j;i++){
            v=parseFloat(serie.data[i]);
          serie.data[i] =isNaN(v)?0:v;
        }
        i++;
        series.push(serie);
      });
      return series;
  }

  makeRemoteRequest = serviceDesc => {
      that=this
    return fetch(this.state.centreon_api+'/centreon/api/index.php?object=centreon_realtime_services&action=list&fields=last_check,last_hard_state_change,last_state_change,critically,perfdata,id,description,state,output,host_name&limit=500&search='+serviceDesc, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'centreon-auth-token': global.Token
            }
        }).then(res => res.json())
            .then(function (res) {
              i=0;
              res = res.filter(function(value, index, res){
                return value.description===serviceDesc;
              });
                startDate=parseInt(res[0].last_check);
                res[0].last_check=moment.unix(parseInt(res[0].last_check)).format('LLLL');
                res[0].last_state_change=moment.unix(parseInt(res[0].last_state_change)).format('LLLL');
                res[0].last_hard_state_change=moment.unix(parseInt(res[0].last_hard_state_change)).format('LLLL');
                color=that.getColor(res[0].state);
                res[0].state=that.getStat(res[0].state);
                res[0].criticality=res[0].critically?"Oui":"NON";
                chartData=res[0].perfdata===""?"":that.DataReWrite(res[0].perfdata);
                that.setState({ data: res[0],color:color ,startDate:startDate,chartData:chartData,loading:false});
            })
            .catch(error => console.error('Error:', error)); 
  };
  getColor = s =>{
      if (s==="0") return "#88b917";
      if (s==="1") return "#e00b3d";
      if (s==="2") return "#f4e640";
      return "#60bbd9";
    }

    getStat = s =>{
      if (s==="0") return "OK";
      if(s==="2") return "WARNING";
      if(s==="1") return "CRITICAL";
      return "UNKNOWN";
  }
    
  render() {
    
    //highcharts config
    var Highcharts='Highcharts';
    var conf={
      chart: {
        type: 'spline',
        backgroundColor:'#bcddf7',
        scrollablePlotArea: {
            height: 600,
            scrollPositionX: 1
        }
    },
    title: {
        text: this.state.data.description+" usage",
        align: 'center'
    },
    xAxis: {
        type: 'datetime',
        labels: {
            overflow: 'justify'
        }
    },
    yAxis: {
        title: {
            text: 'Usage'
        },
        minorGridLineWidth: 0,
        gridLineWidth: 0,
        alternateGridColor: null,
        max:true,
    },
    tooltip: {
        valueSuffix: ' B'
    },
    plotOptions: {
        spline: {
            lineWidth: 4,
            states: {
                hover: {
                    lineWidth: 5
                }
            },
            marker: {
                enabled: false
            },
            pointInterval: 3600000, // one hour
            pointStart: this.state.data.startDate
        }
    },
    exporting: {
      enabled: false
  },
    series: this.state.chartData,
    navigation: {
        menuItemStyle: {
            fontSize: '10px'
        }
    }
     
  };

const options = {
  global: {
      useUTC: false
  },
  lang: {
      decimalPoint: ',',
      thousandsSep: '.'
  }
};

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
                <Text style={{marginLeft:10,fontSize:18,color:'white'}}>Service {this.props.navigation.getParam('desc', 'undefined')}</Text>
                </View>
            }
              rightComponent={<Icon
              color="#fff"
              name="home"
              onPress={()=>this.props.navigation.navigate('Home')}        
              />
            }
            backgroundColor="#212121"
            style={{height:10}}
          />
      <ScrollView>
        {     
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
        <ChartView style={{height:400}} config={conf} options={options}></ChartView>
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
    },
    container: {
      flex: 1,
      justifyContent: 'center'
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10
    }
  });
  
export default ServiceDetailScreen;