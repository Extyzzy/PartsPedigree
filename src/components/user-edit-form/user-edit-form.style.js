import { StyleSheet } from "react-native";
import { height, width } from "../../utils/Screensize";


const inputStyle =
    {
        width: '100%',
        height: 30,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        color: 'white'
    };

const countryInputStyle = {
    ...inputStyle,
    lineHeight: 30,
};

export const userEditStyle = StyleSheet.create({
    smallText: {
        color: 'lightgray',
        fontSize: 10,
        textAlign: 'center'
    },
    fixScrollBottomGap: {
        marginBottom: height(5)
    },
    signInBtn: {
        alignSelf: 'flex-end',
        marginTop: 10,
        marginBottom: 20,
        color: 'white'
    },
    radialGradient: {
        width: width(100),
        height: height(100),
    },
    submitBtn: {
        width: '100%'
    },
    container: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: width(100),
        height: height(100)
    },
    inputLabel: {
        alignSelf: 'flex-start',
        color: '#ffffff7f',
        fontSize: 12
    },
    input: inputStyle,
    countryInput: countryInputStyle,
    countryContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    countryNameContainer: {
      flexDirection: 'row',
      padding: 5,
      marginTop: 10,
    },
    country: {
      color: "#fff",
      marginLeft: 5
    },
    countryInputContainer: {},
    passwordRequirements: {
        fontSize: 10
    }
});