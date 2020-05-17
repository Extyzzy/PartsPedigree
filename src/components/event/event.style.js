import { StyleSheet } from 'react-native';
import { COLORS, VARIABLES } from "../../styles/variables";
import { ScreenDetector } from "../../utils/screen-detector";

const requestAccessIconSize = ScreenDetector.isPhone() ? 19 : 28;

export const eventStyle = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#ffffff',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 0.5,
        },
        shadowRadius: 1,
        shadowOpacity: 0.5,
        height: 120,
    },
    title: {
        fontSize: VARIABLES.H6_SIZE,
        fontWeight: 'bold',
    },
    grayBg: {
        backgroundColor: COLORS.gray_50
    },
    restrictedIcon: {
        width: ScreenDetector.isPhone() ? 16 : 24,
        height: ScreenDetector.isPhone() ? 22 : 30,
        marginRight: 7,
    },
    restrictedBtnText: {
        color: COLORS.red,
        fontWeight: 'bold',
        fontSize: ScreenDetector.isPhone() ? 12 : 18,
    },
    requestAccessIcon: {
        width: requestAccessIconSize,
        height: requestAccessIconSize,
        marginRight: 7,
    },
    requestAccessBtnText: {
        fontSize: ScreenDetector.isPhone() ? 11 : 18,
        color: '#8F9CAB',
    },
});