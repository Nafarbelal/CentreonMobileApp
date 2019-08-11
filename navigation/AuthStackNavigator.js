import {createStackNavigator} from 'react-navigation';
import Login from '../Screens/LoginScreen';

const AuthStack = createStackNavigator(
    { SignIn: Login },
    {
      headerMode: 'none'
    }
);

export default AuthStack;