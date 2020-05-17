import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image } from 'react-native';
import { parts } from "../constants/accessability";
import { ScreenDetector } from "../utils/screen-detector";

const imageStyle = {
    width: ScreenDetector.isPhone() ? 45 : 75,
    height: ScreenDetector.isPhone() ? 35 : 55,
};

export const AddImageBtn = props => (
    <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => props.onPress()}
        accessibilityLabel={parts.addImage}>
        <Image style={imageStyle} source={require('../assets/icons/add_photo_icon.png')}/>
    </TouchableOpacity>
);

AddImageBtn.propTypes = {
    onPress: PropTypes.func.isRequired,
};
