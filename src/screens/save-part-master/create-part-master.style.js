import { StyleSheet } from 'react-native';
import { VARIABLES } from "../../styles/variables";

export const createPartMasterStyle = StyleSheet.create({
    form: {
        paddingVertical: 20,
        paddingHorizontal: 30,
    },
    countryInput: {
        lineHeight: 30
    },
    copyBtn: {
        alignSelf: 'center',
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    photoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    copyBtnText: {
        fontSize: VARIABLES.H6_SIZE,
        marginLeft: 5,
        color: '#8f9cab',
        alignSelf: 'flex-end',
    }
});
