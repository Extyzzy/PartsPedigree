import { StyleSheet } from 'react-native';
import { ScreenDetector } from "../../utils/screen-detector";

export const detail81303Style = StyleSheet.create({
    container: {
        padding: 15,
    },
    text: {
        fontSize: ScreenDetector.isPhone() ? 14 : 20,
    },
});
