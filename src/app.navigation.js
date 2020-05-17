import React from 'react';
import { StackNavigator } from 'react-navigation';

import SignupScreen from './screens/Signup';
import SignInScreen from './screens/Signin';
import ResetPassScreen from './screens/ResetPass';
import { LogedScreen } from './screens/loged-screen/loged-screen.component';

export const AppNavigator = StackNavigator({
    SignIn: {
        screen: SignInScreen,
    },
    SignUp: {
        screen: SignupScreen,
    },
    ResetPassword: {
        screen: ResetPassScreen,
    },
    Home: {
        screen: LogedScreen,
        navigationOptions: {
            gesturesEnabled: false,
        }
    }
}, {
    initialRouteName: 'SignIn',
    navigationOptions: {
        header: null,
    }
});
