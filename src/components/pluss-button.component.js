import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image } from 'react-native';
import { commonStyle } from "../styles/common.style";
import { COLORS } from "../styles/variables";
import { homeScreen } from "../constants/accessability";

export const PlusButton = props => (
    <TouchableOpacity
        activeOpacity={0.5}
        style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: COLORS.white,
            borderRadius: 100,
            overflow: 'hidden',
        }}
        onPress={props.onPress}
        accessibilityLabel={homeScreen.addButton}
    >
        <Image style={commonStyle.size(67)} source={require('../assets/pluss_btn.png')}/>
    </TouchableOpacity>
);

PlusButton.propTypes = {
    onPress: PropTypes.func,
};
