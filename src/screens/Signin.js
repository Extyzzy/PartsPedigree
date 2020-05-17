import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    Keyboard,
    Linking
} from 'react-native';
import { Container, Input, Form, Item, Label, Button, Content } from 'native-base';
import { NavigationActions } from 'react-navigation';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import { submitBtnCaption, validationErrorTextLight } from '../styles/Common';
import { height } from "../utils/Screensize";
import { whiteColor, submitBtn, blueLink } from "../styles/Common";
import { general, firstScreen } from "../constants/accessability";
import BackendApi from "../services/backend"
import { AuthService } from '../services/auth.service';
import NativeSplashScreen from "react-native-splash-screen";
import {Event} from "../components/event/event.component";

type Props = {};
export default class SigninScreen extends PureComponent<Props> {
    state = {
        disableBtn: false,
    };

    componentDidMount() {
        setTimeout(() => NativeSplashScreen.hide(), 500);
/*        AuthService.getToken().then(t => {
            console.log('TOKEN', t)
        })*/
        AuthService.isAuthorized()
            .then(isAuthorized => {
                if (isAuthorized) {
                    this.goToHome();
                }
            });
    }

    goToHome() {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Home' })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    _normalizeFieldValue(value) {
        return value && value.trim();
    }

    goToSignUp() {
        this.clearErrorFields();
        this.props.navigation.navigate('SignUp');
    }

    goToResetPassword() {
        this.clearErrorFields();
        this.props.navigation.navigate('ResetPassword');
    }

    validateUsername() {
        let username = this._normalizeFieldValue(this.state.username);
        const usernameError = !username ? 'Username can not be empty' : null;

        this.setState({
            username,
            usernameError,
        });
        return usernameError;
    }

    validatePassword() {
        const passwordError = !this.state.password ? 'Password can not be empty' : null;
        this.setState({
            passwordError,
        });
        return passwordError;
    }

    signin() {
        Keyboard.dismiss();

        const err = !![
            this.validateUsername(),
            this.validatePassword()
        ].reduce((err, val) => val ? ++err : err, 0);

        if (!err) {
            this.setState({ disableBtn: true }, () => {
                BackendApi.login({
                    username: this.state.username,
                    password: this.state.password,
                })
                    .then(() => this.goToHome())
                    .catch(() => {
                        this.setState({ disableBtn: false });
                    });
            });
        }
    }

    clearErrorFields() {
        this.setState({
            usernameError: null,
            passwordError: null,
        });
    }
    goToURL(url) {
        Linking.openURL(url);
    }

    render() {
        return (
            <Container>
                <Content extraHeight={150}>
                    <ImageBackground source={require('../assets/signinbg.jpg')} style={styles.bgImage}>
                        <View style={styles.container}>
                            <Form>
                                <Item
                                    error={!!this.state.usernameError}
                                    style={styles.formFieldItem}
                                    last rounded>
                                    <EvilIcon name="user" size={40} color="#fff"
                                              style={styles.inputFieldIcon}/>
                                    <Input
                                        testID='email'
                                        placeholder='Username'
                                        accessibilityLabel={firstScreen.username}
                                        placeholderTextColor='#fff'
                                        autoCapitalize="none"
                                        style={styles.input}
                                        onChangeText={value => this.setState({ username: value.trim() })}
                                        onBlur={() => this.validateUsername()}
                                        defaultValue={this.state._username}
                                        value={this.state.username}
                                        maxLength={30}
                                    />
                                </Item>
                                <Text
                                    style={validationErrorTextLight}
                                    accessibilityLabel={firstScreen.usernameError}>{this.state.usernameError}</Text>
                                <Item
                                    error={!!this.state.passwordError}
                                    style={styles.formFieldItem}
                                    last rounded>
                                    <SimpleLineIcon name="lock" size={25} color="#fff"
                                                    style={styles.inputFieldIcon}/>
                                    <Input
                                        testID='password'
                                        placeholder='Password'
                                        accessibilityLabel={firstScreen.password}
                                        placeholderTextColor='#fff'
                                        style={styles.input}
                                        onChangeText={value => this.setState({ password: value })}
                                        defaultValue={this.state._password}
                                        value={this.state.password}
                                        maxLength={32}
                                        secureTextEntry={true}
                                    />
                                </Item>
                                <Text 
                                    style={validationErrorTextLight}
                                    accessibilityLabel={firstScreen.passwordError}>{this.state.passwordError}</Text>
                                <Button
                                    testID='login'
                                    style={[submitBtn, styles.submitBtn]} 
                                    disabled={this.state.disableBtn} 
                                    onPress={() => this.signin()}
                                    accessibilityLabel={firstScreen.signInButton}>
                                    <Label style={submitBtnCaption}>Sign In</Label>
                                </Button>
                            </Form>
                            <View style={styles.btnsContainer}>
                                <Button
                                    onPress={() => this.goToSignUp()} 
                                    transparent
                                    accessibilityLabel={firstScreen.signUpButton}>
                                    <Label style={styles.btnCaption}>Create Account</Label>
                                </Button>
                                <Button 
                                    onPress={() => this.goToResetPassword()} 
                                    transparent
                                    accessibilityLabel={firstScreen.forgotPassword}>
                                    <Label style={styles.btnCaption}>Forgot Password</Label>
                                </Button>
                            </View>
                            <Text
                                style={[styles.fixScrollBottomGap, styles.smallText]}
                                accessibilityLabel={general.termsOfUse}>
                               <Text style={blueLink}
                                          onPress={ () => this.goToURL('https://privacypolicies.com/terms/view/bdf816a0bb9300fcd6df01e38c882f65')}>Terms
                                of Service</Text> |  <Text
                                style={blueLink}
                                onPress={() => this.goToURL('https://privacypolicies.com/privacy/view/a5fb86f59d5ea511c3fe4088bc8bebaf')}>Privacy
                                Policy</Text>
                            </Text>
                        </View>
                    </ImageBackground>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    bgImage: {
        width: null,
        height: null
    },
    inputFieldIcon: {
        textAlign: 'center',
        width: 40
    },
    input: {
        ...whiteColor,
        lineHeight: 20
    },
    formFieldItem: {
        backgroundColor: '#ffffff28',
        borderRadius: 15
    },
    smallText: {
        color: 'lightgray',
        fontSize: 10,
        alignSelf: 'center',
        textAlign: 'center'
    },
    container: {
        padding: 30,
        height: height(100),
        flex: 1,
        alignContent: 'stretch',
        justifyContent: 'flex-end',
    },
    btnsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50
    },
    btnCaption: {
        color: 'white',
        fontSize: 12
    },
    submitBtn: {
        marginTop: 0,
        width: '100%'
    }
});