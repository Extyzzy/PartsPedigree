import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Image, View, ActivityIndicator } from 'react-native';
import { general } from "../constants/accessability";

export class ServerImage extends PureComponent {
    static propTypes = {
        uri: PropTypes.string,
        style: PropTypes.any,
    };

    static defaultProps = {
        uri: null,
        fullSize: true,
    };

    state = {
        loaded: false,
        error: false,
    };

    componentDidUpdate(prevProps) {
        if (prevProps.uri !== this.props.uri) {
            this.setState({ loaded: false });
        }
    }

    renderLoading() {
        return (
            <View style={{
                position: 'absolute',
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                zIndex: 1000,
            }}
            accessibilityLabel={general.imageLoading}>
                <ActivityIndicator size="small" />
            </View>
        );
    }

    renderError() {
        return (
            <Image
                style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: 150,
                    maxHeight: 150,
                }}
                accessibilityLabel={general.imageError}
                source={require('../assets/no_image.png')}
            />
        );
    }

    render() {
        return (
            <View style={this.props.style}>
                {this.state.error || !this.props.uri ?
                    this.renderError() :
                    <Image
                        style={{ width: '100%', height: '100%',
                          resizeMode: 'contain' }}
                        source={{ uri: this.props.uri }}
                        onLoad={() => this.setState({ loaded: true })}
                        accessibilityLabel={general.imageLoaded}
                    />
                }
                {!!this.props.uri && !this.state.loaded && !this.state.error && this.renderLoading()}
            </View>
        );
    }
}
