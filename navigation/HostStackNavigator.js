import {createStackNavigator} from 'react-navigation';
import HostScreen from '../Screens/Hosts/HostScreen';
import HostDetailScreen from "../Screens/Hosts/HostDetailScreen"

const HostStackNavigator = createStackNavigator(
    { 
        Hosts: HostScreen,
        HostDetail: HostDetailScreen
    },{
      headerMode: 'none'
    }
);

export default HostStackNavigator;