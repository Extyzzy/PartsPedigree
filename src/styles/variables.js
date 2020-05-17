import { ScreenDetector } from "../utils/screen-detector";

export const COLORS = {
    blue: '#0808cc',

    red: '#cd3333',

    gray: '#ccc',
    gray_50: '#eaeaea',
    gray_200: '#8e9cac',

    green: '#9ACB9C',
    lightGreen: '#2caa31',

    black: '#000000',
    white: '#ffffff',
};

export const VARIABLES = {
    H1_SIZE: ScreenDetector.isPhone() ? 32 : 48,
    H2_SIZE: ScreenDetector.isPhone() ? 21 : 34,
    H3_SIZE: ScreenDetector.isPhone() ? 18 : 28,
    H4_SIZE: ScreenDetector.isPhone() ? 16 : 24,
    H5_SIZE: ScreenDetector.isPhone() ? 15 : 22,
    H6_SIZE: ScreenDetector.isPhone() ? 13 : 18,
    TEXT_SIZE_SM: ScreenDetector.isPhone() ? 14 : 16,
    TEXT_SIZE_XS: 12,
};
