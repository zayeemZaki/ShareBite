import 'react-native';
import React from 'react';
import App from '../App';

it('App renders without crashing', () => {
  expect(() => React.createElement(App)).not.toThrow();
});
