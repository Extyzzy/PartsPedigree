import { width, height } from '../utils/Screensize';

export const inlineHeader = {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    borderBottomWidth: 0,
    paddingVertical: 15,
}

export const btn = {
    height: 50
}

export const submitBtn = {
    height: 50,
    marginTop: 15,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderRadius: 15
}


export const submitBtnCaption = {
    color: '#ffffff'
};

export const navbar = {
    headerStyle: {
        backgroundColor: '#40576e',
        borderBottomWidth: 0,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowRadius: 1,
        flex: 1,
        shadowOpacity: 0.3,
    },
    headerTitleStyle: {
        color: 'white',
        fontWeight: 'normal',
        alignSelf: 'center',
        textAlign: 'center',
        flex: 1,
        fontSize: 16,
        justifyContent: 'center',
    },
    headerTintColor: 'white',
}

export const whiteColor = {
    color: 'white'
}

export const blueLink = {
    color: '#3a9cc3',
    textDecorationLine: 'underline'
}

export const button = {
    minWidth: width(20),
    backgroundColor: '#8F9CAB',
    justifyContent: 'center'
}

export const buttonOutline = {
    ...button,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#8F9CAB'
}

export const buttonCaption = {
    color: 'white',
}

export const buttonCaptionOutline = {
    color: '#8F9CAB',
}

export const captureBtn = {
    width: width(20),
    height: width(20),
    backgroundColor: '#718eaf',
    justifyContent: 'center'
}

export const disabledCaptureBtn = { ...captureBtn, backgroundColor: '#BCC9D7' };

export const captureBtnIcon = {
    color: 'white',
    fontSize: width(15),
    lineHeight: width(20 - 1),
    height: width(20)
}
export const uploadBtnIcon = {
    ...captureBtnIcon,
    fontSize: width(10)
}

export const validationErrorText = {
    minHeight: 18,
    fontSize: 14,
    color: 'red',
    maxWidth: '95%'
}

export const validationErrorTextLight = {
    ...validationErrorText,
    color: '#ff9999'
};

export const grayColor = {
    color: '#8F9CAB',
}