import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Drawer from 'react-native-drawer';
import { SideMenu } from '../side-menu/side-menu.component';
import { HomeNavigator } from '../../home.navigation';
import { branch } from "baobab-react/higher-order";
import BackendApi from "../../services/backend";
import { notificationService } from "../../services/notification.service";

@branch({
    menuOpen: ['menuOpen'],
})
export class LogedScreen extends Component {
    static navigationOptions = {
        header: null,
        gesturesEnabled: false,
    };

    static childContextTypes = {
        getNavigation: PropTypes.func,
        toggleMenu: PropTypes.func
    };

    getChildContext() {
        return {
            getNavigation: () => this.navigator._navigation,
            toggleMenu: () => this.toggleMenu(),
        };
    }

    async componentDidMount() {
        BackendApi.getCurrentUser();
        BackendApi.getOrganizationsList();

        notificationService.init(this.navigator._navigation);
    }

    toggleMenu() {
        this.drawer.toggle();
    }

    render() {
        return (
            <Drawer
                ref={(drawer) => {
                    this.drawer = drawer;
                }}
                open={this.props.menuOpen}
                tapToClose
                style={{
                    main: {
                        backgroundColor: '#ffffff',
                    },
                    drawer: {
                        backgroundColor: 'white',
                    }
                }}
                type="overlay"
                content={
                    <SideMenu
                        close={() => this.drawer.close()}
                        getNavigator={() => this.navigator}
                        rootNavigation={this.props.navigation}
                    />
                }
                openDrawerOffset={80}
                panOpenMask={0.1}
                side="right"
                tweenHandler={ratio => ({
                    main: { opacity: (2 - ratio) / 2 },
                })}
            >
                <HomeNavigator ref={(navigator) => {
                    this.navigator = navigator;
                }}/>
            </Drawer>
        );
    }
}
