import { AppRegistry } from 'react-native';
import { App } from './src/App';
import { iconsLoaded } from './src/utils/Appicons';
console.disableYellowBox = true;
iconsLoaded
    .then(() => {

    })
    .catch((err) => {
        console.error(err);
    });
AppRegistry.registerComponent('PartsPedigree', () => App);