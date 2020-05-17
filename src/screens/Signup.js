import React, {PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    Alert,
    View, Modal, TouchableOpacity, ScrollView, Image, Linking
} from 'react-native';
import {Content, Button, Label, Title} from 'native-base';
import {branch} from "baobab-react/higher-order";
import {width, height} from "../utils/Screensize";
import {registration, general} from "../constants/accessability";
import BackendApi from "../services/backend"
import {
    submitBtn, blueLink, submitBtnCaption, whiteColor, inlineHeader
} from "../styles/Common";
import {ContainerBG} from "../components/ContainerBG";
import {UserEditForm} from '../components/user-edit-form/user-edit-form.component';
import {commonStyle} from "../styles/common.style";
import {VARIABLES} from "../styles/variables";
import {ScreenDetector} from "../utils/screen-detector";
import Moment from "moment/moment";

type Props = {};

@branch({
    countries: ['countries'],
})
export default class SignupScreen extends PureComponent<Props> {
    constructor(props) {
        super(props);
        this.state = {
            disableBtn: false,
            visible: true,
            TermsAccepted: false,
            dateAccepted: null
        }
    }

    userEditForm = false;


    register() {
        if (this.state.TermsAccepted) {
            let user = JSON.parse(JSON.stringify(this.userEditForm.validate()));
            if (user) {
                user['privacyPolicyAcceptedAt'] = this.state.dateAccepted;
                this.setState({disableBtn: true}, () => {
                    BackendApi.createNewUser(user)
                        .then(() => {
                            Alert.alert(
                                'Success',
                                'Your account was successfully created. Please confirm your email to login.',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => this.goToSignIn()
                                    }
                                ],
                                {cancelable: false}
                            );
                        })
                        .catch(() => {
                            this.setState({disableBtn: false});
                        });
                });
            }
        } else {
            return Alert.alert(
                'Failed', 'Please accept our privacy settings in order to complete your account set up.You can always update your settings at a later time by contacting Parts Pedigree at info@partspedigree.com.'
            );
        }
    }

    goToSignIn() {
        this.props.navigation.goBack();
    }

    closeModal() {
        this.setState({visible: false})
    }

    acceptGDPR() {
        this.setState({
            TermsAccepted: true,
            visible: false,
            dateAccepted:  Moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        })
    }

    goToURL(url) {
        Linking.openURL(url);
    }

    renderModal() {
        return (
            <Modal visible={this.state.visible}
                   transparent
                   onRequestClose={() => this.closeModal()}
            >
                <View style={{marginRight: 15, marginLeft: 15, height: '80%', marginTop: 45, borderRadius: 5}}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(255,255,255, 1)',
                            paddingHorizontal: ScreenDetector.isPhone() ? 10 : 20,
                            paddingVertical: ScreenDetector.isPhone() ? 15 : 30,
                            borderRadius: 5,
                            borderWidth: 1,
                            paddingTop: 15,
                        }}>
                        <View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={styles.title}>
                                    Privacy Settings
                                </Text>
                                <TouchableOpacity
                                    style={{
                                        paddingTop: 15,
                                        paddingBottom: 15,
                                        paddingRight: 15,
                                        paddingLeft: 15
                                    }}
                                    onPress={ () => this.closeModal()}
                                >
                                    <Image style={{width: 15, height: 15}}
                                           source={require('../assets/icons/cross_gray_icon.png')}/>
                                </TouchableOpacity>
                            </View>
                            <Text style={[{marginBottom: 15, fontSize: 14}]}>
                                Parts Pedigree protects your privacy by adhering to the European Union General Data
                                Protection Regulation (GDPR).
                                We request use of anonymized data to improve your experience with our app,
                                and you can opt out at any time by contacting us.
                            </Text>
                            <Text style={styles.title}>
                                Analytics
                            </Text>
                            <Text style={[{marginBottom: 15, fontSize: 14}]}>
                                We will store anonymized data in an aggregated form about visitors and their experiences
                                on
                                our app.
                                We use data to fix bugs and improve the experience for all visitors.
                            </Text>
                            <Text style={styles.title}>
                                Geolocation Data
                            </Text>
                            <Text style={[{marginBottom: 15, fontSize: 14}]}>
                                We capture the GPS coordinates of the device that interacts with our platform only when
                                a
                                shipping, receiving or change event occurs in our system. We use this data to provide
                                statistical data on how parts move around the world and are interacted with as well as
                                to
                                offer compliance information (in the future) to help with ITAR, EAR and other regulatory
                                bodies.
                            </Text>
                            <Text style={styles.smallText}>
                                Please review our <Text style={blueLink}
                                                        onPress={() => this.goToURL('https://privacypolicies.com/privacy/view/a5fb86f59d5ea511c3fe4088bc8bebaf')}>Privacy
                                Policy</Text>
                                and <Text style={blueLink}
                                          onPress={ () => this.goToURL('https://privacypolicies.com/terms/view/bdf816a0bb9300fcd6df01e38c882f65')}>Terms
                                and Conditions</Text>. If you
                                would like
                                to
                                exercise any of your rights regarding your personal data, please contact us at
                                info@partspedigree.com.
                            </Text>
                        </View>
                        <View style={{width: 150}}>
                            <Button
                                style={[submitBtn, styles.submitBtn]}
                                onPress={() => this.acceptGDPR()}
                            >
                                <Label style={submitBtnCaption}>I ACCEPT</Label>
                            </Button>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        )
    }

    render() {
        return (
            <ContainerBG style={styles.container}>
                <Content padder showsVerticalScrollIndicator={false} accessibilityLabel={'Scroll'}>
                    <View style={inlineHeader}>
                        <Title style={whiteColor} accessibilityLabel={registration.pageTitle}>CREATE ACCOUNT</Title>
                    </View>
                    <UserEditForm
                        signUp
                        ref={(userEditForm) => {
                            this.userEditForm = userEditForm;
                        }}
                        countries={this.props.countries}
                    />
                    <Button
                        style={[submitBtn, styles.submitBtn]}
                        disabled={this.state.disableBtn}
                        onPress={() => this.register()}
                        accessibilityLabel={registration.createAccountButton}>
                        <Label style={submitBtnCaption}>Create Account</Label>
                    </Button>
                    <View style={commonStyle.indent(15)}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text
                                style={styles.signInBtn}
                                onPress={() => this.goToSignIn()}
                                accessibilityLabel={registration.goToSignInButton}>Already have an
                                Account?
                            </Text>
                            <Text
                                style={styles.signInBtn}
                                onPress={() => this.setState({visible: true})}
                                accessibilityLabel={registration.goToSignInButton}>Accept Privacy Settings?
                            </Text>
                        </View>
                        <Text
                            style={[styles.fixScrollBottomGap, styles.smallText]}
                            accessibilityLabel={general.termsOfUse}>
                            By signing up, you agree with
                            the <Text style={blueLink}
                                      onPress={ () => this.goToURL('https://privacypolicies.com/terms/view/bdf816a0bb9300fcd6df01e38c882f65')}>Terms
                            of Service</Text> and <Text
                            style={blueLink}
                            onPress={() => this.goToURL('https://privacypolicies.com/privacy/view/a5fb86f59d5ea511c3fe4088bc8bebaf')}>Privacy
                            Policy</Text>
                        </Text>
                    </View>
                    <View>
                        {this.renderModal()}
                    </View>
                </Content>
            </ContainerBG>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: VARIABLES.H3_SIZE,
        marginBottom: 15,
        fontWeight: 'bold',
    },
    text: {
        fontSize: VARIABLES.H3_SIZE,
    },
    btnsContainer: {
        width: '100%',
    },
    confirmBtnText: {
        fontSize: VARIABLES.H2_SIZE,
        fontWeight: 'bold',
    },
    smallText: {
        color: 'lightgray',
        fontSize: 10,
        textAlign: 'center'
    },
    fixScrollBottomGap: {
        marginBottom: height(5)
    },
    signInBtn: {
        alignSelf: 'flex-end',
        marginTop: 10,
        marginBottom: 20,
        color: 'white',
        fontSize: 13
    },
    radialGradient: {
        width: width(100),
        height: height(100),
    },
    submitBtn: {
        width: '100%'
    },
    content: {
        paddingBottom: 15,
        paddingTop: 15
    },
    container: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: width(100),
        height: height(100),
    },
    inputLabel: {
        alignSelf: 'flex-start',
        color: '#ffffff7f',
        fontSize: 12
    },
    input: {
        width: '100%',
        height: 30,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomColor: 'white',
        borderWidth: 1,
        color: 'white'
    }
});
