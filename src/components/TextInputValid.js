import React, { Component } from 'react'
import { View, TextInput, Text, StyleSheet } from 'react-native'
import { validationErrorText, validationErrorTextLight } from "../styles/Common";
import PropTypes from 'prop-types';

export class TextInputValid extends Component {
    static propTypes = {
        accessibilityLabel: PropTypes.string,
        onChangeText: PropTypes.func,
        onBlur: PropTypes.func,
        defaultValue: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        maxLength: PropTypes.number,
        secureTextEntry: PropTypes.bool,
        autoCapitalize: PropTypes.string,
        renderFieldHint: PropTypes.func,
        keyboardType: PropTypes.string,
        light: PropTypes.bool,
        disabled: PropTypes.bool,
    };

    state = {
        wasFocusedOnce: false,
        wasBlurOnce: false,
    };

    _errorField() {
        return (<Text style={this.props.light ? validationErrorTextLight : validationErrorText} ellipsizeMode='head' accessibilityLabel={this.props.accessibilityLabel + " Error"}>{this.props.error}</Text>);
    }

    renderErrorOrHint() {
        //If there are errors -> render them.
        if (this.props.error) {
            return this._errorField();
        }
        // If no errors, but no hints for field too, then render empty input text to reserve vertical space.
        if (!this.props.renderFieldHint) {
            return this._errorField();
        }
        //If field was not focused yet, don't show the hint, but render empty error text to reserve space.
        if (!this.state.wasFocusedOnce) {
            return this._errorField();
        }
        //Field was focused here, there are no errors, and field blur event fired. Field value is OK, so there is no need to show the hint.
        if (this.state.wasBlurOnce) {
            return this._errorField();
        }
        return this.props.renderFieldHint && this.props.renderFieldHint();
    }

    render() {
        const { marginTop, paddingTop, marginBottom, paddingBottom } = StyleSheet.flatten(this.props.style);
        const { value } = this.props;

        return (
            <View style={{
                marginTop: marginTop,
                paddingTop: paddingTop,
                marginBottom: marginBottom,
                paddingBottom: paddingBottom,
            }}>
                <TextInput style={[this.props.style, {
                    marginTop: 0,
                    paddingTop: 0,
                    marginBottom: 0,
                    paddingBottom: 0
                }]}
                           accessibilityLabel={this.props.accessibilityLabel}
                           onFocus={() => this.setState({ wasFocusedOnce: true })}
                           onChangeText={value => this.props.onChangeText && this.props.onChangeText(value)}
                           onBlur={() => {
                               this.setState({ wasBlurOnce: true });
                               this.props.onBlur && this.props.onBlur();
                           }}
                           defaultValue={this.props.defaultValue}
                           value={(value && value.toString) ? value.toString() : null}
                           maxLength={this.props.maxLength}
                           secureTextEntry={this.props.secureTextEntry}
                           autoCapitalize={this.props.autoCapitalize}
                           keyboardType={this.props.keyboardType}
                           editable={!this.props.disabled}
                           underlineColorAndroid="rgba(0,0,0,0)"
                />
                {this.renderErrorOrHint()}
            </View>
        );
    }
}

export default TextInputValid;