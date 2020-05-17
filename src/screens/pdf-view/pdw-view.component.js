import React, { PureComponent } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import PdfComponent from 'react-native-pdf';
import { ScreenDetector } from "../../utils/screen-detector";

export class PdfView extends PureComponent {
    onError(error) {
        console.log(error);
        Alert.alert('Error', 'Load pdf failed.');
    }

    render() {
        const { params } = this.props.navigation.state;

        return (
            <View style={styles.container}>
                <PdfComponent
                    style={styles.pdf}
                    source={{ uri: params.url }}
                    onError={error => this.onError(error)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width: ScreenDetector.ScreenWidth(),
    }
});