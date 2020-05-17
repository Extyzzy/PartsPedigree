import React from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ScreenDetector } from "../utils/screen-detector";
import { commonStyle } from "../styles/common.style";
import { COLORS } from "../styles/variables";
import { homeScreen } from "../constants/accessability";
import unimplemented from "../utils/unimplemented";

const style = StyleSheet.create({
    searchIconContainer: {
        paddingHorizontal: ScreenDetector.isPhone() ? 5 : 10,
    },
    textInput: {
        width: ScreenDetector.isPhone() ? 100 : 250,
        fontSize: ScreenDetector.isPhone() ? 10 : 20,
        color: COLORS.gray_200,
        marginBottom: 0,
        marginTop: 0,
        paddingTop: 0,
        paddingBottom: 0,
    },
    searchContainer: {
        borderWidth: 1,
        borderColor: COLORS.gray_200,
        borderRadius: 30,
        height: ScreenDetector.isPhone() ? 30 : 50,
        paddingHorizontal: ScreenDetector.isPhone() ? 10 : 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

});

export const SearchInput = props => (
    <View style={style.searchContainer}>
        <TextInput
            onSubmitEditing={props.onPressFind}
            style={style.textInput}
            maxLength={32}
            value={props.textSearch}
            underlineColorAndroid="rgba(0,0,0,0)"
            onChangeText={props.onChangeText}
            accessibilityLabel={homeScreen.searchField}
        />
        <View style={commonStyle.rowBetween}>
            <TouchableOpacity
                onPress={props.onPressClear}
                style={[commonStyle.flexCenter, style.searchIconContainer]}
                activeOpacity={0.5}
                accessibilityLabel={homeScreen.searchFieldClear}
            >
                <Image
                    style={ScreenDetector.isPhone() && commonStyle.size(8)}
                    source={require('../assets/icons/cross_gray_icon.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={[commonStyle.flexCenter, style.searchIconContainer]}
                activeOpacity={0.5}
                onPress={props.onPressFind}
                accessibilityLabel={homeScreen.searchFieldSearchButton}
            >
                <Image
                    style={ScreenDetector.isPhone() && commonStyle.size(15, 16)}
                    source={require('../assets/icons/search_gray_btn_icon.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={[commonStyle.flexCenter, style.searchIconContainer]}
                activeOpacity={0.5}
                onPress={props.onPressImageAndFil}
                accessibilityLabel={homeScreen.searchFieldCamera}
            >
                <Image
                    style={ScreenDetector.isPhone() && commonStyle.size(23, 18)}
                    source={require('../assets/icons/camera_gray_icon.png')}
                />
            </TouchableOpacity>
        </View>
    </View>
);

SearchInput.propTypes = {
    textSearch: PropTypes.string,
    onChangeText: PropTypes.func,
    onPressClear: PropTypes.func,
    onPressFind: PropTypes.func,
    onPressImageAndFil: PropTypes.func,
};

SearchInput.defaultProps = {
    onPressImageAndFil: unimplemented
};