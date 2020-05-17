import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image } from 'react-native';
import { ScreenDetector } from "../utils/screen-detector";
import { commonStyle } from "../styles/common.style";
import { general } from "../constants/accessability";

export const CrossBtn = props => (
    <TouchableOpacity
        onPress={props.onPress}
        style={commonStyle.marginHorizontal(10)}
        activeOpacity={0.5}
        accessibilityLabel={general.deleteButton}
    >
        <Image
            style={commonStyle.size(ScreenDetector.isPhone() ? props.phoneSize : props.tabletSize)}
            source={require('../assets/icons/delete_photo_icon.png')}
        />
    </TouchableOpacity>
);

CrossBtn.propTypes = {
    onPress: PropTypes.func,
    phoneSize: PropTypes.number,
    tabletSize: PropTypes.number,
};

CrossBtn.defaultProps = {
    phoneSize: 15,
    tabletSize: 30,
};