import { StyleSheet } from 'react-native';
import { ScreenDetector } from "../utils/screen-detector";
import { COLORS, VARIABLES } from "./variables";

export const partEventsStyle = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        paddingBottom: ScreenDetector.isPhone() ? 60 : 80,
        flex: 1,
    },
    formContainer: {
        padding: ScreenDetector.isPhone() ? 5 : 15,
        flexDirection: 'row',
    },
    text: {
        fontSize: ScreenDetector.isPhone() ? 14 : 20,
    },
    textTitle: {
        color: COLORS.black,
        fontWeight: 'bold',
        fontSize: VARIABLES.H5_SIZE,
    },
    dateInput: {
        justifyContent: 'center'
    },
    table: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    tableHeader: {
        backgroundColor: COLORS.gray,
    },
    tableItem: {
        paddingHorizontal: ScreenDetector.isPhone() ? 3 : 10,
    },
    btnContainer: {
        position: 'absolute',
        flexDirection: 'row',
        paddingHorizontal: ScreenDetector.isPhone() ? 5 : 10,
        flex: 1,
        width: '100%',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 10,
    },
    btn: {
        backgroundColor: COLORS.gray_200,
        marginHorizontal: ScreenDetector.isPhone() ? 3 : 10,
        width: '100%',
        height: ScreenDetector.isPhone() ? 40 : 60,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: COLORS.white,
        fontSize: ScreenDetector.isPhone() ? 11 : 22,
    },
    attachment: {
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    padding: {
        padding: ScreenDetector.isPhone() ? 10 : 20,
    },
    searchText: {
        fontSize: ScreenDetector.isPhone() ? 12 : 22,
        fontWeight: 'bold',
    },
    searchContainer: {
        borderWidth: 1,
        borderColor: COLORS.gray_200,
        borderRadius: 30,
        height: ScreenDetector.isPhone() ? 30 : 50,
        paddingHorizontal: ScreenDetector.isPhone() ? 10 : 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textInput: {
        width: ScreenDetector.isPhone() ? 100 : 250,
        fontSize: ScreenDetector.isPhone() ? 10 : 20,
        color: COLORS.gray_200,
        marginBottom: 0,
        marginTop: 0,
        paddingTop: 0,
        paddingBottom: 0,
    },
    searchIconContainer: {
        paddingHorizontal: ScreenDetector.isPhone() ? 5 : 10,
    },
    searchBtn: {
        width: 18,
        height: 19,
        marginHorizontal: 5,
    },
    clearTextBtn: {
        width: 10,
        height: 10,
        marginHorizontal: 5,
    },
});