import React from 'react'
import { Dimensions } from 'react-native'

const window = Dimensions.get('window');
export const width = (pers) => {
    return pers / 100 * window.width
}
export const height = (pers) => {
    return pers / 100 * window.height
}