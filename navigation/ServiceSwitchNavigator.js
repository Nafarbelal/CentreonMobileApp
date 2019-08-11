import { createSwitchNavigator,createStackNavigator,createAppContainer } from "react-navigation";
import ServiceStackNavigator from './ServiceStackNavigator';
import ServiceByHostScreen from '../Screens/Service/ServiceByHostScreen';

const ServiceSwitchNavigator = createAppContainer(
  createSwitchNavigator(
      {
          All: ServiceStackNavigator,
          ByHost: ServiceByHostScreen,
      },
      {
          initialRouteName: 'All',   
      }
  )
);


export default ServiceSwitchNavigator;