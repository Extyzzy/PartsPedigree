import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { ScreenDetector } from "../utils/screen-detector";
import { COLORS } from "../styles/variables";

const style = StyleSheet.create({
    default_bg: {
        backgroundColor: COLORS.gray_200,
    },
    green_bg: {
      backgroundColor: COLORS.green,
    },
    splitterText: {
        textAlign: 'center',
        fontSize: ScreenDetector.isPhone() ? 14 : 18,
        paddingVertical: 3,
    },
    default_text_style: {
        color: 'white'
    },
    green_text_style: {
        color: '#000000',
    },
    withAdditionalText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15
    }
});

export const FormSplitter = props => (
    <View style={[style[`${props.style}_bg`], props.additionalText && style.withAdditionalText]}>
        <Text
            style={[style.splitterText, style[`${props.style}_text_style`]]}
            accessibilityLabel={"Form " + props.text}>
            {props.text}
        </Text>
        {props.additionalText &&
        <Text
            style={[style.splitterText, style[`${props.style}_text_style`]]}
            accessibilityLabel={props.additionalText}>
            {props.additionalText}
        </Text>
        }
    </View>
);

FormSplitter.propTypes = {
    text: PropTypes.string.isRequired,
    additionalText: PropTypes.string,
    style: PropTypes.oneOf(['default', 'green']),
};

FormSplitter.defaultProps = {
    style: 'default',
    additionalText: null,
};