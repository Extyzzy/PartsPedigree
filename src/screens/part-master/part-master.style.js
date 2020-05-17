import { StyleSheet } from 'react-native';
import { VARIABLES } from "../../styles/variables";

export const partMasterStyle = StyleSheet.create({
    sectionHeader: {
        backgroundColor: '#8F9CAB',
        paddingTop: 5,
        paddingBottom: 5
    },
    timelineSectionHeader: {
        backgroundColor: '#9ACB9C',
        paddingTop: 5,
        paddingBottom: 5
    },
    sectionHeaderLabel: {
        color: 'white',
        alignSelf: 'center',
        fontSize: 12,
        fontWeight: 'bold'
    },
    sectionContent: {
        padding: 15,
        backgroundColor: '#EAEAEA',
    },
    nameDateRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    exportViewMoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    primaryFieldLabel: {
        fontSize: VARIABLES.H5_SIZE,
        fontWeight: 'bold'
    },
    primaryFieldValue: {
        fontSize:  VARIABLES.H5_SIZE,
        fontWeight: 'bold'
    },
    dateCreatedField: {
        flex: 0,
        fontSize: 10,
        color: '#8F9CAB',
        marginTop: 5
    },
    secondaryFieldLabel: {
        fontSize:  VARIABLES.TEXT_SIZE_SM,
        fontWeight: 'bold'
    },
    secondaryFieldValue: {},
    fieldLabelSection: {
        marginTop: 5,
        marginBottom: 5
    },
    exportField: {
        borderRadius: 0,
        flex: 0,
        marginRight: 20,
        paddingLeft: 0,
        borderColor: 'black'
    },
    exportFieldCaption: {
        color: '#CB3538',
        fontSize: VARIABLES.TEXT_SIZE_SM,
        fontWeight: 'bold'
    },
    smallGray: {
        color: '#8F9CAB',
        fontSize: VARIABLES.TEXT_SIZE_XS
    },
    smallGrayBtn: {
        height: 30
    },
    alertIcon: {
        marginRight: 5
    },
    grayBtn: {
        backgroundColor: '#8F9CAB',
        justifyContent: 'center',
        height: 30,
        paddingLeft: 10,
        paddingRight: 10
    },
    fabGrayBtn: {
        backgroundColor: '#8F9CAB',
        paddingHorizontal: 15,
        position: 'absolute',
        bottom: 15,
        alignSelf: 'center',
        borderRadius: 15,
        height: 40,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 2.5,
        shadowOpacity: 0.5
    },
    grayBtnLabel: {
        color: 'white',
        fontSize: 10,
        alignItems: 'center',
        textAlign: 'center',
    },
    fabGrayBtnLabel: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14
    },
    timelineItemContainer: {
        padding: 15,
        backgroundColor: 'white',
        marginVertical: 2,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 0.5,
        },
        shadowRadius: 1,
        shadowOpacity: 0.5,
    },
    timelineItemName: {
        fontWeight: 'bold',
        fontSize: 14
    },
    timelineItemDescription: {
        marginTop: 10,
        marginBottom: 10
    },
    overlayView: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0
    },
    attachmentsHeader: {
        width: '100%'
    },
    tabsAttachmentsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});
