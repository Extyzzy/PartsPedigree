import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image, Text } from 'react-native';
import { SideMenuStyle as style } from './side-menu.style'

const icons = {
    star: require('../../assets/icons/icon_start.png'),
    settings: require('../../assets/icons/icon_settings.png'),
    invite: require('../../assets/icons/icon_invite.png'),
    like: require('../../assets/icons/icon_like.png'),
    rate: require('../../assets/icons/icon_rate.png'),
    help: require('../../assets/icons/icon_help.png'),
    tutorial: require('../../assets/icons/icon_tutorial.png'),
    report: require('../../assets/icons/icon_problem.png'),
    feedback: require('../../assets/icons/icon_feedbCK.png'),
    about: require('../../assets/icons/icon_about.png'),
};

export const MenuItem = props => {
    const [w, h] = props.iconSize.split('x');

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            style={style.menuItem}
            onPress={() => props.onPress()}
            accessibilityLabel={props.text}
        >
            <Image style={[style.menuItemIcon, { width: +w, height: +h }]} source={icons[props.icon]}/>
            <Text>{props.text}</Text>
        </TouchableOpacity>
    );
};

MenuItem.propTypes = {
    icon: PropTypes.string,
    iconSize: PropTypes.string,
    text: PropTypes.string,
    onPress: PropTypes.func,
};

MenuItem.defaultProps = {
    icon: null,
    text: null,
    iconSize: '20x20',
    onPress: () => {
    },
};
