import { StyleSheet } from 'react-native';
import { ScreenDetector } from "../../utils/screen-detector";

export const tabsHeaderStyle = StyleSheet.create({
    container: {
        //backgroundColor: '#40576e',
        paddingTop: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#ffffff',
        borderWidth: 1,
        flex: 0.8,
        height: 35,
        borderRadius: 20,
        alignItems: 'center',
        marginRight: 10,
        paddingHorizontal: 10,
    },
    textInput: {
        width: 150,
        color: '#ffffff',
        marginBottom: 0,
        marginTop: 0,
        paddingTop: 0,
        paddingBottom: 0,
    },
    cameraBtn: {
        width: ScreenDetector.isPhone() ? 28 : 35,
        height: ScreenDetector.isPhone() ? 22 : 29,
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
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    tabsContainerScroll: {
        flexDirection: 'row',
    },
    tabText: {
        color: '#ffffff',
        fontSize: 13,
        marginRight: 10,
        //marginTop: 15
    },
    tabTextWhiteBg: {
        color: '#666666',
        fontWeight: 'bold',
    },
    activeTabText: {
        color: '#ccccff',
    },
    activeTabTextWhiteBg: {
        color: '#9999ff',
        fontWeight: 'bold',
    },
    errText: {
        color: '#ff9999',
        paddingHorizontal: 35,
        fontSize: 12,
        paddingTop: 5
    },
    whiteBg: {
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 1,
        shadowOpacity: 0.6,
        marginTop: 10,
        backgroundColor: '#eaeaea',
        width: '100%'
    }
});

//9d9cfe
