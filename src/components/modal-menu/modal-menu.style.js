import { StyleSheet } from 'react-native';

export const modalMenuStyle = StyleSheet.create({
    menuContainer: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 5,
    },
    menuItem: {
        borderColor: 'rgba(0,0,0,.5)',
        borderBottomWidth: 1,
    },
    menuItemText: {
        textAlign: 'center',
        paddingVertical: 15,
        fontSize: 20,
    },
    menuCancelBtn: {
        fontWeight: 'bold',
        paddingHorizontal: 10,
    }
});
