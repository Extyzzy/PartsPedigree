import { StyleSheet} from 'react-native';
import { ScreenDetector } from "../../utils/screen-detector";
import { COLORS, VARIABLES } from "../../styles/variables";

export const partInstanceInfoStyle = StyleSheet.create({
    partInstanceInfoContainer: {
        padding: ScreenDetector.isPhone() ? 10 : 20,
        backgroundColor: COLORS.gray,
    },
    partInstanceInfoText: {
        fontSize: VARIABLES.TEXT_SIZE_SM,
    },
});
