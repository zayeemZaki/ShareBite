/**
 * @format
 */

import React from 'react';
import App from '../App';

// Simple test to ensure App component can be imported and doesn't crash
test('App component exists', () => {
  expect(App).toBeDefined();
  expect(typeof App).toBe('function');
});
