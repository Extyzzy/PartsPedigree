import { StyleSheet } from 'react-native';
import { VARIABLES } from "../../styles/variables";
import { ScreenDetector } from "../../utils/screen-detector";

export const partInstanceStyle = StyleSheet.create({
    container: {
        padding: 10,
    },
    stubContainer: {
      padding: 20,
      justifyContent: 'center',
      // flexDirection: 'column',
      alignItems: 'center',
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
    parMasterImage: {
        width: ScreenDetector.isPhone() ? 140 : 280,
        height: ScreenDetector.isPhone() ? 80 : 160,
    },
    partInstanceImagesContainer: {
        flexDirection: 'row',
    },
    partInstanceImage: {
        width: ScreenDetector.isPhone() ? 70 : 140,
        height: ScreenDetector.isPhone() ? 50 : 100,
        paddingHorizontal: ScreenDetector.isPhone() ? 1 : 3,
    },
    editIcon: {
        width:  ScreenDetector.isPhone() ? 20 : 28,
        height: ScreenDetector.isPhone() ? 19 : 27,
        alignSelf: 'flex-end'
    },
    editBtnText: {
        marginLeft: 4,
        marginRight: 10,
        color: '#8F9CAB',
        fontSize: ScreenDetector.isPhone() ? 11 : 18,
        alignSelf: 'flex-end'
    }
});
