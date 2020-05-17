import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import DatePicker from 'react-native-datepicker';
import { ScreenDetector } from "../../utils/screen-detector";
import { general } from "../../constants/accessability";

const size = ScreenDetector.isPhone() ? 25 : 45;

export const DateTimePicker = props => (
    <View accessibilityLabel={general.datePickerIcon}>
        <DatePicker
            date={props.date}
            mode={props.mode}
            style={{ width: size, height: size, ...(props.style || {})}}
            hideText={true}
            placeholder="select date"
            format="DD/MM/YY HH[h]mm"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            iconSource={require('../../assets/icons/date_icon.png')}
            customStyles={{
                dateIcon: {
                    position: 'absolute',
                    alignSelf: 'flex-end',
                    height: size,
                    width: size,
                    left: 0,
                    top: 0,
                    marginLeft: 0,
                }
            }}
            onDateChange={(formatDate, date) => props.onDateChange(date)}
            onCloseModal={() => props.onCloseModal()}
        />
    </View>
);

DateTimePicker.propTypes = {
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onDateChange: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func,
    style: PropTypes.object,
    mode: PropTypes.string,
};

DateTimePicker.defaultProps = {
    date: new Date(),
    mode: 'datetime',
    onCloseModal() {},
};
