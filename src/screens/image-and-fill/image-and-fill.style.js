import { StyleSheet } from 'react-native';
import { ScreenDetector } from "../../utils/screen-detector";
import { COLORS, VARIABLES } from "../../styles/variables";

export const ImageAndFillStyle = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingVertical: 30,
        flex: 1,
        justifyContent: 'space-between',
    },
    text: {
        fontSize: VARIABLES.H4_SIZE,
    },
    imageContainer: {
        width: '100%',
        flex: 1,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    cameraBtnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    cameraBtn: {
        backgroundColor: '#4d6179',
        height: 80,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    },
    cameraIcon: {
        width: 57,
        height: 45,
    },
    modal: {
      justifyContent: 'space-between',
    },
    menuContainer: {
      maxHeight: 250,
    },
    feelTextContainer: {
        width: '100%',
        backgroundColor: '#ffffff',
        paddingVertical: 15,
        marginTop: 80,
        borderRadius: 5,
    },
    feelText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#000000',
    },
    formBtnsContainer: {
        paddingHorizontal: 15,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: 150,
        zIndex: 100,
        backgroundColor: COLORS.white,
    },
    formRotateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    rotate: {
      width: 35,
      height: 35
    },
    modalTitle: {
        fontSize: VARIABLES.H3_SIZE,
        marginBottom: 15,
        fontWeight: 'bold',
    },
    modalText: {
        fontSize: VARIABLES.H3_SIZE,
        marginBottom: 15,
    },
    modalBtnContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    }
});
