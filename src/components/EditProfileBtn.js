import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { general } from "../constants/accessability";

export const EditProfileBtn = ({ onPress }) => (
    <TouchableOpacity
        onPress={() => onPress()}
        style={{ paddingHorizontal: 15 }}
        accessibilityLabel={general.editProfileButton}>
        <Image source={require('../assets/icons/icon_pencil.png')} style={{ width: 24, height: 24 }}/>
    </TouchableOpacity>
);