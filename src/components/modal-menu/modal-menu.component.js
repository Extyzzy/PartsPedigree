import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'native-base';
import PropTypes from 'prop-types';
import { modalMenuStyle as style } from './modal-menu.style';
import { commonStyle } from "../../styles/common.style";

export const MenuContainer = props => (
    <View style={style.menuContainer}>
        {props.children}
        <View style={commonStyle.indent(60)}/>
        <View style={[commonStyle.flexRow, commonStyle.justifyEnd]}>
            <TouchableOpacity activeOpacity={0.5} onPress={props.closeModal} accessibilityLabel={"Cancel"}>
                <Text style={style.menuCancelBtn}>CANCEL</Text>
            </TouchableOpacity>
        </View>
    </View>
);

export const MenuItem = props => (
    <TouchableOpacity activeOpacity={0.5} onPress={() => props.onPress(props.value)} accessibilityLabel={props.text}>
        <View style={!props.noBorder ? style.menuItem : null}>
            <Text style={style.menuItemText}>{props.text}</Text>
        </View>
    </TouchableOpacity>
);

MenuItem.propTypes = {
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    noBorder: PropTypes.bool
};

MenuContainer.propTypes = {
    closeModal: PropTypes.func.isRequired
};
