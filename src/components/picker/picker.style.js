import { StyleSheet } from 'react-native';
import { ScreenDetector } from "../../utils/screen-detector";
import { VARIABLES } from "../../styles/variables";

export const pickerContainerStyle = StyleSheet.create({
    text: {
        //lineHeight: 30,
        fontSize: VARIABLES.H6_SIZE,
    }
});

export const pickerStyle = {
    pickerConfirmBtnText: 'Ok',
    pickerCancelBtnText: 'Cancel',
    pickerToolBarBg: [64, 87, 110, 1],
    pickerTitleColor: [255, 255, 255, 1],
    pickerConfirmBtnColor: [255, 255, 255, 1],
    pickerCancelBtnColor: [255, 255, 255, 1],
    pickerTextEllipsisLen: 16,
    pickerFontColor: [0, 0, 0, 1],
    pickerBg: [220, 223, 232, 1],
    pickerFontSize: ScreenDetector.isPhone() ? 18 : 24,
};
