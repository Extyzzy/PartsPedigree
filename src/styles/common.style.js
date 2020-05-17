import { StyleSheet } from 'react-native';
import { ScreenDetector } from "../utils/screen-detector";
import { COLORS, VARIABLES } from "./variables";
export { COLORS } from './variables';

export const commonStyle = StyleSheet.create({
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowAround: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    flexRow: {
        flexDirection: 'row',
    },
    alignEnd: {
        alignItems: 'flex-end',
    },
    justifyEnd: {
        justifyContent: 'flex-end',
    },
    flexCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    textBold: {
        fontWeight: 'bold',
    },
    textItalic: {
        fontStyle: 'italic',
    },
    inputLabel: {
        color: 'black',
        fontSize: VARIABLES.H6_SIZE,
    },
    input: {
        width: '100%',
        height: ScreenDetector.isPhone() ? 30 : 40,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
    colorBlack: {
        color: 'black',
    },
    textarea: {
        borderWidth: 1,
        borderColor: 'black',
    },
    alignCenter: {
        alignItems: 'center',
    },
    modal: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.7)',
        justifyContent: 'flex-end',
        paddingHorizontal: 15,
        paddingBottom: 10,
    },
    modalContainer: {
        backgroundColor: COLORS.white,
        paddingHorizontal: ScreenDetector.isPhone() ? 10 : 20,
        paddingVertical: ScreenDetector.isPhone() ? 15 : 30,
        borderRadius: 5,
        height: ScreenDetector.isPhone() ? 350 : 550,
    },
    fullSize: {
        height: '100%',
        width: '100%',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
    },
    whiteBg: {
        backgroundColor: 'white',
    },
    transparentBg: {
        backgroundColor: 'transparent',
    },
    line: {
        borderBottomColor: COLORS.gray,
        borderBottomWidth: 1,
    },
});

commonStyle.flex = (n: number) => (
    {
        flex: n
    }
);

commonStyle.indent = (n: number = 15) => (
    {
        marginBottom: n,
    }
);

commonStyle.paddingHorizontal = (n: number) => (
    {
        paddingHorizontal: n,
    }
);

commonStyle.paddingVertical = (n: number) => (
    {
        paddingVertical: n,
    }
);

commonStyle.padding = (n: number) => (
  {
    padding: n,
  }
);

commonStyle.marginHorizontal = (n: number) => (
    {
        marginHorizontal: n,
    }
);

commonStyle.size = (w: number, h: number) => (
    {
        width: w,
        height: h || w,
    }
);

commonStyle.width = (n: number) => (
    {
        width: n,
    }
);

commonStyle.color = (color: string) => ({ color });