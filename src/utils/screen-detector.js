import { Dimensions } from 'react-native';

const MIN_TABLET_WIDTH = 768;
const SMALL_PHONE_WIDTH = 321;

export class ScreenDetector {
    static isSmallScreen(): boolean {
        return ScreenDetector.ScreenWidth() < SMALL_PHONE_WIDTH;
    }

    static isPhone() {
        return ScreenDetector.ScreenWidth() < MIN_TABLET_WIDTH;
    }

    static ScreenWidth(): number {
        return Dimensions.get('window').width;
    }

    static ScreenHeight(): number {
        return Dimensions.get('window').height;
    }
}