import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { commonStyle } from "../styles/common.style";
import { ScreenDetector } from "../utils/screen-detector";
import { COLORS } from "../styles/variables";

const style = StyleSheet.create({
    btn: {
        backgroundColor: COLORS.gray_200,
        width: '100%',
        height: ScreenDetector.isPhone() ? 35 : 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: COLORS.white,
        fontSize: ScreenDetector.isPhone() ? 12 : 20,
    },
});

export const FormButton = props => (
    <TouchableOpacity
        disabled = {props.disabled ? props.disabled : false}
        onPress={props.onPress}
        style={[style.btn, commonStyle.flex(0.2), props.disabled && {opacity: 0.4} ]}
        activeOpacity={0.5}
        accessibilityLabel={"Button: " + props.text}
    >
        {
            props.text ? (<Text numberOfLines={1} style={style.btnText}>{props.text}</Text>) : props.children
        }
    </TouchableOpacity>
);

FormButton.propTypes = {
    text: PropTypes.string,
    onPress: PropTypes.func,
};
