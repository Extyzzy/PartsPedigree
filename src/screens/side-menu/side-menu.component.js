import React, {Component} from 'react';
import PropTypes from 'prop-types';
import VersionNumber from 'react-native-version-number';
import {NavigationActions} from 'react-navigation';
import {View, Text, ImageBackground, ScrollView, TouchableOpacity, Linking} from 'react-native';
import {Container} from 'native-base';
import {SideMenuStyle as style} from './side-menu.style';
import {MenuItem} from './menu-item.component';
import {branch} from "baobab-react/higher-order";
import {User} from "../../models/user";
import {AuthService} from "../../services/auth.service";
import {ProfileImage} from '../../components/profile-image/profile-image.component';
import {general} from "../../constants/accessability";
import {width, height} from "../../utils/Screensize";
import {
    submitBtn, blueLink, submitBtnCaption, whiteColor, inlineHeader
} from "../../styles/Common";

@branch({
    user: ['user'],
})
export class SideMenu extends Component {
    static propTypes = {
        getNavigator: PropTypes.func.isRequired,
        rootNavigation: PropTypes.object,
        close: PropTypes.func.isRequired,
    };

    goToProfile() {
        this.props.close();
        const {_navigation} = this.props.getNavigator();
        _navigation.navigate('UserProfile');
    }

    logout() {
        const {rootNavigation} = this.props;

        AuthService
            .logout()
            .then(() => {
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({routeName: 'SignIn'})],
                });
                rootNavigation.dispatch(resetAction);
            });
    }

    goToURL(url) {
        Linking.openURL(url);
    }

    render() {
        const user: User = this.props.user || new User();

        return (
            <Container style={style.main}>
                <ImageBackground style={style.header} source={require('../../assets/side_menu_header_bg.png')}>
                    <Container style={style.headerContent}>
                        <ProfileImage
                            firstName={user && user.firstName}
                            lastName={user && user.lastName}
                            size={50}
                            initialsSize={24}
                            uri={user.image && user.image.path}
                        />
                        <View>
                            <Text style={style.avatarText} accessibilityLabel={general.userFullName}>
                                {user && user.firstName} {user && user.lastName}
                            </Text>
                            <Text style={[style.avatarText, style.avatarSmallText]}
                                  accessibilityLabel={general.userOrg}>
                                {user && user.organization}
                            </Text>
                        </View>
                        <TouchableOpacity activeOpacity={0.5} style={style.headerBtn}
                                          onPress={() => this.goToProfile()}>
                            <Text style={style.headerBtnText} accessibilityLabel={general.userViewProfile}>
                                View Profile
                            </Text>
                        </TouchableOpacity>
                    </Container>
                </ImageBackground>
                <Container style={style.content}>
                    <ScrollView accessibilityLabel={general.sideMenuScroll}>
                        <MenuItem text="Show Favorites" icon="star" iconSize="18x16"/>
                        <View style={style.menuDivider}/>
                        <MenuItem text="Settings" icon="settings" iconSize="20x19"/>
                        <MenuItem text="Admin (User, Organizations, etc.)" icon="settings" iconSize="20x19"/>
                        <View style={style.menuDivider}/>
                        <MenuItem text="Invite People" icon="invite" iconSize="19x18"/>
                        <MenuItem text="Like/Follow PartsPedigree" icon="like" iconSize="17x20"/>
                        <MenuItem text="Rate PartsPedigree" icon="rate" iconSize="20x6"/>
                        <View style={style.menuDivider}/>
                        <MenuItem text="Help" icon="help" iconSize="17x17"/>
                        <MenuItem text="Tutorial" icon="tutorial" iconSize="19x15"/>
                        <View style={style.menuDivider}/>
                        <MenuItem text="Report a problem" icon="report" iconSize="19x17"/>
                        <MenuItem text="Provide feedback" icon="feedback" iconSize="19x19"/>
                        <MenuItem text="About" icon="about" iconSize="19x19"/>
                        <MenuItem text="Logout" onPress={() => this.logout()}/>
                        <View style={style.menuDivider}/>
                        <Text accessibilityLabel={general.releaseVersion}>
                            Release version: {VersionNumber.appVersion}
                        </Text>
                        <Text accessibilityLabel={general.buildVersion}>
                            Build version: {VersionNumber.buildVersion}
                        </Text>
                        <Text
                            style={{
                                marginTop: height(5),
                                marginBottom: height(5), color: 'lightgray',
                                fontSize: 10,
                                textAlign: 'center'
                            }}
                            accessibilityLabel={general.termsOfUse}>
                            <Text style={blueLink}
                                      onPress={ () => this.goToURL('https://privacypolicies.com/terms/view/bdf816a0bb9300fcd6df01e38c882f65')}>Terms
                            of Service</Text> | <Text
                            style={blueLink}
                            onPress={() => this.goToURL('https://privacypolicies.com/privacy/view/a5fb86f59d5ea511c3fe4088bc8bebaf')}>Privacy
                            Policy</Text>
                        </Text>
                    </ScrollView>
                </Container>
            </Container>
        );
    }
}
