import React from 'react';
import PropTypes from 'prop-types';
import { Text, Linking } from 'react-native';

export const EmailLink = props => (
  <Text
      {...props}
      onPress={() => Linking.openURL(`mailto:${props.email}`)}
  >{props.email}</Text>
);

EmailLink.propTypes = {
  email: PropTypes.string.isRequired
};
