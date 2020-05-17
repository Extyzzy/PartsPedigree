import React, { PureComponent } from 'react';
import {
    StyleSheet, Text, View, Keyboard, Alert
} from 'react-native';
import { Content, Button, Form, Title } from 'native-base';
import { width } from "../utils/Screensize";
import BackendApi from "../services/backend"
import { submitBtn, whiteColor, submitBtnCaption, inlineHeader } from "../styles/Common";
import TextInputValid from "../components/TextInputValid";
import validate from "../utils/Validate";
import { resetPass } from "../constants/accessability";
import UserFields from "../constants/FormFieldsContraints";
import { ContainerBG } from "../components/ContainerBG";
import { commonStyle } from "../styles/common.style";

type Props = {};
export default class ResetPassScreen extends PureComponent<Props> {
    constructor(props) {
        super(props);
        this.state = {
            disableBtn: false,
        };
    }

    validateEmail() {
        const emailError = validate({ email: this.state.email }, { email: UserFields.email }).email;
        this.setState({
            emailError: emailError
        });
        return emailError;
    }

    goToSignIn() {
        this.props.navigation.goBack();
    }

    resetPassword() {
        Keyboard.dismiss();
        if (!this.validateEmail()) {
            this.setState({ disableBtn: true }, () => {
                BackendApi.requestResetPassword(this.state.email)
                    .then(() => {
                        Alert.alert('Success', 'Please check your email', [{
                            text: 'OK', onPress: () => this.goToSignIn()
                        }]);
                    })
                    .catch(() => {
                        Alert.alert('Success', 'Please check your email', [{
                            text: 'OK', onPress: () => this.goToSignIn()
                        }]);
                    });
            })

        }
    }

    render() {
        return (
            <ContainerBG>
                <Content scrollEnabled={true} contentContainerStyle={{ flexGrow: 1, alignItems: 'stretch' }} padder>
                    <View style={inlineHeader}>
                        <Title 
                            style={[whiteColor, commonStyle.indent(30)]} 
                            accessibilityLabel={resetPass.pageTitle}>
                            RESET PASSWORD
                        </Title>
                    </View>
                    <Text style={[whiteColor, { flex: 0 }]}>
                        Enter the email address associated with your PartsPedigree account. We'll email you a
                        link to
                        a page where you can easily create a new password.
                    </Text>
                    <Form style={{ flex: 0, paddingTop: 20 }}>
                        <Text style={styles.inputLabel} accessibilityLabel={resetPass.emailLabel}>
                            * Email
                        </Text>
                        <TextInputValid
                            accessibilityLabel={resetPass.emailInput}
                            light
                            autoCapitalize="none"
                            style={styles.input}
                            onChangeText={value => this.setState({ email: value.trim() })}
                            onBlur={() => this.validateEmail()}
                            defaultValue={this.state._email}
                            value={this.state.email}
                            error={this.state.emailError}
                            maxLength={50}
                        />
                    </Form>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        paddingBottom: 15,
                    }}>
                        <Button style={[submitBtn, styles.submitBtn]}
                                disabled={this.state.disableBtn}
                                onPress={() => this.resetPassword()}
                                accessibilityLabel={resetPass.resetButton}>
                            <Text style={submitBtnCaption}>Send me a reset link</Text>
                        </Button>
                        <Button
                            transparent
                            style={[submitBtn, styles.cancelBtn]}
                            onPress={() => this.goToSignIn()}
                            accessibilityLabel={resetPass.cancelButton}>
                            <Text style={whiteColor}>Cancel</Text>
                        </Button>
                    </View>
                </Content>
            </ContainerBG>
        );
    }
}

const styles = StyleSheet.create({
    radialGradient: {
        width: width(100),
        height: '100%',
    },
    submitBtn: {
        flex: 0.6,
        alignSelf: 'flex-end'
    },
    cancelBtn: {
        flex: 0.3,
        backgroundColor: 'transparent',
        alignSelf: 'flex-end',
        justifyContent: 'center'
    },
    container: {
        alignItems: 'center'
    },
    inputLabel: {
        alignSelf: 'flex-start',
        color: '#ffffff7f',
        fontSize: 12
    },
    input: {
        height: 40,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomColor: 'white',
        borderWidth: 1,
        marginBottom: 20,
        color: 'white'
    }
});
