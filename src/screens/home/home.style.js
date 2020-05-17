import { StyleSheet } from 'react-native';
import { COLORS, VARIABLES } from "../../styles/variables";
import {ScreenDetector} from "../../utils/screen-detector";

const requestAccessIconSize = ScreenDetector.isPhone() ? 19 : 28;

export const homeStyle = StyleSheet.create({
    plusBtnContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    plusImage: {
        height: 67,
        width: 67,
    },
    notificationContainer: {
        backgroundColor: COLORS.gray,
        paddingHorizontal: 10,
        paddingVertical: 20,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    container: {
      flexDirection: 'row',
      position: 'relative',
      marginBottom: 3,
      backgroundColor: 'white',
    },
    notificationTitleText: {
        fontWeight: 'bold',
        fontSize: VARIABLES.H3_SIZE,
        marginBottom: 5,
    },
    notificationText: {
        fontSize: VARIABLES.H4_SIZE,
    },
    shipmentsTitleText: {
      fontWeight: 'bold',
      marginBottom: 3,
    },
    shipmentsParent: {
      borderWidth: 0.5,
      borderColor: '#d6d7da',
      padding: 10,
      paddingTop: 10,
      position: 'relative',
      backgroundColor: 'white',
      height: 120,
    },
    restrictedPanel:  {
      height: 50,
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
    proof: {
      marginTop: 10,
      marginBottom: 10
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
