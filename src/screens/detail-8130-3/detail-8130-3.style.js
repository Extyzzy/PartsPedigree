import { StyleSheet } from 'react-native';
import { ScreenDetector } from "../../utils/screen-detector";
import { COLORS, VARIABLES } from "../../styles/variables";

export const detail81303Style = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingHorizontal: 15,
        marginBottom: -20,
    },
    text: {
        fontSize: VARIABLES.TEXT_SIZE_SM,
        color: COLORS.blue,
    },
    itemsHeader: {
        backgroundColor: COLORS.gray_200,
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    itemsHeaderText: {
        color: COLORS.white,
        fontWeight: 'bold',
    }
});
