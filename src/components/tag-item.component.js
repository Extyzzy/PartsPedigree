import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { COLORS, VARIABLES } from "../styles/variables";
import { CrossBtn } from "./cross-btn.component";

export const TagItem = (props: Props ) => (
    <TouchableOpacity
        activeOpacity={0.5}
        disabled={!props.onPress}
        onPress={props.onPress}
        accessibilityLabel={props.text}
    >
        <View style={[style.tag, props.active && style.active, !!props.onPressRemove && style.withRemove]}>
            <Text numberOfLines={1} style={style.tagText}>{props.text}</Text>
            {props.onPressRemove && <CrossBtn onPress={props.onPressRemove} phoneSize={20} tabletSize={35}/>}
        </View>
    </TouchableOpacity>
);

TagItem.propTypes = {
    onPress: PropTypes.func,
    text: PropTypes.string,
    active: PropTypes.bool,
    onPressRemove: PropTypes.func,
};

const style = StyleSheet.create({
    tag: {
        flexDirection: 'row',
        backgroundColor: COLORS.gray,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 15,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        //maxWidth: ScreenDetector.ScreenWidth() * 0.44
    },
    tagText: {
        color: COLORS.white,
        fontSize: VARIABLES.H3_SIZE,
        textAlign: 'center',
    },
    active: {
        backgroundColor: COLORS.green
    },
    withRemove: {
        paddingRight: 5,
    }
});
