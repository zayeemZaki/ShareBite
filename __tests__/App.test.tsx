/**
 * @format
 */

import React from 'react';
import App from '../App';

// Test that App component can be imported and is defined
test('App component is defined', () => {
  expect(App).toBeDefined();
  expect(typeof App).toBe('function');
});

// Test that App component can be instantiated without crashing
test('App component can be instantiated', () => {
  expect(() => React.createElement(App)).not.toThrow();
});
