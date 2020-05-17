import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Text, View, Alert, Keyboard} from 'react-native';
import {Form, Textarea} from 'native-base';
import {validationErrorTextLight, whiteColor} from "../../styles/Common";
import TextInputValid from "../TextInputValid";
import {userEditStyle as style} from './user-edit-form.style';
import validate from "../../utils/Validate";
import Picker from "react-native-picker/index";
import UserFields from "../../constants/FormFieldsContraints";
import {registration, general} from "../../constants/accessability";
import {User} from "../../models/user";
import {Country} from "../../models/country";
import {commonStyle} from "../../styles/common.style";
import {CrossBtn} from "../cross-btn.component";
import {FormCheckbox} from "../../components/form-checkbox.component";

type Props = {
    countries: Array<Country>;
}

export class UserEditForm extends Component<Props> {
    static propTypes = {
        user: PropTypes.object,
        isEdit: PropTypes.bool,
        signUp: PropTypes.bool,
        countries: PropTypes.array,
    };

    static defaultProps = {
        user: null,
        countries: [],
        signUp: false,
    };

    static contextTypes = {
        setBackdropCb: PropTypes.func,
        unsetBackdropCb: PropTypes.func,
    };

    state = {
        user: new User(),
    };

    componentDidMount() {
        if (this.props.user) {
            this.setState({user: {...this.props.user}});
        } else {
            this.state.user.citizenships = []
        }

    }

    componentWillUnmount() {
        Picker.hide();
        this.context.unsetBackdropCb();
    }

    validate() {
        const validations = this.props.isEdit ?
            [this.validateFirstName(),
                this.validateLastName(),
                this.validateCountry(),
                this.validateFirstName(),
                this.validateTitle(),
                this.validateAuthorizationNumber(),
                this.validateCertifications(),
            ] :
            [this.validateFirstName(),
                this.validateLastName(),
                this.validateCountry(),
                this.validateEmail(),
                this.validateUsername(),
                this.validatePassword(),
                this.validateConfirmPassword(),
                this.validateFirstName(),
                this.validateTitle(),
                this.validateAuthorizationNumber(),
                this.validateCertifications(),
            ];

        let err = 0;
        validations.forEach(item => item && err++);

        return !err ? this.state.user : null;
    }

    showCountryPicker() {
        if (!this.props.countries || !this.props.countries.length) {
            return Alert.alert('Countries not loaded from the server, check connection and try again.');
        }
        const pickerData = this.props.countries.map(item => item.name);
        let country = this.state.country;
        if (pickerData.indexOf(country) !== -1) {
            country = pickerData.name;
        }
        Picker.init({
            isFocusable: true,
            pickerTitleText: 'Country of Citizenship',
            pickerConfirmBtnText: 'Ok',
            pickerCancelBtnText: 'Cancel',
            pickerToolBarBg: [64, 87, 110, 1],
            pickerTitleColor: [255, 255, 255, 1],
            pickerConfirmBtnColor: [255, 255, 255, 1],
            pickerCancelBtnColor: [255, 255, 255, 1],
            pickerData: pickerData,
            selectedValue: [country],
            pickerTextEllipsisLen: 16,
            onPickerConfirm: (data, idx) => {
                this.context.unsetBackdropCb();
                const {user} = this.state;
                const {countries, signUp} = this.props;

                // user.countryId = countries[idx] && countries[idx].country_id;
                // user.country = countries[idx] && countries[idx].name;

                const country = {
                    countryId: countries[idx].country_id,
                    country: countries[idx].name,
                    countryCode: countries[idx].countryCode
                };

                let userCitizenships = user.citizenships;

                if (countries[idx]) {
                    user.citizenships = [
                        ...userCitizenships,
                        country
                    ];
                    user.country = countries[idx].name;
                    user.countryId = countries[idx].country_id
                }

                this.setState({
                        user,
                        country: countries[idx] ? countries[idx] : '',
                        countryBlured: true
                    },
                    () => this.validateCountry()
                );
            },
            onPickerCancel: () => {
                this.context.unsetBackdropCb();
            }
        });
        Keyboard.dismiss();
        Picker.show();
        this.context.setBackdropCb(() => Picker.hide());
    }

    renderCountryInput() {
        const {user} = this.state;

        if (!this.props.countries.length > 1) {
            return (
                <Text>Loading...</Text>
            )
        }

        return (
            <View>
                <View style={style.input}>
                    <Text
                        accessibilityLabel={general.countryPickerModal}
                        style={style.countryInput}
                        onPress={() => {
                            this.showCountryPicker();
                        }}>Choose country</Text>
                </View>
                <View style={style.countryContainer}>
                    {
                        user.citizenships && this.state.user.citizenships.length > 0 && (
                            user.citizenships.map((data, key) => {
                                return (
                                    <View key={key} style={style.countryNameContainer}>
                                        <Text key={key} style={style.country}>
                                            {data.country}
                                        </Text>
                                        <CrossBtn onPress={() => {
                                            let updatedCountries = user.citizenships.filter(country => country.countryId !== data.countryId);

                                            this.setState(prevState => ({
                                                user: {
                                                    ...prevState.user,
                                                    citizenships: updatedCountries
                                                }
                                            }));
                                        }}/>
                                    </View>
                                )
                            })
                        )
                    }
                </View>
                <Text
                    accessibilityLabel={registration.countryPickerError}
                    style={validationErrorTextLight}
                    numberOfLines={1}
                    ellipsizeMode='head'>
                    {this.state.countryError}
                </Text>
            </View>
        );
    }

