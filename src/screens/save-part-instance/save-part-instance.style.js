import { StyleSheet } from 'react-native';
import { VARIABLES } from "../../styles/variables";
import { ScreenDetector } from "../../utils/screen-detector";

export const savePartInstanceStyle = StyleSheet.create({
    partMasterImage: {
        width: ScreenDetector.isPhone() ? 100 : 200,
        height: ScreenDetector.isPhone() ? 60 : 120,
    },
    partMasterContainer: {
        backgroundColor: '#eaeaea',
        padding: 15,
    },
    partInstanceBg: {
        backgroundColor: 'white',
    },
    titleText: {
        color: 'black',
        fontSize: VARIABLES.H5_SIZE,
        fontWeight: 'bold',
    },
    text: {
        fontSize: VARIABLES.TEXT_SIZE_SM,
        color: '#333333',
    },
    formContainer: {
        paddingHorizontal: 30,
    },
    imagesContainer: {
        paddingVertical: 10,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    copyBtn: {
        alignSelf: 'center',
        paddingHorizontal: 15,
        marginBottom: 20,
    }
});
