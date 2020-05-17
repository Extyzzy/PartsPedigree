import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { commonStyle } from "../styles/common.style";
import { ScreenDetector } from "../utils/screen-detector";

const iconContainerSize = ScreenDetector.isPhone() ? 18 : 24;

const style = StyleSheet.create({
    checkBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: iconContainerSize,
        height: iconContainerSize,
        borderColor: '#7f7f7f',
        borderWidth: 2,
    },
    emptyState: {
        flex: 1,
    },
    checkboxText: {
        marginLeft: 10,
    }
});

export const FormCheckbox = props => (
    <TouchableOpacity
        style={style.checkBoxContainer}
        activeOpacity={1}
        disabled={props.disabled}
        onPress={() => props.onPress()}
    >
        <View style={[style.iconContainer, props.style]}>
            {props.checked &&
            <Image style={commonStyle.fullSize} source={require('../assets/icons/icon_checkmark.png')} />
            }
        </View>
        <Text style={[commonStyle.inputLabel, style.checkboxText, props.style]}>{props.text}</Text>
    </TouchableOpacity>
);

FormCheckbox.propTypes = {
    onPress: PropTypes.func,
    checked: PropTypes.bool,
    text: PropTypes.string,
    disabled: PropTypes.bool,
};

FormCheckbox.defaultProps = {
    onPress() {
    },
    checked: false,
    text: null,
    disabled: false,
};