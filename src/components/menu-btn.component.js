import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { general } from "../constants/accessability";

const style = StyleSheet.create({
    container: {
        width: 18,
        height: 16,
        justifyContent: 'space-between',
        marginRight: 15,
    },
    line: {
        height: 1,
        backgroundColor: '#ffffff',
    },
    middleLine: {
        width: '70%',
        alignSelf: 'flex-end',
    }
});

export class MenuBtn extends PureComponent {
    static contextTypes = {
        toggleMenu: PropTypes.func,
    };

    toggleMenu() {
        this.context.toggleMenu();
    }

    render() {
        return (
            <TouchableOpacity
                style={style.container}
                onPress={() => this.toggleMenu()}
                activeOpacity={0.5}
                accessibilityLabel={general.showMenu}
            >
                <View style={style.line}/>
                <View style={[style.line, style.middleLine]}/>
                <View style={style.line}/>
            </TouchableOpacity>
        );
    }
}
