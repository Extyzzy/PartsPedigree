import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { Button, Label } from 'native-base';
import { commonStyle } from "../styles/common.style";

const style = StyleSheet.create({
    saveBtn: {
        height: 50,
        marginTop: 15,
        backgroundColor: '#8e9cac',
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        borderRadius: 15,
        width: '100%',
    },
    cancelBtn: {
        flex: 1,
        alignItems: 'center',
    },
    btnText: {
        textAlign: 'center',
        flex: 1,
        color: 'black',
    },
    saveBtnText: {
        color: '#ffffff',
    }
});

export const FormButtons = props => (
    <View style={[commonStyle.flexRow, commonStyle.marginHorizontal(-5), {marginTop: 30}]}>
        <View style={[commonStyle.flex(0.5), commonStyle.paddingHorizontal(5), { opacity: props.disabled ? 0.6 : 1}]}>
            <Button
                style={style.saveBtn}
                onPress={props.onOkPress}
                disabled={props.disabled}
            >
                <Label
                    style={[style.saveBtnText]}
                >{props.okBtnText}
                </Label>
            </Button>
        </View>
        <View style={[commonStyle.flex(0.5), commonStyle.paddingHorizontal(5)]}>
            <Button transparent style={style.cancelBtn} onPress={props.onCancelPress}>
                <Text style={style.btnText}>Cancel</Text>
            </Button>
        </View>
    </View>
);

FormButtons.propTypes = {
    okBtnText: PropTypes.string,
    onOkPress: PropTypes.func,
    onCancelPress: PropTypes.func,
    disabled: PropTypes.bool,
};

FormButtons.defaultProps = {
    okBtnText: 'Save',
    disabled: false,
    onOkPress() {
    },
    onCancelPress() {
    },
};