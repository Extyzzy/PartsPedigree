import { PixelRatio } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';

const replaceSuffixPattern = /--(active|big|small|very-big)/g;
const IONICONS = {
    // 'ios-film-outline': [30]
};
const EVILICONS = {
    // 'user': [40]
};
const SIMPLELINEICONS = {
    // 'lock': [25]
};

const iconsMap = {};

/*
 * One should to wait and preload all icons used in wix's react-native-navigation Header (Navbar).
 * So that these icons will be able for Header.
 */

function fontLoadImageSource(name, icons, iconLib) {
    iconsMap[name] = {};
    return Promise
        .all(
            Object.keys(icons).map(iconName =>
                // IconName--suffix--other-suffix is just the mapping name in iconsMap
                iconLib.getImageSource(
                    iconName.replace(replaceSuffixPattern, ''),
                    icons[iconName][0],
                    icons[iconName][1]
                )))
        .then(sources => Promise.resolve(
            Object.keys(icons)
                .forEach((iconName, idx) => (iconsMap[name][iconName] = sources[idx]))
        ));
}

const iconsLoaded = new Promise((resolve, reject) =>
    Promise.all(
        fontLoadImageSource('ion', IONICONS, Ionicons),
        fontLoadImageSource('evil', EVILICONS, EvilIcons),
        fontLoadImageSource('simpleline', SIMPLELINEICONS, SimpleLineIcon)
    )
        .then(resolve)
        .catch(reject)
);

export {
    iconsMap,
    iconsLoaded
};
