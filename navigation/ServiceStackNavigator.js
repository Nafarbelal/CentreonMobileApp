import {createStackNavigator} from 'react-navigation';
import ServiceScreen from '../Screens/Service/ServiceScreen';
import ServiceDetailScreen from "../Screens/Service/ServiceDetailScreen"

const ServiceStackNavigator = createStackNavigator(
    { 
      Service: ServiceScreen,
      ServiceDetail: ServiceDetailScreen
    },{
      headerMode: 'none'
    }
);

export default ServiceStackNavigator;