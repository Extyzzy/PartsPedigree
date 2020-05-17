import { StyleSheet } from 'react-native';
import { COLORS, VARIABLES } from "../../styles/variables";

export const attachmentDetailstyle = StyleSheet.create({
    nameContainer: {
        backgroundColor: COLORS.gray,
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    nameText: {
        fontSize: VARIABLES.H3_SIZE,
    },
    container: {
        padding: 25,
    },
    title: {
        fontSize: VARIABLES.H4_SIZE,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    text: {
        fontSize: VARIABLES.H4_SIZE,
    },
    tagContainer: {
        margin: -5,
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    tag: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 15,
        margin: 5,
        backgroundColor: COLORS.gray,
    },
});
