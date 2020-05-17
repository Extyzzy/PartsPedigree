import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { general } from "../constants/accessability";

const style = StyleSheet.create({
    container: {
        paddingVertical: 15,
    },
    text: {
        textAlign: 'center',
        fontSize: 16,
    }
});

export const NoResulstsText = (props) => (
    <View style={style.container}>
        <Text style={style.text} accessibilityLabel={general.searchNoResults}>{props.title ? props.title : 'No results found'}</Text>
    </View>
);