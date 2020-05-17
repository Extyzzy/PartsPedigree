import React from 'react';
import { View } from 'native-base';

export const ContainerBG = props => {
  return (
      <View style={{ backgroundColor: "#40566f", flex: 1, height: '100%'}}>
        <View style={{  height: '100%'}} {...props}>
          {props.children}
        </View>
      </View>
  );
}
