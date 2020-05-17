import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, Image, StyleSheet, View} from 'react-native';
import {Text} from 'native-base';
import {commonStyle} from "../styles/common.style";
import {ScreenDetector} from "../utils/screen-detector";
import {general} from "../constants/accessability";

const style = StyleSheet.create({
    text: {
        marginLeft: 4,
        color: '#8F9CAB',
        fontSize: ScreenDetector.isPhone() ? 11 : 16,
        alignSelf: 'flex-end'
    },
    shareIcon: {
        width: ScreenDetector.isPhone() ? 24 : 32,
        height: ScreenDetector.isPhone() ? 20 : 28,
    },
    followIcon: {
        width: ScreenDetector.isPhone() ? 21 : 29,
        height: ScreenDetector.isPhone() ? 19 : 27,
    }
});

export const ShareBtn = props => (
    <TouchableOpacity
        activeOpacity={0.5}
        style={commonStyle.flexRow}
        onPress={props.onPress}
        disabled={!props.onPress}
        accessibilityLabel={general.shareButton}
    >
        <Image style={style.shareIcon} source={require('../assets/icons/share_icon.png')}/>
        {!ScreenDetector.isSmallScreen() &&
        <Text style={style.text}>Share</Text>
        }
    </TouchableOpacity>
);

ShareBtn.propTypes = {
    onPress: PropTypes.func,
};

const activeIcon = require('../assets/icons/follow_icon.png');
const inactiveIcon = require('../assets/icons/icon_start.png');

export class FollowBtn extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            value: !!props.value
        };
    }

    onPress() {
        const {follow, unfollow} = this.props;

        if (this.state.value) {
            unfollow && unfollow().then(() => this.toggle());
        } else {
            follow && follow().then(() => this.toggle());
        }
    }

    toggle() {
        this.setState({value: !this.state.value});
    }

    render() {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={commonStyle.flexRow}
                onPress={() => this.onPress()}
                disabled={!this.props.follow}
            >
                <Image
                    style={style.followIcon}
                    source={this.state.value ? activeIcon : inactiveIcon}
                />
                {!ScreenDetector.isSmallScreen() &&
                <Text style={style.text}>{this.state.value ? 'Unfollow' : 'Follow' }</Text>}
            </TouchableOpacity>
        );
    }
}

FollowBtn.propTypes = {
    follow: PropTypes.func,
    unfollow: PropTypes.func,
    value: PropTypes.bool,
};


export const ViewMoreBtn = props => (
    <TouchableOpacity
        activeOpacity={0.5}
        onPress={props.onPress}
        disabled={!props.onPress}
        accessibilityLabel={general.viewMoreButton}
    >
        <Text style={style.text}>
            {
                (props.viewMore && (
                    "View less <<"
                )) || (
                    "View more >>"
                )
            }
        </Text>
    </TouchableOpacity>
);

ViewMoreBtn.propTypes = {
    onPress: PropTypes.func,
    viewMore: PropTypes.bool,
};

export const InteractionPanel = props => (
    <View style={[commonStyle.flexRow, commonStyle.alignEnd, commonStyle.marginHorizontal(-5)]}>
        {!props.noShare &&
        <View style={commonStyle.paddingHorizontal(5)}>
            <ShareBtn onPress={props.onPressShare}/>
        </View>
        }
        {props.event ? null :
            <View style={commonStyle.paddingHorizontal(5)}>
                <FollowBtn follow={props.onFollow} unfollow={props.onUnfollow} value={props.isFollowed}/>
            </View>
        }
        <View style={commonStyle.paddingHorizontal(5)}>
            {
                props.onPressViewMore && <ViewMoreBtn
                    onPress={props.onPressViewMore}
                    viewMore={props.viewMore}
                />

            }
        </View>
    </View>
);

InteractionPanel.propTypes = {
    noShare: PropTypes.bool,
    isFollowed: PropTypes.bool,
    onFollow: PropTypes.func,
    onUnfollow: PropTypes.func,
    onPressFollow: PropTypes.func,
    onPressViewMore: PropTypes.func,
    viewMore: PropTypes.bool,
};
