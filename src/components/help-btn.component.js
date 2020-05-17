import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { commonStyle } from "../styles/common.style";

const style = StyleSheet.create({
    container: {
        padding: 10,
    },
    image: {
        ...commonStyle.size(32),
        transform: [
            {
                rotate: '180deg'
            }
        ]
    }
});

export const HelpBtn = props => (
    <TouchableOpacity
        activeOpacity={0.5}
        style={style.container}
        onPress={props.onPress}
    >
        <Image
            style={style.image}
            source={require('../assets/icons/exclamation_point_icon.png')}
        />
    </TouchableOpacity>
);

HelpBtn.propTypes = {
    onPress: PropTypes.func,
};
