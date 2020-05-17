import { StyleSheet } from 'react-native';
import { COLORS, VARIABLES } from "../../styles/variables";
import { ScreenDetector } from "../../utils/screen-detector";

export const SaveAttachmentStyle = StyleSheet.create({
    container: {
        padding: 25,
    },
    text: {
        fontSize: VARIABLES.H5_SIZE,
    },
    fileTitle: {
        marginRight: 20
    },
    selectFileBtn: {
        color: COLORS.blue,
        fontWeight: 'bold',
        fontSize: 16,
    },
    fileNameText: {
        marginRight: 8,
        color: COLORS.blue,
    },
    tagContainer: {
        borderRadius: 10,
        padding: 5,
        height: 40,
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.gray,
    },
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1000
    },
    autocompleteItem: {
        padding: 5,
    },
    line: {
        borderBottomColor: COLORS.gray,
        borderBottomWidth: 1,
    },
    modalTitle: {
        fontSize: VARIABLES.H3_SIZE,
        marginBottom: 15,
    },
    modalBtnsContainer: {
        width: '100%',
        alignSelf: 'flex-end',
    },
    modalOkBtnText: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    modalCancelBtnText: {
        fontSize: 20,
    },
    tagsContainer: {
        margin: -5,
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    tags: {
        minHeight: 150
    }
});
