import { StyleSheet } from 'react-native';

export const userProfileEditStyle = StyleSheet.create({
    profileImageContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
    },
    profileImageText: {
        color: 'white',
    },
    btns: {
        flexDirection: 'row',
        marginHorizontal: -5,
    },
    btnConainer: {
        flex: 0.5,
        paddingHorizontal: 5,
    },
    cancelBtn: {
        flex: 1,
        alignItems: 'center',
    },
    cancelBtnText: {
        textAlign: 'center',
        flex: 1,
    }
});
