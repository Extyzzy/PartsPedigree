import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Button, Label } from 'native-base';

const style = StyleSheet.create({
        label: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 14
        },
        btn: {
            backgroundColor: '#8F9CAB',
            paddingHorizontal: 15,
            position: 'absolute',
            bottom: 15,
            alignSelf: 'center',
            borderRadius: 15,
            height: 40,
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 5 },
            shadowRadius: 2.5,
            shadowOpacity: 0.5
        }
    }
);

export const FixedBottomBtn = props => (
    <Button
        style={style.btn}
        onPress={props.onPress}
        accessibilityLabel={props.text}
    >
        <Label style={style.label}>{props.text}</Label>
    </Button>
);

FixedBottomBtn.propTypes = {
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
};
