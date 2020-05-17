import { StyleSheet } from 'react-native';
import { VARIABLES } from "./variables";

export const eventDetailStyle = StyleSheet.create({
    container: {
        padding: 15,
    },
    text: {
        fontSize: VARIABLES.TEXT_SIZE_SM
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: VARIABLES.H5_SIZE,
    },
    checbox: {
        paddingVertical: 15,
    },
    infoContainer: {
        paddingVertical: 15,
    },
    infoTitleText: {
        fontSize: VARIABLES.H5_SIZE,
        fontWeight: 'bold'
    },
    email: {
        fontSize: VARIABLES.TEXT_SIZE_SM,
        color: '#432cfa',
    },
    requestContainer: {
        padding: 15,
        borderColor: 'red',
        borderWidth: 1,
        marginVertical: 1,
    },
    requestBtn: {
        paddingVertical: 3,
        paddingHorizontal: 15,
        borderRadius: 15,
        backgroundColor: '#8F9CAB',
    },
    requestBtnText: {
        textAlign: 'center',
        color: '#ffffff',
    },
});
