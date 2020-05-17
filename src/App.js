import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {View, TouchableWithoutFeedback, Linking} from 'react-native';
import { root } from 'baobab-react/higher-order';
import { state } from './state';
import { AppNavigator } from './app.navigation';
import { BackendApi } from './services/backend';
import { commonStyle } from "./styles/common.style";
import {StateService} from "./services/state.service";

class AppComponent extends Component {
    static childContextTypes = {
        setBackdropCb: PropTypes.func,
        unsetBackdropCb: PropTypes.func,
    };

    state = {
        backdropCb: null,
    };

    getChildContext() {
        return {
            setBackdropCb: (backdropCb) => this.setState({ backdropCb }),
            unsetBackdropCb: () => this.setState({ backdropCb: null})
        };
    }

    componentDidMount() {
      Linking.getInitialURL().then(url => {
        if (url) {
          StateService.setUrlFromBrowser(url);
        }
      });

      BackendApi.getCountryList();
    }

    onPressBackdrop() {
        if (typeof this.state.backdropCb === 'function') {
            this.state.backdropCb();
        }

        this.setState({ backdropCb: null });
    }

    render() {
        return (
            <View style={commonStyle.flex(1)}>
                <AppNavigator/>
                {this.state.backdropCb &&
                <TouchableWithoutFeedback onPress={() => this.onPressBackdrop()}>
                    <View style={commonStyle.overlay}/>
                </TouchableWithoutFeedback>
                }
            </View>
        );
    }
}

export const App = root(state, AppComponent);

{/* <key>NSAppTransportSecurity</key>
	<dict>
		<key>NSExceptionDomains</key>
		<dict>
			<key>localhost</key>
			<dict>
				<key>NSExceptionAllowsInsecureHTTPLoads</key>
				<true/>
			</dict>
		</dict>
	</dict>  */}
