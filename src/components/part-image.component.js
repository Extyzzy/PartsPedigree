import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ServerImage } from "./server-image.component";
import { parts } from "../constants/accessability";
import { ScreenDetector } from "../utils/screen-detector";
import { commonStyle } from "../styles/common.style";

const removeImageBtnSize = ScreenDetector.isPhone() ? 32 : 48;

const style = StyleSheet.create({
    imageContainer: {
        width: ScreenDetector.isPhone() ? 92 : 152,
        height: ScreenDetector.isPhone() ? 72 : 132,
        padding: ScreenDetector.isPhone() ? 12 : 22,
        overflow: 'visible',
        marginLeft: -12,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    removeImageBtn: {
        width: removeImageBtnSize,
        height: removeImageBtnSize,
        position: 'absolute',
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
        overflow: 'visible',
    },
});

export const PartImage = props => (
    <TouchableOpacity
        activeOpacity={0.5}
        onPress={props.onPress}
        style={style.imageContainer}
        accessibilityLabel={parts.partImage}
    >
        <ServerImage style={style.image} uri={props.uri}/>
        <TouchableOpacity
            style={style.removeImageBtn}
            activeOpacity={0.5}
            onPress={props.onPressRemove}
            accessibilityLabel={parts.partImageDelete}
        >
            <Image style={commonStyle.size(ScreenDetector.isPhone() ? 18 : 27)} source={require('../assets/icons/delete_photo_icon.png')}/>
        </TouchableOpacity>
    </TouchableOpacity>
);

PartImage.propTypes = {
    onPress: PropTypes.func,
    onPressRemove: PropTypes.func.isRequired,
    uri: PropTypes.string.isRequired,
};