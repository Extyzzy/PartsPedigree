import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native';
import { profileImageStyle as style } from './profile-image.style';
import { ServerImage } from "../server-image.component";
import { general } from '../../constants/accessability';

export class ProfileImage extends PureComponent {
    static propTypes = {
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        uri: PropTypes.string,
        size: PropTypes.number,
        initialsSize: PropTypes.number,
    };

    static defaultProps = {
        firstName: '',
        lastName: '',
        uri: null,
        size: 150,
        initialsSize: 60,
    };

    state = {
        error: false,
    };

    getPropsStyle() {
        return { width: this.props.size, height: this.props.size, borderRadius: this.props.size / 2 };
    }

    renderPhoto() {
        return (
            <ServerImage
                uri={this.props.uri}
                style={[style.avatar, this.getPropsStyle()]}
                onError={() => this.setState({ error: true })}
            />
        );
    }

    renderInitials() {
        const fl = this.props.firstName[0] || '';
        const sl = this.props.lastName[0] || '';

        return (
            <View style={[style.avatar, this.getPropsStyle()]}>
                <Text
                    numberOfLines={1}
                    allowFontScaling={false}
                    style={[style.text, { fontSize: this.props.initialsSize }]}
                    accessibilityLabel={general.profileInitials + fl + sl}
                >
                    {fl}{sl}
                </Text>
            </View>
        );
    }

    render() {
        return this.props.uri && !this.state.error ? this.renderPhoto() : this.renderInitials();
    }
}