    _validateField(fieldName) {
        const {user} = this.state;

        let value = this._normalizeFieldValue(fieldName);
        const errors = validate({[fieldName]: value}, {[fieldName]: UserFields[fieldName]})[fieldName];
        user[fieldName] = value;

        this.setState({
            [`${fieldName}Error`]: errors,
            user,
        });

        return errors;
    }

    validateFirstName() {
        return this._validateField('firstName');
    }

    validateLastName() {
        return this._validateField('lastName');
    }

    validateCountry() {
        const {user} = this.state;

        const countryError = validate({country: user.country}, {country: UserFields.country}).country;
        this.setState({
            countryError: countryError
        });
        return countryError;
    }

    validateEmail() {
        return this._validateField('email');
    }

    validateUsername() {
        return this._validateField('username');
    }

    validatePassword() {
        const {password} = this.state.user;

        const passwordError = validate({password}, {password: UserFields.passwordSimplified}).password ||
            validate({password}, {password: UserFields.password1}).password ||
            validate({password}, {password: UserFields.password2}).password ||
            validate({password}, {password: UserFields.password3}).password ||
            validate({password}, {password: UserFields.password4}).password;
        this.setState({
            passwordError: passwordError
        });
        return passwordError;
    }

    validateConfirmPassword() {
        const confirmPasswordError = validate({
            'confirmPassword': this.state.user.confirmPassword,
            'password': this.state.user.password
        }, {confirmPassword: UserFields.confirmPassword, password: UserFields.password}).confirmPassword;
        this.setState({
            confirmPasswordError: confirmPasswordError
        });
        return confirmPasswordError;
    }

    validateOrganization() {
        return this._validateField('organization');
    }

    validateTitle() {
        const {user} = this.state;
        user.title = this._normalizeFieldValue('title');
        this.setState({user});
    }

    validateCertifications() {
        const {user} = this.state;
        user.certificates = this._normalizeFieldValue('certificates');
        this.setState({user});
    }

    validateAuthorizationNumber() {
        const {user} = this.state;
        user.authorizationNumber = this._normalizeFieldValue('authorizationNumber');
        this.setState({user});
    }

    _normalizeFieldValue(fieldName) {
        const {user} = this.state;
        return user[fieldName] && user[fieldName].trim();
    }

    setUserField(field: string, value: string | number) {
        const {user} = this.state;

        user[field] = value;
        this.setState({user});
    }

