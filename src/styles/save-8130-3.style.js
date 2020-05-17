import { StyleSheet } from 'react-native';
import { COLORS } from "./variables";
import { ScreenDetector } from "../utils/screen-detector";

export const save81303Style = StyleSheet.create({
    mainContainer: {
        backgroundColor: COLORS.white,
        flex: 1,
    },
    container: {
        padding: 10,
    },
    grayBg: {
        backgroundColor: COLORS.gray
    },
    fade: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.white,
        opacity: 0.6,
    },
    dateText: {
        textDecorationLine: 'underline',
    },
    a14block: {
        paddingLeft: 40,
    },
    a14title: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    a14text: {
        fontSize: ScreenDetector.isPhone() ? 12 : 16,
    },
    text: {
        fontSize: ScreenDetector.isPhone() ? 14 : 18,
    },
});
