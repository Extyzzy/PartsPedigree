import React from 'react';
import PropTypes from 'prop-types';
import { Linking, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { commonStyle } from "../styles/common.style";
import { general } from "../constants/accessability";
import { ScreenDetector } from "../utils/screen-detector";

const blockChainIconSize = ScreenDetector.isPhone() ? 18 : 28;
const style = StyleSheet.create({
    keyIcon: {
        width: ScreenDetector.isPhone() ? 13 : 21,
        height: ScreenDetector.isPhone() ? 18 : 27,
        marginRight: 5,
    },
    blockChainIcon: {
        width: blockChainIconSize,
        height: blockChainIconSize,
        marginRight: 5,
    },
    keyText: {
        color: '#8F9CAB',
        fontSize: ScreenDetector.isPhone() ? 11 : 18,
    }
});

export const VerificationKey = (props) => {
    const { hash, blockchainAddress, eventsCard } = props;
    if (!hash || !blockchainAddress) {
        return (
            <Text
                style={style.keyText}
                accessibilityLabel={general.signatureNoSign}>
                {eventsCard ? 'Not Yet Verified' : 'Data not Verified'}
            </Text>
        )
    }

    const { length } = hash;
    const substr = `${hash.substr(0, 10)}...${hash.substr(length - 10, length)}`;
    return (
        <TouchableOpacity
            style={[commonStyle.flexRow, {width: eventsCard ? 20: '100%' }]}
            disabled={!props.blockchainAddress}
            activeOpacity={0.5}
            onPress={() => {
                Linking.openURL(`https://ropsten.etherscan.io/tx/${props.blockchainAddress}`);
            }}
        >
            <Image
                style={style.keyIcon}
                source={require('../assets/icons/icon_fingerprint.png')}
                accessibilityLabel={general.signatureIcon}/>
              {
               ! eventsCard &&(
                  <Text
                    style={style.keyText}
                    accessibilityLabel={"Digital signature: " + substr}>
                    Digital Signature: {substr}
                  </Text>
                )
              }
        </TouchableOpacity>
    )
};

VerificationKey.propTypes = {
    hash: PropTypes.string,
    blockchainAddress: PropTypes.string,
    eventsCard: PropTypes.bool,
};

VerificationKey.defaultProps = {
    hash: null,
    blockchainAddress: null,
    eventsCard: false,
};