    render() {
        return (
            <Form>
                <Text style={style.inputLabel} accessibilityLabel={registration.firstNameLabel}>
                    * First Name
                </Text>
                <TextInputValid
                    accessibilityLabel={registration.firstNameInput}
                    light
                    autoCapitalize="sentences"
                    style={style.input}
                    onChangeText={value => this.setUserField('firstName', value)}
                    onBlur={() => this.validateFirstName()}
                    value={this.state.user.firstName}
                    error={this.state.firstNameError}
                    maxLength={32}
                />
                <Text style={style.inputLabel} accessibilityLabel={registration.lastNameLabel}>
                    * Last Name
                </Text>
                <TextInputValid
                    accessibilityLabel={registration.lastNameInput}
                    light
                    autoCapitalize="sentences"
                    style={style.input}
                    onChangeText={value => this.setUserField('lastName', value)}
                    onBlur={() => this.validateLastName()}
                    value={this.state.user.lastName}
                    error={this.state.lastNameError}
                    maxLength={32}
                />
                <Text style={style.inputLabel} accessibilityLabel={registration.countryPickerLabel}>
                    * Country of Citizenship
                </Text>
                {this.renderCountryInput()}
                {!this.props.isEdit &&
                <View>
                    <Text style={style.inputLabel} accessibilityLabel={registration.emailLabel}>
                        * Email
                    </Text>
                    <TextInputValid
                        accessibilityLabel={registration.emailInput}
                        light
                        autoCapitalize="none"
                        style={style.input}
                        onChangeText={value => this.setUserField('email', value)}
                        onBlur={() => this.validateEmail()}
                        defaultValue={this.state._email}
                        value={this.state.user.email}
                        error={this.state.emailError}
                        maxLength={50}
                    />
                    <Text style={style.inputLabel} accessibilityLabel={registration.usernameLabel}>
                        * Username
                    </Text>
                    <TextInputValid
                        accessibilityLabel={registration.usernameInput}
                        light
                        autoCapitalize="none"
                        style={style.input}
                        onChangeText={value => this.setUserField('username', value)}
                        onBlur={() => this.validateUsername()}
                        defaultValue={this.state._username}
                        value={this.state.user.username}
                        error={this.state.usernameError}
                        maxLength={30}
                    />
                    <Text style={style.inputLabel} accessibilityLabel={registration.passwordLabel}>
                        * Password
                    </Text>
                    <TextInputValid
                        accessibilityLabel={registration.passwordInput}
                        light
                        autoCapitalize="none"
                        style={style.input}
                        onChangeText={value => this.setUserField('password', value)}
                        onBlur={() => {
                            this.validatePassword();
                            if (this.state.user.confirmPassword) {
                                this.validateConfirmPassword();
                            }
                        }}
                        defaultValue={this.state._password}
                        value={this.state.user.password}
                        error={this.state.passwordError}
                        maxLength={32}
                        secureTextEntry={true}
                        renderFieldHint={() => (<View>
                            <Text style={[whiteColor, style.passwordRequirements]}
                                  accessibilityLabel={registration.passwordErrMinLength}>
                                Password must be at least 8 characters</Text>
                            <Text style={[whiteColor, style.passwordRequirements]}
                                  accessibilityLabel={registration.passwordErrorCases}>
                                Password must contain at least one upper and lower case character</Text>
                            <Text style={[whiteColor, style.passwordRequirements]}
                                  accessibilityLabel={registration.passwordErrorCases}>
                                Password must contain at least one numeric character</Text>
                            <Text style={[whiteColor, style.passwordRequirements]}
                                  accessibilityLabel={registration.passwordErrorSpecialChar}>
                                Password must contain at least one special character such as {'!@#$%^&*()_+<>\\'}</Text>
                        </View>)
                        }
                    />

                    <Text style={style.inputLabel} accessibilityLabel={registration.passwordConfirmLabel}>
                        * Confirm Password
                    </Text>
                    <TextInputValid
                        accessibilityLabel={registration.passwordConfirmInput}
                        light
                        style={style.input}
                        onChangeText={value => this.setUserField('confirmPassword', value)}
                        onBlur={() => this.validateConfirmPassword()}
                        defaultValue={this.state._confirmPassword}
                        value={this.state.user.confirmPassword}
                        error={this.state.confirmPasswordError}
                        maxLength={32}
                        secureTextEntry={true}
                    />
                </View>
                }
                <Text style={style.inputLabel} accessibilityLabel={registration.organizationLabel}>
                    Notifications
                </Text>


                <FormCheckbox
                    onPress={() => {
                        const {user} = this.state;
                        this.setState(prevState => ({
                            user: {
                                ...prevState.user,
                                settings: {
                                    pushNotifications: user.settings ? !user.settings.pushNotifications : false,
                                    emailNotifications: user.settings ? user.settings.emailNotifications : true,
                                }
                            }
                        }));
                    }}
                    checked={this.state.user.settings ? this.state.user.settings.pushNotifications : true}
                    text="Push notifications"
                    style={{color: 'white', marginVertical: 5}}
                />

                <FormCheckbox
                    onPress={() => {
                        const {user} = this.state;
                        this.setState(prevState => ({
                            user: {
                                ...prevState.user,
                                settings: {
                                    pushNotifications: user.settings ? user.settings.pushNotifications : true,
                                    emailNotifications: user.settings ? !user.settings.emailNotifications : false,
                                }
                            }
                        }));
                    }}
                    checked={this.state.user.settings ? this.state.user.settings.emailNotifications : true}
                    text="Email notifications"
                    style={{color: 'white', marginVertical: 5}}
                />

                <Text style={style.inputLabel} accessibilityLabel={registration.titleLabel}>
                    FAA Approval/Authorization number
                </Text>
                <TextInputValid
                    light
                    autoCapitalize="sentences"
                    style={style.input}
                    onChangeText={value => this.setUserField('authorizationNumber', value)}
                    value={this.state.user.authorizationNumber}
                    maxLength={32}
                />
                <Text style={style.inputLabel} accessibilityLabel={registration.titleLabel}>
                    Title
                </Text>
                <TextInputValid
                    accessibilityLabel={registration.titleInput}
                    light
                    autoCapitalize="sentences"
                    style={style.input}
                    onChangeText={value => this.setUserField('title', value)}
                    onBlur={() => this.validateTitle()}
                    defaultValue={this.state._title}
                    value={this.state.user.title}
                    error={this.state.titleError}
                    maxLength={32}
                />
                <Text style={style.inputLabel} accessibilityLabel={registration.certificationsLabel}>
                    Certifications
                </Text>
                <Textarea
                    accessibilityLabel={registration.certificationsInput}
                    style={[commonStyle.textarea, {color: 'white', borderColor: 'white'}, commonStyle.indent(15)]}
                    rowSpan={3}
                    maxLength={200}
                    value={this.state.user.certificates}
                    autoCapitalize="sentences"
                    onBlur={() => this.validateCertifications()}
                    onChangeText={value => this.setUserField('certificates', value)}
                />
            </Form>
        );
    }
}