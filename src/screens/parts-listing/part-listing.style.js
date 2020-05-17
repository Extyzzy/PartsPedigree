import { StyleSheet } from 'react-native';

export const partListingStyle = StyleSheet.create({
    container: {
        backgroundColor: '#eaeaea',
        paddingVertical: 2,
        flex: 1,
    },
    partItemContainer: {
        padding: 15,
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 0.5,
        },
        shadowRadius: 1,
        shadowOpacity: 0.5,
    },
    flexRow: {
        flexDirection: 'row',
        flex: 1,
    },
    flexSpaceBetween: {
        justifyContent: 'space-between',
    },
    titleText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
    },
    infoText: {
        fontSize: 14,
    },
    infoTextTitle: {
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 12,
        color: '#a7a7a7',
        fontWeight: 'bold',
    },
    gutter: {
        marginBottom: 20,
    },
    sectionTitleContainer: {
        backgroundColor: '#cccccc',
        paddingVertical: 3,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 0.5,
        },
        shadowRadius: 1,
        shadowOpacity: 0.8,
    },
    sectionTitleText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#000000'
    },
    viewMoreBtnText: {
        textAlign: 'center',
        color: '#b8b9f7',
        fontSize: 14,
    }
});
