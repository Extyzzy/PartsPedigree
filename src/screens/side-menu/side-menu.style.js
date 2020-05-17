import { StyleSheet } from 'react-native';

export const SideMenuStyle = StyleSheet.create({
    main: {
        backgroundColor: '#ffffff',
    },
    header: {
        height: 120,
        padding: 20,
        paddingTop: 50,

    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    avatarSmallText: {
        fontSize: 12,
        fontWeight: 'normal',
        fontStyle: 'italic',
    },
    headerBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        paddingBottom: 0,
        alignItems: 'flex-end'
    },
    headerBtnText: {
        color: '#cccbcc',
    },
    content: {
        paddingLeft: 20,
        paddingVertical: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    menuItemIcon: {
        height: 18,
        width: 18,
        marginRight: 20,
    },
    menuDivider: {
        borderBottomWidth: 1,
        borderBottomColor: '#cbcbcb',
        marginBottom: 10,
    }
});
