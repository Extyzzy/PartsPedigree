import React from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import { formatPartDate } from "../utils/datetime";
import { general } from "../constants/accessability";
import { ScreenDetector } from "../utils/screen-detector";

const style = StyleSheet.create({
    text: {
        fontSize: ScreenDetector.isPhone() ? 12 : 16,
        color: '#a7a7a7',
        fontWeight: 'bold'
    }
});

export const CreatedDate = props => (
    <Text
        style={[style.text, { fontSize: props.fontSize }]} 
        accessibilityLabel={general.createdDate}>
        {formatPartDate(props.date)}
    </Text>
);

CreatedDate.propTypes = {
    fontSize: PropTypes.number,
    date: PropTypes.string.isRequired,
};
