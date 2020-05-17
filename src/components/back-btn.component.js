import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image } from 'react-native';
import { general } from "../constants/accessability";

export const BackBtn = props => (
    <TouchableOpacity
        style={{paddingHorizontal: 15}}
        activeOpacity={0.5}
        onPress={props.onPress}
        accessibilityLabel={general.backButton}>
        <Image style={{ width: 10, height: 19 }} source={require('../assets/back_btn.png')}/>
    </TouchableOpacity>
);

BackBtn.propTypes = {
    onPress: PropTypes.func.isRequired,
};
