import { StyleSheet } from 'react-native';

export const UserProfileStyle = StyleSheet.create({
    header: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    headerTextBox: {
        justifyContent: 'center',
    },
    listInfoItem: {
        marginVertical: 10,
    },
    text: {
        color: 'white',
        fontSize: 16,
        marginRight: 6
    },
    textBold: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    privacyInfoItem: {
        marginVertical: 2,
        flexDirection: 'row',
    }
});
